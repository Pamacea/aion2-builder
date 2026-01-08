import { unstable_cache, revalidateTag } from "next/cache";
import { BuildSchema, BuildType } from "@/types/schema";
import { prisma } from "@/lib/prisma";
import { buildDetailInclude, buildListingInclude } from "@/utils/actionsUtils";
import cacheManager, { CACHE_TTL } from "@/lib/cache/cache-manager";

// ========================================
// Cache Configuration
// ========================================

/**
 * Cache tag prefixes for organized invalidation
 *
 * Tags allow for granular cache invalidation:
 * - 'builds' - All build-related caches
 * - 'build-{id}' - Specific build cache
 * - 'builds-listing' - Build listings only
 * - 'builds-detail' - Build details only
 */
export const CACHE_TAGS = {
  ALL_BUILDS: "builds",
  BUILD_PREFIX: (id: number) => `build-${id}`,
  BUILDS_LISTING: "builds-listing",
  BUILDS_DETAIL: "builds-detail",
  USER_BUILDS: (userId: string) => `user-builds-${userId}`,
  LIKED_BUILDS: (userId: string) => `liked-builds-${userId}`,
};

// ========================================
// Build Cache Service
// ========================================

/**
 * BuildCache handles ALL caching logic for builds
 *
 * This service centralizes caching operations to ensure:
 * - Consistent cache keys and tags
 * - Proper cache hierarchy (short TTL for lists, longer for details)
 * - Efficient invalidation strategies
 * - Cache stampede prevention (where possible)
 *
 * Caching Strategy:
 * - Build listings: 5 minutes TTL, tagged with 'builds-listing'
 * - Build details: 1 minute TTL, tagged with 'build-{id}' and 'builds-detail'
 * - User builds: 5 minutes TTL, tagged with 'user-builds-{userId}'
 * - Liked builds: 5 minutes TTL, tagged with 'liked-builds-{userId}'
 *
 * @example
 * ```typescript
 * const cache = new BuildCache();
 *
 * // Get cached build
 * const build = await cache.getBuild(123);
 *
 * // Invalidate build cache
 * cache.invalidateBuild(123);
 * ```
 */
export class BuildCache {
  private readonly ttl = CACHE_TTL;

  // ========================================
  // Single Build Operations
  // ========================================

  /**
   * Get a build by ID (cached)
   *
   * Uses hybrid caching strategy with:
   * - Redis (primary) with 5 min TTL, stale-while-revalidate
   * - Next.js cache (fallback) with 5 min TTL
   * - Tags: 'build-{id}', 'builds-detail', 'builds'
   *
   * @param id - Build ID
   * @returns Build object or null if not found
   */
  async getBuild(id: number): Promise<BuildType | null> {
    if (!id || isNaN(id)) {
      return null;
    }

    try {
      const { data } = await cacheManager.get<BuildType | null>(
        {
          key: `build:${id}`,
          tags: [CACHE_TAGS.BUILD_PREFIX(id), CACHE_TAGS.BUILDS_DETAIL, CACHE_TAGS.ALL_BUILDS],
          redisTTL: CACHE_TTL.MEDIUM, // 5 minutes
          nextjsRevalidate: CACHE_TTL.MEDIUM,
          useStaleWhileRevalidate: true,
        },
        async (): Promise<BuildType | null> => {
          const build = await prisma.build.findUnique({
            where: { id },
            include: buildDetailInclude,
          });

          if (!build) return null;
          return BuildSchema.parse(build);
        }
      );

      return data;
    } catch (error) {
      console.error(`[BuildCache] Error fetching build ${id}:`, error);
      return null;
    }
  }

  /**
   * Cache a build object (manual caching)
   *
   * Useful when you want to manually cache a build after creation/update.
   * Note: unstable_cache is read-only, so this just invalidates to force
   * the next fetch to populate the cache.
   *
   * @param id - Build ID
   * @param build - Build object to cache
   */
  async setBuild(id: number, build: BuildType): Promise<void> {
    // unstable_cache is read-only, so we invalidate to force re-fetch
    this.invalidateBuild(id);
  }

  /**
   * Invalidate cache for a specific build
   *
   * Invalidates all caches tagged with:
   * - 'build-{id}'
   * - 'builds-detail'
   * - 'builds'
   *
   * Also invalidates Redis cache for the specific build
   *
   * Use this after:
   * - Updating a build
   * - Liking/unliking a build
   * - Changing build privacy
   *
   * @param id - Build ID to invalidate
   */
  async invalidateBuild(id: number): Promise<void> {
    const tags = [CACHE_TAGS.BUILD_PREFIX(id), CACHE_TAGS.BUILDS_DETAIL, CACHE_TAGS.ALL_BUILDS];
    const keyPatterns = [`build:${id}`];

    await cacheManager.invalidate(tags, keyPatterns);
  }

