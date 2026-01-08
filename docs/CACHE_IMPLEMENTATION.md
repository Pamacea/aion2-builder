# Redis Caching Implementation

## Overview

Production-grade Redis caching with stale-while-revalidate strategy, providing:
- Sub-millisecond cache reads
- 90%+ cache hit rate target
- 80% reduction in database load
- Graceful fallback to Next.js cache
- Cache stampede prevention

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      Cache Manager Layer        │
│  (Hybrid Redis + Next.js)       │
└──────┬──────────────────────────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌─────────────┐  ┌──────────┐  ┌──────────┐
│   Redis     │  │ Next.js  │  │ Database │
│ (Primary)   │  │  Cache   │  │ (Source) │
└─────────────┘  └──────────┘  └──────────┘
```

## Configuration

### Environment Variables

```bash
# Redis Configuration (.env.local)
REDIS_URL=redis://localhost:6379
REDIS_TLS_ENABLED=false

# Leave empty to disable Redis (falls back to Next.js cache)
REDIS_URL=
```

### TTL Settings

| Data Type | TTL | Strategy |
|-----------|-----|----------|
| Build Listings | 5 min | Stale-while-revalidate |
| Build Details | 5 min | Stale-while-revalidate |
| Class Data | 10 min | Stale-while-revalidate |
| User Builds | 5 min | Tag-based invalidation |
| Liked Builds | 5 min | Tag-based invalidation |

## Usage

### Basic Caching

```typescript
import cacheManager from '@/lib/cache/cache-manager';

const { data, source } = await cacheManager.get(
  {
    key: 'builds:all',
    tags: ['builds'],
    redisTTL: 300, // 5 minutes
    nextjsRevalidate: 300,
    useStaleWhileRevalidate: true,
  },
  async () => {
    return await prisma.build.findMany();
  }
);
```

### Cache Invalidation

```typescript
import buildCache from '@/services/build.cache';

// Invalidate specific build
await buildCache.invalidateBuild(buildId);

// Invalidate all builds
await buildCache.invalidateAllBuilds();

// Invalidate user builds
await buildCache.invalidateUserBuilds(userId);
```

### Stale-While-Revalidate

```typescript
const result = await redisService.staleWhileRevalidate({
  key: 'builds:all',
  fetch: async () => await prisma.build.findMany(),
  ttl: 300, // Fresh TTL
  staleTtl: 600, // Stale TTL
  fallback: async () => await getNextJSCache(),
});
```

## Features

### 1. Stale-While-Revalidate

- **Return stale data immediately** - No waiting for cache refresh
- **Background revalidation** - Non-blocking cache updates
- **Prevents cache stampedes** - Lock-based coordination

### 2. Cache Stampede Prevention

- **Distributed locks** - Only one process refreshes cache
- **Lock timeout** - Prevents deadlocks
- **Retry mechanism** - Graceful handling of lock contention

### 3. Graceful Fallback

- **Redis unavailable?** → Falls back to Next.js cache
- **Next.js cache fails?** → Direct database query
- **Zero downtime** - Always returns data

### 4. Metrics & Monitoring

```typescript
// Get aggregate metrics
const metrics = cacheManager.getMetrics();
// {
//   redis: { hits: 1000, misses: 100, hitRate: 90.91 },
//   health: { connected: true, latency: 2 }
// }

// Get metrics via API
GET /api/v1/cache
```

### 5. Pattern-based Invalidation

```typescript
// Delete all user builds
await redisService.deletePattern('user:*');

// Delete all class caches
await redisService.deletePattern('classes:*');
```

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Cache Hit Rate | 90% | Measured via metrics |
| Database Load Reduction | 80% | Measured via metrics |
| Cache Read Latency | < 1ms | Measured via health check |
| Cache Write Latency | < 5ms | Measured via health check |

## Monitoring

### Health Check Endpoint

```bash
GET /api/v1/cache

Response:
{
  "success": true,
  "data": {
    "redis": {
      "hits": 1000,
      "misses": 100,
      "hitRate": 90.91,
      "health": {
        "connected": true,
        "latency": 2
      }
    },
    "targets": {
      "hitRateTarget": "90%",
      "currentHitRate": "90.91%"
    },
    "performance": {
      "hitRateAchieved": true,
      "subMillisecondReads": true
    }
  }
}
```

### Manual Testing

```bash
# Run cache integration tests
npx tsx src/lib/cache/cache.test.ts

# Check Redis connection
npx tsx -e "import redisService from './src/lib/cache/redis.service'; redisService.getHealthStatus().then(console.log);"
```

## Troubleshooting

### Redis Not Connected

```bash
# Check if Redis is running
redis-cli ping

# Check connection string
echo $REDIS_URL

# Test connection
redis-cli -u $REDIS_URL ping
```

### Low Cache Hit Rate

1. **Check TTL settings** - May be too short for your use case
2. **Monitor cache keys** - Use `redis-cli KEYS "aion2builder:*"` to see cached data
3. **Review invalidation** - May be invalidating too aggressively

### High Memory Usage

```bash
# Check Redis memory usage
redis-cli INFO memory

# Set max memory policy
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Implementation Files

```
src/lib/cache/
├── redis.service.ts        # Redis client with stale-while-revalidate
├── cache-manager.ts        # Hybrid cache manager (Redis + Next.js)
├── cache.test.ts           # Integration tests
└── README.md               # This file

src/services/
├── build.cache.ts          # Build-specific caching
└── class.cache.ts          # Class-specific caching
```

## Best Practices

### DO ✅

- Use stale-while-revalidate for frequently accessed data
- Set appropriate TTLs based on data change frequency
- Invalidate caches after mutations
- Monitor cache hit rates and latency
- Use pattern-based deletion for bulk invalidation

### DON'T ❌

- Don't cache user-specific sensitive data
- Don't set excessive TTLs (max 1 hour)
- Don't forget to invalidate on updates
- Don't cache large payloads (> 1MB)
- Don't ignore cache errors (log them!)

## Migration Path

### Phase 1: Redis Setup (Current)
- ✅ Install ioredis
- ✅ Create Redis service
- ✅ Implement stale-while-revalidate
- ✅ Add monitoring

### Phase 2: Apply Caching
- ✅ Build listings (5 min TTL)
- ✅ Build details (5 min TTL)
- ✅ Class data (10 min TTL)
- ✅ Add invalidation on mutations

### Phase 3: Optimization
- ⏳ Tune TTL based on hit rates
- ⏳ Implement cache warming
- ⏳ Add compression for large payloads
- ⏳ Set up Redis cluster for high availability

### Phase 4: Advanced Features
- ⏳ Cache prefetching
- ⏳ Intelligent cache warming
- ⏳ Query result caching
- ⏳ Real-time cache analytics

## Support

For issues or questions:
1. Check logs in Redis service: `[Redis]` prefix
2. Check logs in Cache Manager: `[CacheManager]` prefix
3. Review metrics via `/api/v1/cache` endpoint
4. Run integration tests to verify functionality

---

**Status**: ✅ Phase 3 Week 4 - Implementation Complete

**Performance Targets**:
- 90% cache hit rate 🎯
- 80% database load reduction 🎯
- Sub-millisecond cache reads 🎯

**Next Steps**:
1. Configure Redis in production
2. Monitor metrics for 24-48 hours
3. Tune TTLs based on actual usage patterns
4. Implement cache warming for cold starts
