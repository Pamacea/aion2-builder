/**
 * Cache Monitoring API
 *
 * GET /api/v1/cache - Get cache metrics and health status
 * DELETE /api/v1/cache - Reset cache metrics
 *
 * Protected endpoint - requires admin access
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import cacheManager from '@/lib/cache/cache-manager';
import redisService from '@/lib/cache/redis.service';

// GET /api/v1/cache - Get cache metrics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Admin-only access
    if (!session?.user?.id || session.user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = cacheManager.getMetrics();
    const healthStatus = await redisService.getHealthStatus();

    return NextResponse.json({
      success: true,
      data: {
        redis: {
          ...metrics.redis,
          health: healthStatus,
        },
        aggregate: {
          hits: metrics.redis.hits,
          misses: metrics.redis.misses,
          stale: metrics.redis.stale,
          errors: metrics.redis.errors,
          hitRate: `${metrics.redis.hitRate}%`,
        },
        targets: {
          hitRateTarget: '90%',
          databaseLoadReductionTarget: '80%',
          currentHitRate: `${metrics.redis.hitRate}%`,
        },
        performance: {
          hitRateAchieved: metrics.redis.hitRate >= 90,
          subMillisecondReads: healthStatus.connected && (healthStatus.latency || 0) < 5,
        },
      },
    });
  } catch (error) {
    console.error('[Cache API] Error fetching metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cache metrics',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/cache - Reset cache metrics
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    // Admin-only access
    if (!session?.user?.id || session.user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset metrics
    cacheManager.resetMetrics();

    return NextResponse.json({
      success: true,
      message: 'Cache metrics reset successfully',
    });
  } catch (error) {
    console.error('[Cache API] Error resetting metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset cache metrics',
      },
      { status: 500 }
    );
  }
}