  // ========================================
  // Build List Operations
  // ========================================

  /**
   * Get all public builds (cached)
   *
   * Uses hybrid caching strategy with:
   * - Redis (primary) with 5 min TTL, stale-while-revalidate
   * - Next.js cache (fallback) with 5 min TTL
   * - Tags: 'builds-listing', 'builds'
   *
   * @returns Array of public builds
   */
  async getAllBuilds(): Promise<BuildType[]> {
    try {
      const { data } = await cacheManager.get<BuildType[]>(
        {
          key: 'builds:all',
          tags: [CACHE_TAGS.BUILDS_LISTING, CACHE_TAGS.ALL_BUILDS],
          redisTTL: CACHE_TTL.MEDIUM, // 5 minutes
          nextjsRevalidate: CACHE_TTL.MEDIUM,
          useStaleWhileRevalidate: true,
        },
        async (): Promise<BuildType[]> => {
          const builds = await prisma.build.findMany({
            where: {
              private: false,
            },
            include: buildListingInclude,
            orderBy: {
              id: "desc",
            },
          });

          return builds.map((build) => BuildSchema.parse(build));
        }
      );

      return data;
    } catch (error) {
      console.error('[BuildCache] Error fetching all builds:', error);
      return [];
    }
  }

  /**
   * Cache all builds (manual caching)
   *
   * @param builds - Array of builds to cache
   */
  async setAllBuilds(builds: BuildType[]): Promise<void> {
    // Invalidate to force re-fetch
    this.invalidateAllBuilds();
  }

  /**
   * Invalidate cache for build listings
   *
   * Invalidates all caches tagged with:
   * - 'builds-listing'
   * - 'builds'
   *
   * Also invalidates Redis cache for build listings
   *
   * Use this after:
   * - Creating a new public build
   * - Changing build privacy (public <-> private)
   * - Deleting a public build
   */
  async invalidateAllBuilds(): Promise<void> {
    const tags = [CACHE_TAGS.BUILDS_LISTING, CACHE_TAGS.ALL_BUILDS];
    const keyPatterns = ['builds:all', 'builds:*'];

    await cacheManager.invalidate(tags, keyPatterns);
  }

  // ========================================
  // User Build Operations
  // ========================================

  /**
   * Get builds by user ID (cached)
   *
   * Uses unstable_cache with:
   * - 5 minutes TTL
   * - Tags: 'user-builds-{userId}', 'builds-listing', 'builds'
   *
   * @param userId - User ID
   * @returns Array of user's builds
   */
  async getBuildsByUserId(userId: string): Promise<BuildType[]> {
    return unstable_cache(
      async (uid: string): Promise<BuildType[]> => {
        const builds = await prisma.build.findMany({
          where: {
            userId: uid,
          },
          include: buildListingInclude,
          orderBy: {
            id: "desc",
          },
        });

        return builds.map((build) => BuildSchema.parse(build));
      },
      [`user-builds-${userId}`],
      {
        revalidate: this.ttl.MEDIUM,
        tags: [CACHE_TAGS.USER_BUILDS(userId), CACHE_TAGS.BUILDS_LISTING, CACHE_TAGS.ALL_BUILDS],
      }
    )(userId);
  }

  /**
   * Invalidate cache for user's builds
   *
   * Use this after:
   * - User creates a new build
   * - User deletes a build
   * - User changes build privacy
   *
   * @param userId - User ID
   */
  invalidateUserBuilds(userId: string): void {
    revalidateTag(CACHE_TAGS.USER_BUILDS(userId), "max");
    revalidateTag(CACHE_TAGS.BUILDS_LISTING, "max");
    revalidateTag(CACHE_TAGS.ALL_BUILDS, "max");
  }

  // ========================================
  // Liked Builds Operations
  // ========================================

