/**
 * BuildRepository
 *
 * Data access layer for builds.
 * Handles all database operations using Prisma.
 */

import { BuildType } from "@/types/build.type";
import { buildDetailInclude, buildListingInclude } from "@/utils/actionsUtils";
import { prisma } from "@/lib/prisma";
import { BuildSchema } from "@/types/schema";

export class BuildRepository {
  /**
   * Find a build by ID with full details
   */
  async findById(buildId: number): Promise<BuildType | null> {
    if (!buildId || isNaN(buildId)) {
      return null;
    }

    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: buildDetailInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  }

  /**
   * Find all public builds with listing data
   */
  async findAll(): Promise<BuildType[]> {
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

  /**
   * Check if user liked a specific build
   */
  async hasUserLiked(buildId: number, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        buildId_userId: {
          buildId,
          userId,
        },
      },
    });

    return !!like;
  }
}

// Singleton instance
export const buildRepository = new BuildRepository();
