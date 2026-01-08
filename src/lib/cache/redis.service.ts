/**
 * Redis Service
 *
 * Production-grade Redis caching service with:
 * - Type-safe operations
 * - Stale-while-revalidate strategy
 * - Cache stampede prevention
 * - Graceful fallback
 * - Connection pooling and health checks
 * - Metrics and monitoring
 */

import Redis from 'ioredis';
import { unstable_cache } from 'next/cache';

// Export types for use in other modules
export type { CacheOptions, CacheResult, CacheMetrics, StaleWhileRevalidateOptions };

// ========================================
// Types & Interfaces
// ========================================

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  staleTtl?: number; // Stale time in seconds (for stale-while-revalidate)
  tags?: string[]; // Cache tags for invalidation
}

interface CacheResult<T> {
  data: T | null;
  hit: boolean;
  stale: boolean;
  source: 'redis' | 'fallback';
}

interface CacheMetrics {
  hits: number;
  misses: number;
  stale: number;
  errors: number;
  hitRate: number;
}

interface StaleWhileRevalidateOptions<T> {
  key: string;
  fetch: () => Promise<T>;
  ttl?: number;
  staleTtl?: number;
  fallback?: () => Promise<T>;
}

// ========================================
// Cache Configuration
// ========================================

const CACHE_TTL = {
  SHORT: 60, // 1 minute - dynamic data
  MEDIUM: 300, // 5 minutes - regular updates
  LONG: 600, // 10 minutes - static data
  VERY_LONG: 3600, // 1 hour - rarely changes
};

const CACHE_PREFIX = 'aion2builder:cache:';

// ========================================
// Redis Service Class
// ========================================

class RedisService {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private metrics: Map<string, { hits: number; misses: number; stale: number; errors: number }>;

  constructor() {
    this.metrics = new Map();
    this.initialize();
  }

