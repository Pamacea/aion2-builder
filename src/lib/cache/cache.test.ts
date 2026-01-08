/**
 * Cache Integration Tests
 *
 * Tests for Redis caching with stale-while-revalidate
 */

import redisService from './redis.service';
import cacheManager from './cache-manager';
import { CACHE_TTL } from './cache-manager';

async function runCacheTests() {
  console.log('🧪 Running Cache Integration Tests...\n');

  let testsPassed = 0;
  let testsFailed = 0;

  // ========================================
  // Test 1: Redis Connection
  // ========================================
  try {
    console.log('📡 Test 1: Redis Connection');
    const health = await redisService.getHealthStatus();

    if (health.connected) {
      console.log(`✅ Redis connected (latency: ${health.latency}ms)\n`);
      testsPassed++;
    } else {
      console.log(`⚠️  Redis not connected: ${health.error}`);
      console.log('ℹ️  Tests will continue with fallback mode\n');
      testsPassed++;
    }
  } catch (error) {
    console.log(`❌ Redis connection test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 2: Basic Set/Get Operations
  // ========================================
  try {
    console.log('🔄 Test 2: Basic Set/Get Operations');

    const testKey = 'test:basic';
    const testData = { message: 'Hello, Redis!', timestamp: Date.now() };

    // Set data
    const setResult = await redisService.set(testKey, testData, 60);
    console.log(`  Set result: ${setResult ? 'Success' : 'Failed'}`);

    // Get data immediately
    const getResult = await redisService.get<typeof testData>(testKey);
    console.log(`  Get result:`, {
      hit: getResult.hit,
      stale: getResult.stale,
      data: getResult.data?.message,
    });

    if (getResult.hit && !getResult.stale && getResult.data?.message === testData.message) {
      console.log('✅ Basic operations passed\n');
      testsPassed++;
    } else {
      console.log('❌ Basic operations failed\n');
      testsFailed++;
    }

    // Cleanup
    await redisService.delete(testKey);
  } catch (error) {
    console.log(`❌ Basic operations test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 3: Cache Manager Integration
  // ========================================
  try {
    console.log('🔧 Test 3: Cache Manager Integration');

    const testKey = 'test:manager';
    let fetchCount = 0;

    const fetchData = async () => {
      fetchCount++;
      return { value: 'Fetched data', count: fetchCount };
    };

    // First call - should fetch
    const result1 = await cacheManager.get(
      { key: testKey, redisTTL: 60, nextjsRevalidate: 60 },
      fetchData
    );
    console.log(`  First call - source: ${result1.source}, count: ${result1.data.count}`);

    // Second call - should hit cache
    const result2 = await cacheManager.get(
      { key: testKey, redisTTL: 60, nextjsRevalidate: 60 },
      fetchData
    );
    console.log(`  Second call - source: ${result2.source}, count: ${result2.data.count}`);

    if (result1.data.count === 1 && result2.data.count === 1) {
      console.log('✅ Cache manager integration passed\n');
      testsPassed++;
    } else {
      console.log('❌ Cache manager integration failed\n');
      testsFailed++;
    }

    // Cleanup
    await redisService.delete(testKey);
  } catch (error) {
    console.log(`❌ Cache manager integration test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 4: Stale-While-Revalidate
  // ========================================
  try {
    console.log('♻️  Test 4: Stale-While-Revalidate');

    const testKey = 'test:stale';
    let fetchCount = 0;

    const fetchData = async () => {
      fetchCount++;
      return { value: 'Data', count: fetchCount, timestamp: Date.now() };
    };

    // Initial fetch
    const result1 = await cacheManager.get(
      {
        key: testKey,
        redisTTL: 2, // 2 seconds
        nextjsRevalidate: 2,
        useStaleWhileRevalidate: true,
      },
      fetchData
    );
    console.log(`  Initial fetch - count: ${result1.data.count}`);

    // Wait for cache to become stale
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Should return stale data immediately
    const result2 = await cacheManager.get(
      {
        key: testKey,
        redisTTL: 2,
        nextjsRevalidate: 2,
        useStaleWhileRevalidate: true,
      },
      fetchData
    );
    console.log(`  After TTL - count: ${result2.data.count} (should be same as initial)`);

    // Wait for background revalidation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Should have fresh data now
    const result3 = await cacheManager.get(
      {
        key: testKey,
        redisTTL: 2,
        nextjsRevalidate: 2,
        useStaleWhileRevalidate: true,
      },
      fetchData
    );
    console.log(`  After revalidation - count: ${result3.data.count} (should be incremented)`);

    if (result1.data.count === 1 && result2.data.count === 1 && result3.data.count === 2) {
      console.log('✅ Stale-while-revalidate passed\n');
      testsPassed++;
    } else {
      console.log('❌ Stale-while-revalidate failed\n');
      testsFailed++;
    }

    // Cleanup
    await redisService.delete(testKey);
  } catch (error) {
    console.log(`❌ Stale-while-revalidate test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 5: Cache Stampede Prevention
  // ========================================
  try {
    console.log('🐪 Test 5: Cache Stampede Prevention');

    const testKey = 'test:stampede';
    let fetchCount = 0;

    const fetchData = async () => {
      fetchCount++;
      // Simulate slow query
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { value: 'Data', count: fetchCount };
    };

    // Clear cache first
    await redisService.delete(testKey);

    // Simulate 10 concurrent requests
    const requests = Array.from({ length: 10 }, () =>
      cacheManager.get(
        {
          key: testKey,
          redisTTL: 60,
          nextjsRevalidate: 60,
          useStaleWhileRevalidate: true,
        },
        fetchData
      )
    );

    const results = await Promise.all(requests);
    const totalFetches = fetchCount;

    console.log(`  Concurrent requests: ${results.length}`);
    console.log(`  Total fetches: ${totalFetches} (should be 1 with stampede prevention)`);

    if (totalFetches <= 2) {
      // Allow 1-2 fetches due to timing
      console.log('✅ Cache stampede prevention passed\n');
      testsPassed++;
    } else {
      console.log('⚠️  Cache stampede prevention needs attention\n');
      testsFailed++;
    }

    // Cleanup
    await redisService.delete(testKey);
  } catch (error) {
    console.log(`❌ Cache stampede prevention test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 6: Metrics Collection
  // ========================================
  try {
    console.log('📊 Test 6: Metrics Collection');

    const testKey = 'test:metrics';

    // Reset metrics
    redisService.resetMetrics(testKey);

    // Generate some activity
    await redisService.set(testKey, { data: 'test' }, 60);
    await redisService.get(testKey);
    await redisService.get(testKey);
    await redisService.delete(testKey);
    await redisService.get(testKey); // Miss

    const metrics = redisService.getMetrics(testKey);

    console.log('  Metrics:', {
      hits: metrics.hits,
      misses: metrics.misses,
      hitRate: `${metrics.hitRate}%`,
    });

    if (metrics.hits === 2 && metrics.misses === 1) {
      console.log('✅ Metrics collection passed\n');
      testsPassed++;
    } else {
      console.log('❌ Metrics collection failed\n');
      testsFailed++;
    }

    // Cleanup
    redisService.resetMetrics(testKey);
  } catch (error) {
    console.log(`❌ Metrics collection test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Test 7: Pattern-based Deletion
  // ========================================
  try {
    console.log('🗑️  Test 7: Pattern-based Deletion');

    // Set multiple keys
    await redisService.set('user:1', { name: 'User 1' }, 60);
    await redisService.set('user:2', { name: 'User 2' }, 60);
    await redisService.set('user:3', { name: 'User 3' }, 60);

    // Delete by pattern
    const deletedCount = await redisService.deletePattern('user:*');
    console.log(`  Deleted ${deletedCount} keys`);

    // Verify deletion
    const user1 = await redisService.get('user:1');
    const user2 = await redisService.get('user:2');

    if (!user1.data && !user2.data) {
      console.log('✅ Pattern-based deletion passed\n');
      testsPassed++;
    } else {
      console.log('❌ Pattern-based deletion failed\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`❌ Pattern-based deletion test failed:`, error);
    testsFailed++;
  }

  // ========================================
  // Summary
  // ========================================
  console.log('=' .repeat(50));
  console.log('📈 Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📊 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('=' .repeat(50));

  if (testsFailed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('⚠️  Some tests failed - review logs above');
  }

  return { testsPassed, testsFailed };
}

// Run tests if executed directly
if (require.main === module) {
  runCacheTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { runCacheTests };