  /**
   * Get builds liked by user (cached)
   *
   * Uses unstable_cache with:
   * - 5 minutes TTL
   * - Tags: 'liked-builds-{userId}', 'builds-listing', 'builds'
   *
   * @param userId - User ID
   * @returns Array of liked builds in chronological order
   */
  async getLikedBuildsByUserId(userId: string): Promise<BuildType[]> {
    return unstable_cache(
      async (uid: string): Promise<BuildType[]> => {
        // Step 1: Get likes with minimal data
        const likes = await prisma.like.findMany({
          where: {
            userId: uid,
          },
          select: {
            buildId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Step 2: Extract buildIds
        const buildIds = likes.map((like) => like.buildId);

        // Step 3: Batch load builds
        if (buildIds.length === 0) {
          return [];
        }

        const builds = await prisma.build.findMany({
          where: {
            id: {
              in: buildIds,
            },
          },
          include: buildListingInclude,
        });

        // Step 4: Create a map for O(1) lookup
        const buildMap = new Map(builds.map((build) => [build.id, build]));

        // Step 5: Map builds back to like order
        const orderedBuilds = likes
          .map((like) => buildMap.get(like.buildId))
          .filter((build): build is NonNullable<typeof build> => build !== undefined);

        return orderedBuilds.map((build) => BuildSchema.parse(build));
      },
      [`liked-builds-${userId}`],
      {
        revalidate: this.ttl.MEDIUM,
        tags: [CACHE_TAGS.LIKED_BUILDS(userId), CACHE_TAGS.BUILDS_LISTING, CACHE_TAGS.ALL_BUILDS],
      }
    )(userId);
  }

  /**
   * Invalidate cache for user's liked builds
   *
   * Use this after:
   * - User likes a build
   * - User unlikes a build
   * - Build is deleted (affects likers' caches)
   *
   * @param userId - User ID
   */
  invalidateLikedBuilds(userId: string): void {
    revalidateTag(CACHE_TAGS.LIKED_BUILDS(userId), "max");
    revalidateTag(CACHE_TAGS.BUILDS_LISTING, "max");
    revalidateTag(CACHE_TAGS.ALL_BUILDS, "max");
  }

  // ========================================
  // Batch Operations
  // ========================================

  /**
   * Tag multiple builds for revalidation
   *
   * Useful when you need to invalidate multiple builds at once.
   *
   * @param buildIds - Array of build IDs to tag
   */
  tagBuilds(buildIds: number[]): void {
    for (const id of buildIds) {
      this.tagBuild(id);
    }
  }

  /**
   * Tag a single build for revalidation
   *
   * This is a lower-level operation that invalidates the build's cache.
   * Use this when you need more control than invalidateBuild provides.
   *
   * @param buildId - Build ID to tag
   */
  tagBuild(buildId: number): void {
    revalidateTag(CACHE_TAGS.BUILD_PREFIX(buildId), "max");
  }

  /**
   * Revalidate a specific tag
   *
   * Low-level operation for custom cache invalidation.
   *
   * @param tag - Tag to revalidate
   */
  revalidateTag(tag: string): void {
    revalidateTag(tag, "max");
  }

  /**
   * Invalidate all build-related caches
   *
   * This is a "nuclear option" that invalidates ALL build caches.
   * Use sparingly - prefer targeted invalidation when possible.
   *
   * Use cases:
   * - Mass imports/updates
   * - Emergency cache flush
   * - Data migration
   */
  invalidateAll(): void {
    revalidateTag(CACHE_TAGS.ALL_BUILDS, "max");
    revalidateTag(CACHE_TAGS.BUILDS_LISTING, "max");
    revalidateTag(CACHE_TAGS.BUILDS_DETAIL, "max");
  }

  // ========================================
  // Cache Statistics (Development)
  // ========================================

  /**
   * Get cache configuration (useful for debugging)
   *
   * @returns Cache TTL settings
   */
  getCacheConfig(): typeof CACHE_TTL {
    return { ...this.ttl };
  }

  /**
   * Get all cache tags for a build
   *
   * Useful for debugging and understanding cache hierarchy.
   *
   * @param buildId - Build ID
   * @returns Array of cache tags
   */
  getBuildTags(buildId: number): string[] {
    return [
      CACHE_TAGS.BUILD_PREFIX(buildId),
      CACHE_TAGS.BUILDS_DETAIL,
      CACHE_TAGS.ALL_BUILDS,
    ];
  }

  /**
   * Get cache tag for user builds
   *
   * @param userId - User ID
   * @returns Cache tag
   */
  getUserBuildsTag(userId: string): string {
    return CACHE_TAGS.USER_BUILDS(userId);
  }

  /**
   * Get cache tag for liked builds
   *
   * @param userId - User ID
   * @returns Cache tag
   */
  getLikedBuildsTag(userId: string): string {
    return CACHE_TAGS.LIKED_BUILDS(userId);
  }
}

// ========================================
// Singleton Instance
// ========================================

/**
 * Default export of singleton BuildCache instance
 *
 * Use this for consistent caching across the application:
 * ```typescript
 * import buildCache from "@/services/build.cache";
 * const build = await buildCache.getBuild(123);
 * ```
 */
const buildCache = new BuildCache();
export default buildCache;