  /**
   * Initialize Redis connection
   */
  private async initialize(): Promise<void> {
    // Check if Redis is configured
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      console.warn('[Redis] REDIS_URL not configured, using fallback cache only');
      return;
    }

    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true;
          }
          return false;
        },
        lazyConnect: true,
      });

      // Set up event handlers
      this.client.on('connect', () => {
        console.log('[Redis] Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('[Redis] Connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.warn('[Redis] Connection closed');
        this.isConnected = false;
      });

      // Test connection
      await this.client.connect();
      await this.ping();

    } catch (error) {
      console.error('[Redis] Failed to initialize:', error);
      this.client = null;
      this.isConnected = false;
    }
  }

  // ========================================
  // Connection Management
  // ========================================

  /**
   * Check if Redis is available
   */
  private isAvailable(): boolean {
    return this.client !== null && this.isConnected;
  }

  /**
   * Ping Redis server
   */
  async ping(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
  }> {
    if (!this.client) {
      return { connected: false, error: 'Redis client not initialized' };
    }

    try {
      const start = Date.now();
      await this.client.ping();
      const latency = Date.now() - start;
      return { connected: true, latency };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ========================================
  // Core Cache Operations
  // ========================================

  /**
   * Get value from cache with type safety
   */
  async get<T>(key: string): Promise<CacheResult<T>> {
    const prefixedKey = this.getPrefixedKey(key);

    if (!this.isAvailable()) {
      this.recordMetric(key, 'miss');
      return { data: null, hit: false, stale: false, source: 'fallback' };
    }

    try {
      const value = await this.client!.get(prefixedKey);

      if (!value) {
        this.recordMetric(key, 'miss');
        return { data: null, hit: false, stale: false, source: 'redis' };
      }

      const parsed = JSON.parse(value) as { data: T; expiredAt: number };

      // Check if data is stale
      const isStale = Date.now() > parsed.expiredAt;

      if (isStale) {
        this.recordMetric(key, 'stale');
      } else {
        this.recordMetric(key, 'hit');
      }

      return {
        data: parsed.data,
        hit: true,
        stale: isStale,
        source: 'redis',
      };
    } catch (error) {
      console.error(`[Redis] Get error for key ${key}:`, error);
      this.recordMetric(key, 'error');
      return { data: null, hit: false, stale: false, source: 'fallback' };
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    const prefixedKey = this.getPrefixedKey(key);

    if (!this.isAvailable()) {
      return false;
    }

    try {
      const payload = {
        data: value,
        cachedAt: Date.now(),
        expiredAt: Date.now() + ttl * 1000,
      };

      await this.client!.setex(prefixedKey, ttl, JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error(`[Redis] Set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete specific key
   */
  async delete(key: string): Promise<boolean> {
    const prefixedKey = this.getPrefixedKey(key);

    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.client!.del(prefixedKey);
      return true;
    } catch (error) {
      console.error(`[Redis] Delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const prefixedPattern = this.getPrefixedKey(pattern);
      const keys = await this.client!.keys(prefixedPattern);

      if (keys.length === 0) {
        return 0;
      }

      await this.client!.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`[Redis] Delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Flush all cache (use with caution)
   */
  async flush(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = await this.client!.keys(`${CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await this.client!.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('[Redis] Flush error:', error);
      return false;
    }
  }

  // ========================================
  // Stale-While-Revalidate Strategy
  // ========================================

  /**
   * Stale-while-revalidate with cache stampede prevention
   *
   * Strategy:
   * 1. Check Redis for cached value
   * 2. If found (even if stale), return immediately
   * 3. If stale or not found, revalidate in background
   * 4. Use lock to prevent cache stampedes
   */
  async staleWhileRevalidate<T>(
    options: StaleWhileRevalidateOptions<T>
  ): Promise<CacheResult<T>> {
    const { key, fetch, ttl = CACHE_TTL.MEDIUM, staleTtl = CACHE_TTL.LONG, fallback } = options;
    const lockKey = `${key}:lock`;
    const prefixedKey = this.getPrefixedKey(key);

    if (!this.isAvailable()) {
      // Fallback to Next.js cache or direct fetch
      if (fallback) {
        try {
          const data = await fallback();
          return { data, hit: false, stale: false, source: 'fallback' };
        } catch (error) {
          console.error(`[Redis] Fallback error for key ${key}:`, error);
          return { data: null, hit: false, stale: false, source: 'fallback' };
        }
      }

      try {
        const data = await fetch();
        return { data, hit: false, stale: false, source: 'fallback' };
      } catch (error) {
        console.error(`[Redis] Fetch error for key ${key}:`, error);
        return { data: null, hit: false, stale: false, source: 'fallback' };
      }
    }

    try {
      // Try to get cached value
      const cached = await this.get<T>(key);

      // Return stale data immediately if available
      if (cached.data !== null) {
        // If data is stale, trigger background revalidation
        if (cached.stale) {
          this.revalidateInBackground({ key, fetch, ttl, lockKey });
        }

        return cached;
      }

      // No cache available, try to acquire lock for stampede prevention
      const lockAcquired = await this.acquireLock(lockKey, 10); // 10 second lock

      if (lockAcquired) {
        try {
          // Double-check after acquiring lock (another process might have cached it)
          const doubleCheck = await this.get<T>(key);
          if (doubleCheck.data !== null) {
            await this.releaseLock(lockKey);
            return doubleCheck;
          }

          // Fetch fresh data
          const data = await fetch();

          // Cache with stale TTL
          await this.set(key, data, staleTtl);

          await this.releaseLock(lockKey);

          return { data, hit: false, stale: false, source: 'redis' };
        } catch (error) {
          await this.releaseLock(lockKey);
          throw error;
        }
      } else {
        // Couldn't acquire lock, wait briefly and check cache again
        await this.sleep(100); // Wait 100ms
        const retryCache = await this.get<T>(key);

        if (retryCache.data !== null) {
          return retryCache;
        }

        // Lock holder failed, fetch directly
        const data = await fetch();
        return { data, hit: false, stale: false, source: 'redis' };
      }
    } catch (error) {
      console.error(`[Redis] Stale-while-revalidate error for key ${key}:`, error);
      this.recordMetric(key, 'error');

      // Final fallback
      if (fallback) {
        try {
          const data = await fallback();
          return { data, hit: false, stale: false, source: 'fallback' };
        } catch {
          return { data: null, hit: false, stale: false, source: 'fallback' };
        }
      }

      return { data: null, hit: false, stale: false, source: 'fallback' };
    }
  }

  /**
   * Background revalidation (fire and forget)
   */
  private async revalidateInBackground<T>(options: {
    key: string;
    fetch: () => Promise<T>;
    ttl: number;
    lockKey: string;
  }): Promise<void> {
    const { key, fetch, ttl, lockKey } = options;

    // Don't wait for this promise
    (async () => {
      try {
        // Check if revalidation is already in progress
        const lockExists = await this.client!.exists(this.getPrefixedKey(lockKey));
        if (lockExists) {
          return; // Another process is already revalidating
        }

        // Acquire lock
        const lockAcquired = await this.acquireLock(lockKey, 30); // 30 second lock
        if (!lockAcquired) {
          return;
        }

        try {
          // Fetch fresh data
          const data = await fetch();

          // Update cache
          await this.set(key, data, ttl);
        } finally {
          await this.releaseLock(lockKey);
        }
      } catch (error) {
        console.error(`[Redis] Background revalidation error for key ${key}:`, error);
      }
    })().catch((error) => {
      console.error(`[Redis] Unhandled background revalidation error:`, error);
    });
  }

  // ========================================
  // Lock Mechanism (Cache Stampede Prevention)
  // ========================================

  private async acquireLock(key: string, ttl: number): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const result = await this.client!.set(
        this.getPrefixedKey(key),
        '1',
        'EX',
        ttl,
        'NX'
      );
      return result === 'OK';
    } catch {
      return false;
    }
  }

  private async releaseLock(key: string): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      await this.client!.del(this.getPrefixedKey(key));
    } catch (error) {
      console.error(`[Redis] Release lock error for key ${key}:`, error);
    }
  }

  // ========================================
  // Metrics & Monitoring
  // ========================================

  private recordMetric(
    key: string,
    type: 'hit' | 'miss' | 'stale' | 'error'
  ): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, { hits: 0, misses: 0, stale: 0, errors: 0 });
    }

    const metric = this.metrics.get(key)!;

    switch (type) {
      case 'hit':
        metric.hits++;
        break;
      case 'miss':
        metric.misses++;
        break;
      case 'stale':
        metric.stale++;
        break;
      case 'error':
        metric.errors++;
        break;
    }
  }

  /**
   * Get metrics for a specific key or all keys
   */
  getMetrics(key?: string): CacheMetrics | Map<string, CacheMetrics> {
    if (key) {
      const metric = this.metrics.get(key);
      if (!metric) {
        return { hits: 0, misses: 0, stale: 0, errors: 0, hitRate: 0 };
      }

      const total = metric.hits + metric.misses + metric.stale;
      const hitRate = total > 0 ? (metric.hits / total) * 100 : 0;

      return {
        hits: metric.hits,
        misses: metric.misses,
        stale: metric.stale,
        errors: metric.errors,
        hitRate: Math.round(hitRate * 100) / 100,
      };
    }

    // Return all metrics
    const result = new Map<string, CacheMetrics>();

    for (const [k, metric] of this.metrics.entries()) {
      const total = metric.hits + metric.misses + metric.stale;
      const hitRate = total > 0 ? (metric.hits / total) * 100 : 0;

      result.set(k, {
        hits: metric.hits,
        misses: metric.misses,
        stale: metric.stale,
        errors: metric.errors,
        hitRate: Math.round(hitRate * 100) / 100,
      });
    }

    return result;
  }

  /**
   * Reset metrics for a key or all keys
   */
  resetMetrics(key?: string): void {
    if (key) {
      this.metrics.delete(key);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Get aggregate metrics across all keys
   */
  getAggregateMetrics(): CacheMetrics {
    let hits = 0;
    let misses = 0;
    let stale = 0;
    let errors = 0;

    for (const metric of this.metrics.values()) {
      hits += metric.hits;
      misses += metric.misses;
      stale += metric.stale;
      errors += metric.errors;
    }

    const total = hits + misses + stale;
    const hitRate = total > 0 ? (hits / total) * 100 : 0;

    return {
      hits,
      misses,
      stale,
      errors,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  // ========================================
  // Utilities
  // ========================================

  private getPrefixedKey(key: string): string {
    return `${CACHE_PREFIX}${key}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }
}

// ========================================
// Singleton Instance
// ========================================

const redisService = new RedisService();

export default redisService;
export { CACHE_TTL, CACHE_PREFIX };
