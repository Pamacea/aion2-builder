/**
 * BuildRepository
 *
 * Data access layer for builds.
 * Handles all database operations using Prisma.
 *
 * Responsibilities:
 * - Pure CRUD operations with Prisma
 * - NO business logic
 * - NO permissions/authorization
 * - NO caching
 * - Returns typed data using BuildSchema
 */

import { BuildType } from "@/types/build.type";
import {
  buildDetailInclude,
  buildListingInclude,
  fullBuildInclude,
} from "@/utils/actionsUtils";
import { prisma } from "@/lib/prisma";
import { BuildSchema } from "@/types/schema";

export class BuildRepository {
  // ================================================================
  // READ OPERATIONS
  // ================================================================

  /**
   * Find a build by ID with full details (buildDetailInclude)
   * Use for detail pages where you need full skill data
   */
  async findById(id: number): Promise<BuildType | null> {
    if (!id || isNaN(id)) {
      return null;
    }

    const build = await prisma.build.findUnique({
      where: { id },
      include: buildDetailInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  }

  /**
   * Find a build by ID with listing data (buildListingInclude)
   * Use for cards, tables, and list views
   */
  async findByIdWithListing(id: number): Promise<BuildType | null> {
    if (!id || isNaN(id)) {
      return null;
    }

    const build = await prisma.build.findUnique({
      where: { id },
      include: buildListingInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  }

  /**
   * Find a build by ID with full relations (fullBuildInclude)
   * Use when you need all data including likes with user info
   */
  async findByIdWithFullRelations(id: number): Promise<BuildType | null> {
    if (!id || isNaN(id)) {
      return null;
    }

    const build = await prisma.build.findUnique({
      where: { id },
      include: fullBuildInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  }

  /**
   * Find builds with optional filters
   */
  async findMany(filters: {
    classId?: number;
    userId?: string;
    private?: boolean;
  } = {}): Promise<BuildType[]> {
    const where: {
      classId?: number;
      userId?: string;
      private?: boolean;
    } = {};

    if (filters.classId !== undefined) {
      where.classId = filters.classId;
    }

    if (filters.userId !== undefined) {
      where.userId = filters.userId;
    }

    if (filters.private !== undefined) {
      where.private = filters.private;
    }

    const builds = await prisma.build.findMany({
      where,
      include: buildListingInclude,
      orderBy: {
        id: "desc",
      },
    });

    return builds.map((build) => BuildSchema.parse(build));
  }

  /**
   * Find all public builds with listing data
   */
  async findAll(): Promise<BuildType[]> {
    return this.findMany({ private: false });
  }

  /**
   * Find builds by user ID
   */
  async findByUserId(userId: string): Promise<BuildType[]> {
    return this.findMany({ userId });
  }

  /**
   * Find builds by class ID
   */
  async findByClassId(classId: number): Promise<BuildType[]> {
    return this.findMany({ classId, private: false });
  }

  /**
   * Get all starter builds (builds with no userId)
   */
  async findStarterBuilds(): Promise<BuildType[]> {
    const builds = await prisma.build.findMany({
      where: {
        userId: null,
      },
      include: buildListingInclude,
      orderBy: {
        id: "asc",
      },
    });

    return builds.map((build) => BuildSchema.parse(build));
  }

  /**
   * Get liked builds by user ID
   * Returns builds ordered by like creation date
   */
  async findLikedByUser(userId: string): Promise<BuildType[]> {
    // Get likes ordered by creation date
    const likes = await prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        buildId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (likes.length === 0) {
      return [];
    }

    const buildIds = likes.map((like) => like.buildId);

    // Batch load builds
    const builds = await prisma.build.findMany({
      where: {
        id: {
          in: buildIds,
        },
      },
      include: buildListingInclude,
    });

    // Create map for O(1) lookup
    const buildMap = new Map(builds.map((build) => [build.id, build]));

    // Map builds back to like order
    const orderedBuilds = likes
      .map((like) => buildMap.get(like.buildId))
      .filter((build): build is NonNullable<typeof build> => build !== undefined);

    return orderedBuilds.map((build) => BuildSchema.parse(build));
  }

  /**
   * Count builds for pagination
   */
  async countByClass(classId: number): Promise<number> {
    return await prisma.build.count({
      where: {
        classId,
        private: false,
      },
    });
  }

  /**
   * Count total builds
   */
  async count(filters: {
    classId?: number;
    userId?: string;
    private?: boolean;
  } = {}): Promise<number> {
    const where: {
      classId?: number;
      userId?: string;
      private?: boolean;
    } = {};

    if (filters.classId !== undefined) {
      where.classId = filters.classId;
    }

    if (filters.userId !== undefined) {
      where.userId = filters.userId;
    }

    if (filters.private !== undefined) {
      where.private = filters.private;
    }

    return await prisma.build.count({ where });
  }

  // ================================================================
  // WRITE OPERATIONS
  // ================================================================

  /**
   * Create a new build with all relations
   */
  async create(data: {
    name: string;
    classId: number;
    userId?: string | null;
    baseSP?: number;
    extraSP?: number;
    baseSTP?: number;
    extraSTP?: number;
    private?: boolean;
    abilities?: Array<{
      abilityId: number;
      level: number;
      maxLevel?: number;
      activeSpecialtyChoiceIds?: number[];
      selectedChainSkillIds?: number[];
    }>;
    passives?: Array<{
      passiveId: number;
      level: number;
      maxLevel?: number;
    }>;
    stigmas?: Array<{
      stigmaId: number;
      level?: number;
      maxLevel?: number;
      stigmaCost?: number;
      activeSpecialtyChoiceIds?: number[];
      selectedChainSkillIds?: number[];
    }>;
    daevanion?: {
      nezekan: number[];
      zikel: number[];
      vaizel: number[];
      triniel: number[];
      ariel: number[];
      azphel: number[];
    } | null;
  }): Promise<BuildType> {
    const newBuild = await prisma.build.create({
      data: {
        name: data.name,
        classId: data.classId,
        userId: data.userId,
        baseSP: data.baseSP,
        extraSP: data.extraSP,
        baseSTP: data.baseSTP,
        extraSTP: data.extraSTP,
        private: data.private,
        abilities: {
          create:
            data.abilities?.map((a) => ({
              abilityId: a.abilityId,
              level: a.level,
              maxLevel: a.maxLevel,
              activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
              selectedChainSkillIds: a.selectedChainSkillIds ?? [],
            })) ?? [],
        },
        passives: {
          create:
            data.passives?.map((p) => ({
              passiveId: p.passiveId,
              level: p.level,
              maxLevel: p.maxLevel,
            })) ?? [],
        },
        stigmas: {
          create:
            data.stigmas?.map((s) => ({
              stigmaId: s.stigmaId,
              level: s.level ?? 0,
              maxLevel: s.maxLevel,
              stigmaCost: s.stigmaCost ?? 10,
              activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds ?? [],
              selectedChainSkillIds: s.selectedChainSkillIds ?? [],
            })) ?? [],
        },
        daevanion: data.daevanion
          ? {
              create: data.daevanion,
            }
          : undefined,
      },
      include: fullBuildInclude,
    });

    return BuildSchema.parse(newBuild);
  }

  /**
   * Update a build
   * Supports partial updates of any field
   */
  async update(
    id: number,
    data: Partial<{
      name: string;
      classId: number;
      baseSP: number;
      extraSP: number;
      baseSTP: number;
      extraSTP: number;
      shortcuts: Record<string, unknown> | null;
      shortcutLabels: Record<string, string> | null;
      private: boolean;
      abilities: Array<{
        abilityId: number;
        level: number;
        maxLevel?: number;
        activeSpecialtyChoiceIds?: number[];
        selectedChainSkillIds?: number[];
      }>;
      passives: Array<{
        passiveId: number;
        level: number;
        maxLevel?: number;
      }>;
      stigmas: Array<{
        stigmaId: number;
        level: number;
        maxLevel?: number;
        stigmaCost?: number;
        activeSpecialtyChoiceIds?: number[];
        selectedChainSkillIds?: number[];
      }>;
      daevanion: {
        nezekan: number[];
        zikel: number[];
        vaizel: number[];
        triniel: number[];
        ariel: number[];
        azphel: number[];
      } | null;
    }>
  ): Promise<BuildType> {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.classId !== undefined) {
      updateData.classId = data.classId;
    }

    if (data.baseSP !== undefined) {
      updateData.baseSP = data.baseSP;
    }

    if (data.extraSP !== undefined) {
      updateData.extraSP = data.extraSP;
    }

    if (data.baseSTP !== undefined) {
      updateData.baseSTP = data.baseSTP;
    }

    if (data.extraSTP !== undefined) {
      updateData.extraSTP = data.extraSTP;
    }

    if (data.shortcuts !== undefined) {
      updateData.shortcuts = data.shortcuts;
    }

    if (data.shortcutLabels !== undefined) {
      updateData.shortcutLabels = data.shortcutLabels;
    }

    if (data.private !== undefined) {
      updateData.private = data.private;
    }

    if (data.abilities !== undefined) {
      updateData.abilities = {
        deleteMany: { buildId: id },
        create: data.abilities.map((a) => ({
          abilityId: a.abilityId,
          level: a.level,
          maxLevel: a.maxLevel,
          activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
          selectedChainSkillIds: a.selectedChainSkillIds ?? [],
        })),
      };
    }

    if (data.passives !== undefined) {
      updateData.passives = {
        deleteMany: { buildId: id },
        create: data.passives.map((p) => ({
          passiveId: p.passiveId,
          level: p.level,
          maxLevel: p.maxLevel,
        })),
      };
    }

    if (data.stigmas !== undefined) {
      updateData.stigmas = {
        deleteMany: { buildId: id },
        create: data.stigmas.map((s) => ({
          stigmaId: s.stigmaId,
          level: s.level,
          maxLevel: s.maxLevel,
          stigmaCost: s.stigmaCost ?? 10,
          activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds ?? [],
          selectedChainSkillIds: s.selectedChainSkillIds ?? [],
        })),
      };
    }

    if (data.daevanion !== undefined) {
      updateData.daevanion = {
        upsert: {
          create: data.daevanion,
          update: data.daevanion,
        },
      };
    }

    const updated = await prisma.build.update({
      where: { id },
      data: updateData,
      include: fullBuildInclude,
    });

    return BuildSchema.parse(updated);
  }

  /**
   * Delete a build
   * This will cascade delete all relations (BuildDaevanion, Like, etc.)
   */
  async delete(id: number): Promise<void> {
    await prisma.build.delete({
      where: { id },
    });
  }

  // ================================================================
  // LIKE OPERATIONS
  // ================================================================

  /**
   * Count likes for a build
   */
  async countLikes(buildId: number): Promise<number> {
    return await prisma.like.count({
      where: { buildId },
    });
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

  /**
   * Find like record by build and user
   */
  async findLike(buildId: number, userId: string) {
    return await prisma.like.findUnique({
      where: {
        buildId_userId: {
          buildId,
          userId,
        },
      },
    });
  }

  /**
   * Create a like
   */
  async createLike(buildId: number, userId: string): Promise<void> {
    await prisma.like.create({
      data: {
        buildId,
        userId,
      },
    });
  }

  /**
   * Delete a like
   */
  async deleteLike(likeId: number): Promise<void> {
    await prisma.like.delete({
      where: { id: likeId },
    });
  }

  // ================================================================
  // SPECIALIZED UPDATE OPERATIONS (optimized)
  // ================================================================

  /**
   * Update daevanion only (optimized)
   */
  async updateDaevanion(
    buildId: number,
    daevanionData: {
      nezekan: number[];
      zikel: number[];
      vaizel: number[];
      triniel: number[];
      ariel: number[];
      azphel: number[];
    }
  ): Promise<void> {
    await prisma.buildDaevanion.upsert({
      where: { buildId },
      create: {
        buildId,
        ...daevanionData,
      },
      update: daevanionData,
    });
  }

  /**
   * Update ability level only (optimized)
   */
  async updateAbilityLevel(
    buildId: number,
    abilityId: number,
    level: number
  ): Promise<void> {
    await prisma.buildAbility.updateMany({
      where: {
        buildId,
        abilityId,
      },
      data: { level },
    });
  }

  /**
   * Update passive level only (optimized)
   */
  async updatePassiveLevel(
    buildId: number,
    passiveId: number,
    level: number
  ): Promise<void> {
    await prisma.buildPassive.updateMany({
      where: {
        buildId,
        passiveId,
      },
      data: { level },
    });
  }

  /**
   * Update stigma level only (optimized)
   */
  async updateStigmaLevel(
    buildId: number,
    stigmaId: number,
    level: number
  ): Promise<void> {
    await prisma.buildStigma.updateMany({
      where: {
        buildId,
        stigmaId,
      },
      data: { level },
    });
  }

  /**
   * Update ability specialty choices only (optimized)
   */
  async updateAbilitySpecialtyChoices(
    buildId: number,
    abilityId: number,
    activeSpecialtyChoiceIds: number[]
  ): Promise<void> {
    await prisma.buildAbility.updateMany({
      where: {
        buildId,
        abilityId,
      },
      data: { activeSpecialtyChoiceIds },
    });
  }

  /**
   * Update stigma specialty choices only (optimized)
   */
  async updateStigmaSpecialtyChoices(
    buildId: number,
    stigmaId: number,
    activeSpecialtyChoiceIds: number[]
  ): Promise<void> {
    await prisma.buildStigma.updateMany({
      where: {
        buildId,
        stigmaId,
      },
      data: { activeSpecialtyChoiceIds },
    });
  }

  /**
   * Update ability chain skills only (optimized)
   */
  async updateAbilityChainSkills(
    buildId: number,
    abilityId: number,
    selectedChainSkillIds: number[]
  ): Promise<void> {
    await prisma.buildAbility.updateMany({
      where: {
        buildId,
        abilityId,
      },
      data: { selectedChainSkillIds },
    });
  }

  /**
   * Update stigma chain skills only (optimized)
   */
  async updateStigmaChainSkills(
    buildId: number,
    stigmaId: number,
    selectedChainSkillIds: number[]
  ): Promise<void> {
    await prisma.buildStigma.updateMany({
      where: {
        buildId,
        stigmaId,
      },
      data: { selectedChainSkillIds },
    });
  }

  /**
   * Update stigma cost only (optimized)
   */
  async updateStigmaCost(
    buildId: number,
    stigmaId: number,
    stigmaCost: number
  ): Promise<void> {
    await prisma.buildStigma.updateMany({
      where: {
        buildId,
        stigmaId,
      },
      data: { stigmaCost },
    });
  }

  // ================================================================
  // ADD/REMOVE OPERATIONS (optimized)
  // ================================================================

  /**
   * Add ability to build (optimized)
   */
  async addAbility(
    buildId: number,
    abilityId: number,
    level: number,
    maxLevel: number,
    activeSpecialtyChoiceIds: number[] = [],
    selectedChainSkillIds: number[] = []
  ): Promise<void> {
    const existing = await prisma.buildAbility.findFirst({
      where: { buildId, abilityId },
    });

    if (existing) {
      await prisma.buildAbility.update({
        where: { id: existing.id },
        data: { level },
      });
    } else {
      await prisma.buildAbility.create({
        data: {
          buildId,
          abilityId,
          level,
          maxLevel,
          activeSpecialtyChoiceIds,
          selectedChainSkillIds,
        },
      });
    }
  }

  /**
   * Add passive to build (optimized)
   */
  async addPassive(
    buildId: number,
    passiveId: number,
    level: number,
    maxLevel: number
  ): Promise<void> {
    const existing = await prisma.buildPassive.findFirst({
      where: { buildId, passiveId },
    });

    if (existing) {
      await prisma.buildPassive.update({
        where: { id: existing.id },
        data: { level },
      });
    } else {
      await prisma.buildPassive.create({
        data: {
          buildId,
          passiveId,
          level,
          maxLevel,
        },
      });
    }
  }

  /**
   * Add stigma to build (optimized)
   */
  async addStigma(
    buildId: number,
    stigmaId: number,
    level: number,
    maxLevel: number,
    stigmaCost: number,
    activeSpecialtyChoiceIds: number[] = [],
    selectedChainSkillIds: number[] = []
  ): Promise<void> {
    const existing = await prisma.buildStigma.findFirst({
      where: { buildId, stigmaId },
    });

    if (existing) {
      await prisma.buildStigma.update({
        where: { id: existing.id },
        data: { level },
      });
    } else {
      await prisma.buildStigma.create({
        data: {
          buildId,
          stigmaId,
          level,
          maxLevel,
          stigmaCost,
          activeSpecialtyChoiceIds,
          selectedChainSkillIds,
        },
      });
    }
  }

  /**
   * Remove ability from build (optimized)
   */
  async removeAbility(buildId: number, abilityId: number): Promise<void> {
    await prisma.buildAbility.deleteMany({
      where: { buildId, abilityId },
    });
  }

  /**
   * Remove passive from build (optimized)
   */
  async removePassive(buildId: number, passiveId: number): Promise<void> {
    await prisma.buildPassive.deleteMany({
      where: { buildId, passiveId },
    });
  }

  /**
   * Remove stigma from build (optimized)
   */
  async removeStigma(buildId: number, stigmaId: number): Promise<void> {
    await prisma.buildStigma.deleteMany({
      where: { buildId, stigmaId },
    });
  }
}

// Singleton instance
export const buildRepository = new BuildRepository();
