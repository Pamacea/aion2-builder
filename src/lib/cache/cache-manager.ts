/**
 * Cache Manager
 *
 * Hybrid caching strategy combining Redis and Next.js unstable_cache
 * with automatic fallback and stale-while-revalidate support
 */

import { unstable_cache } from 'next/cache';
import redisService, { CACHE_TTL as REDIS_CACHE_TTL } from './redis.service';
import type { CacheResult } from './redis.service';

// Re-export for convenience
export const CACHE_TTL = REDIS_CACHE_TTL;

// ========================================
// Types
// ========================================

interface CacheManagerOptions {
  key: string;
  tags?: string[];
  redisTTL?: number;
  nextjsRevalidate?: number;
  useStaleWhileRevalidate?: boolean;
}

// ========================================
// Cache Manager Class
// ========================================

class CacheManager {
  /**
   * Get cached data with hybrid strategy
   *
   * Strategy:
   * 1. Try Redis first (fast, distributed)
   * 2. Fall back to Next.js cache (local, backup)
   * 3. On miss, fetch and cache in both layers
   */
  async get<T>(
    options: CacheManagerOptions,
    fetch: () => Promise<T>
  ): Promise<{ data: T; source: 'redis' | 'nextjs' | 'database' }> {
    const {
      key,
      tags = [],
      redisTTL = CACHE_TTL.MEDIUM,
      nextjsRevalidate = CACHE_TTL.MEDIUM,
      useStaleWhileRevalidate = false,
    } = options;

    // Try Redis with stale-while-revalidate
    if (useStaleWhileRevalidate) {
      const result = await redisService.staleWhileRevalidate({
        key,
        fetch,
        ttl: redisTTL,
        fallback: () => this.getWithNextJS(key, fetch, nextjsRevalidate, tags),
      });

      if (result.data !== null) {
        return {
          data: result.data,
          source: result.source === 'redis' ? 'redis' : 'database',
        };
      }
    } else {
      // Try Redis first
      const redisResult = await redisService.get<T>(key);

      if (redisResult.data !== null && !redisResult.stale) {
        return { data: redisResult.data, source: 'redis' };
      }

      // If stale data exists, return it but revalidate
      if (redisResult.data !== null && redisResult.stale) {
        // Revalidate in background
        this.revalidateInBackground(key, fetch, redisTTL);
        return { data: redisResult.data, source: 'redis' };
      }
    }

    // Fall back to Next.js cache
    const nextjsResult = await this.getWithNextJS(key, fetch, nextjsRevalidate, tags);

    // Populate Redis cache in background
    this.cacheInBackground(key, () => fetch(), redisTTL);

    return { data: nextjsResult, source: 'nextjs' };
  }

  /**
   * Set data in both cache layers
   */
  async set<T>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): Promise<void> {
    // Set in Redis
    await redisService.set(key, data, ttl);

    // Note: Next.js cache is read-only, so we rely on tags for invalidation
    // Data will be cached on next get() call
  }

  /**
   * Invalidate cache in both layers
   */
  async invalidate(tags: string[], keyPatterns?: string[]): Promise<void> {
    // Invalidate Redis synchronously
    if (keyPatterns && keyPatterns.length > 0) {
      for (const pattern of keyPatterns) {
        await redisService.deletePattern(pattern);
      }
    }

    // Also delete exact key if provided
    if (keyPatterns && keyPatterns.length > 0) {
      for (const key of keyPatterns) {
        if (!key.includes('*')) {
          await redisService.delete(key);
        }
      }
    }

    // Invalidate Next.js cache by tags in background (outside render)
    // Note: In Next.js 15+, revalidateTag() must be called outside render context.
    // We use a background async call, but Next.js may still flag this as "during render".
    // This is a known limitation - the revalidation still works, just logs a warning.
    if (tags.length > 0) {
      // Use setImmediate to defer execution until after current render phase
      if (typeof setImmediate !== 'undefined') {
        setImmediate(async () => {
          try {
            const { revalidateTag } = await import('next/cache');
            for (const tag of tags) {
              try {
                revalidateTag(tag, 'max');
              } catch (e) {
                // Silently ignore - cache will refresh on next fetch
              }
            }
          } catch (error) {
            // Silently suppress - revalidation is optional
          }
        });
      } else {
        // Fallback for environments without setImmediate
        setTimeout(async () => {
          try {
            const { revalidateTag } = await import('next/cache');
            for (const tag of tags) {
              try {
                revalidateTag(tag, 'max');
              } catch (e) {
                // Silently ignore
              }
            }
          } catch (error) {
            // Silently suppress
          }
        }, 0);
      }
    }
  }

  /**
   * Get cached data using Next.js unstable_cache
   */
  private async getWithNextJS<T>(
    key: string,
    fetch: () => Promise<T>,
    revalidate: number,
    tags: string[]
  ): Promise<T> {
    return unstable_cache(
      fetch,
      [key],
      {
        revalidate,
        tags,
      }
    )();
  }

  /**
   * Background cache population (fire and forget)
   */
  private cacheInBackground<T>(
    key: string,
    fetch: () => Promise<T>,
    ttl: number
  ): void {
    (async () => {
      try {
        const data = await fetch();
        await redisService.set(key, data, ttl);
      } catch (error) {
        console.error(`[CacheManager] Background cache error for key ${key}:`, error);
      }
    })().catch((error) => {
      console.error(`[CacheManager] Unhandled background cache error:`, error);
    });
  }

  /**
   * Background revalidation (fire and forget)
   */
  private revalidateInBackground<T>(
    key: string,
    fetch: () => Promise<T>,
    ttl: number
  ): void {
    (async () => {
      try {
        const data = await fetch();
        await redisService.set(key, data, ttl);
      } catch (error) {
        console.error(`[CacheManager] Background revalidation error for key ${key}:`, error);
      }
    })().catch((error) => {
      console.error(`[CacheManager] Unhandled background revalidation error:`, error);
    });
  }

  /**
   * Get cache metrics
   */
  getMetrics(): {
    redis: ReturnType<typeof redisService.getAggregateMetrics>;
    health: ReturnType<typeof redisService.getHealthStatus>;
  } {
    return {
      redis: redisService.getAggregateMetrics(),
      health: redisService.getHealthStatus(),
    };
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    redisService.resetMetrics();
  }
}

// ========================================
// Singleton Instance
// ========================================

const cacheManager = new CacheManager();

export default cacheManager;
