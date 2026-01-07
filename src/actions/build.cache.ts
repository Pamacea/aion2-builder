/**
 * BuildCache
 *
 * Caching strategy for build queries using Next.js unstable_cache
 */

import { unstable_cache } from 'next/cache';
import { cache as reactCache } from 'react';
import { BuildType } from '@/types/schema';
import { buildDetailInclude, buildListingInclude } from '@/utils/actionsUtils';
import { prisma } from '@/lib/prisma';
import { BuildSchema } from '@/types/schema';

export class BuildCache {
  /**
   * Get build by ID with caching
   */
  private getBuildByIdUncached = async (id: number): Promise<BuildType | null> => {
    const build = await prisma.build.findUnique({
      where: { id },
      include: buildDetailInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  };

  private getBuildByIdCached = unstable_cache(
    this.getBuildByIdUncached.bind(this),
    ['build-by-id'],
    {
      revalidate: 60,
      tags: ['builds'],
    }
  );

  async getBuildById(id: number): Promise<BuildType | null> {
    return reactCache(() => this.getBuildByIdCached(id))();
  }

  /**
   * Get all builds with caching
   */
  private getAllBuildsUncached = async (): Promise<BuildType[]> => {
    const builds = await prisma.build.findMany({
      where: { private: false },
      include: buildListingInclude,
      orderBy: { id: 'desc' },
    });

    return builds.map((build) => BuildSchema.parse(build));
  };

  private getAllBuildsCached = unstable_cache(
    this.getAllBuildsUncached.bind(this),
    ['all-builds'],
    {
      revalidate: 60,
      tags: ['builds'],
    }
  );

  async getAllBuilds(): Promise<BuildType[]> {
    return reactCache(() => this.getAllBuildsCached())();
  }
}
