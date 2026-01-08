/**
 * Class Cache Service
 *
 * High-performance caching for static class data
 * - Long TTL (10 minutes) - classes rarely change
 * - Redis primary with Next.js fallback
 * - Stale-while-revalidate for always-fast responses
 */

import { unstable_cache } from 'next/cache';
import { ClassType } from '@/types/schema';
import { prisma } from '@/lib/prisma';
import cacheManager, { CACHE_TTL } from '@/lib/cache/cache-manager';

// ========================================
// Cache Tags
// ========================================

export const CLASS_CACHE_TAGS = {
  ALL_CLASSES: 'classes',
  CLASS_PREFIX: (name: string) => `class:${name}`,
};

// ========================================
// Class Cache Service
// ========================================

class ClassCacheService {
  /**
   * Get all classes with caching
   *
   * Uses hybrid caching strategy with:
   * - Redis (primary) with 10 min TTL, stale-while-revalidate
   * - Next.js cache (fallback) with 10 min TTL
   * - Tag: 'classes'
   *
   * @returns Array of all classes
   */
  async getAllClasses(): Promise<ClassType[]> {
    try {
      const { data } = await cacheManager.get<ClassType[]>(
        {
          key: 'classes:all',
          tags: [CLASS_CACHE_TAGS.ALL_CLASSES],
          redisTTL: CACHE_TTL.LONG, // 10 minutes
          nextjsRevalidate: CACHE_TTL.LONG,
          useStaleWhileRevalidate: true,
        },
        async (): Promise<ClassType[]> => {
          return await prisma.class.findMany({
            select: {
              id: true,
              name: true,
              description: true,
              iconUrl: true,
              tags: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              id: 'asc',
            },
          }) as ClassType[];
        }
      );

      return data;
    } catch (error) {
      console.error('[ClassCache] Error fetching all classes:', error);
      return [];
    }
  }

  /**
   * Get a specific class by name with caching
   *
   * Uses hybrid caching strategy with:
   * - Redis (primary) with 10 min TTL, stale-while-revalidate
   * - Next.js cache (fallback) with 10 min TTL
   * - Tags: 'class:{name}', 'classes'
   *
   * @param name - Class name
   * @returns Class object or null if not found
   */
  async getClassByName(name: string): Promise<ClassType | null> {
    if (!name) {
      return null;
    }

    try {
      const { data } = await cacheManager.get<ClassType | null>(
        {
          key: `classes:name:${name}`,
          tags: [CLASS_CACHE_TAGS.CLASS_PREFIX(name), CLASS_CACHE_TAGS.ALL_CLASSES],
          redisTTL: CACHE_TTL.LONG, // 10 minutes
          nextjsRevalidate: CACHE_TTL.LONG,
          useStaleWhileRevalidate: true,
        },
        async (): Promise<ClassType | null> => {
          const cls = await prisma.class.findUnique({
            where: { name },
            include: { tags: true, abilities: true, passives: true, stigmas: true, builds: true },
          });

          return cls as ClassType | null;
        }
      );

      return data;
    } catch (error) {
      console.error(`[ClassCache] Error fetching class ${name}:`, error);
      return null;
    }
  }

  /**
   * Get class tags with caching
   *
   * @param className - Class name
   * @returns Array of tags
   */
  async getClassTags(className: string): Promise<any[]> {
    if (!className) {
      return [];
    }

    try {
      const { data } = await cacheManager.get<any[]>(
        {
          key: `classes:tags:${className}`,
          tags: [CLASS_CACHE_TAGS.CLASS_PREFIX(className), CLASS_CACHE_TAGS.ALL_CLASSES],
          redisTTL: CACHE_TTL.LONG, // 10 minutes
          nextjsRevalidate: CACHE_TTL.LONG,
          useStaleWhileRevalidate: true,
        },
        async (): Promise<any[]> => {
          const cls = await prisma.class.findUnique({
            where: { name: className },
            include: { tags: true },
          });

          return cls?.tags ?? [];
        }
      );

      return data;
    } catch (error) {
      console.error(`[ClassCache] Error fetching tags for class ${className}:`, error);
      return [];
    }
  }

  /**
   * Invalidate all class caches
   *
   * Use this only if class data is manually updated
   */
  async invalidateAll(): Promise<void> {
    const tags = [CLASS_CACHE_TAGS.ALL_CLASSES];
    const keyPatterns = ['classes:*'];

    await cacheManager.invalidate(tags, keyPatterns);
  }

  /**
   * Invalidate specific class cache
   *
   * @param name - Class name to invalidate
   */
  async invalidateClass(name: string): Promise<void> {
    const tags = [CLASS_CACHE_TAGS.CLASS_PREFIX(name), CLASS_CACHE_TAGS.ALL_CLASSES];
    const keyPatterns = [`classes:*`, `classes:name:${name}`, `classes:tags:${name}`];

    await cacheManager.invalidate(tags, keyPatterns);
  }
}

// ========================================
// Singleton Instance
// ========================================

const classCacheService = new ClassCacheService();

export default classCacheService;
