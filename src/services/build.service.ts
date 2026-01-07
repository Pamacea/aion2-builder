/**
 * BuildService
 *
 * Service layer that orchestrates build operations.
 * Delegates to:
 * - BuildRepository (data access)
 * - BuildPermissions (authorization)
 * - BuildCache (caching)
 *
 * Responsibilities:
 * - Coordinate between repository, permissions, and cache
 * - NO business logic (keep it simple for a fan project)
 * - NO validation (handled by Zod schemas in actions)
 * - NO transactions (Prisma handles basic ones)
 *
 * Architecture:
 * buildActions.ts (Server Actions)
 *   ↓
 * BuildService (orchestration)
 *   ↓
 * BuildRepository (data) + BuildPermissions (auth) + BuildCache (cache)
 */

import { BuildType } from "@/types/build.type";
import { buildRepository } from "@/repositories/build.repository";
import { BuildPermissions } from "./build.permissions";
import buildCache from "./build.cache";

export class BuildService {
  constructor(
    private repo = buildRepository,
    private permissions = new BuildPermissions(),
    private cache = buildCache
  ) {}

  // ================================================================
  // READ OPERATIONS
  // ================================================================

  /**
   * Get a build by ID (with cache)
   *
   * @param id - Build ID
   * @returns Build object or null if not found
   */
  async getBuild(id: number): Promise<BuildType | null> {
    const cached = await this.cache.getBuild(id);
    if (cached) return cached;

    const build = await this.repo.findById(id);
    if (build) await this.cache.setBuild(id, build);
    return build;
  }

  /**
   * Get all public builds (with cache)
   *
   * @returns Array of public builds
   */
  async getAllBuilds(): Promise<BuildType[]> {
    return await this.cache.getAllBuilds();
  }

  /**
   * Get builds by user ID (with cache)
   *
   * @param userId - User ID
   * @returns Array of user's builds
   */
  async getUserBuilds(userId: string): Promise<BuildType[]> {
    return await this.cache.getBuildsByUserId(userId);
  }

  /**
   * Get builds liked by user (with cache)
   *
   * @param userId - User ID
   * @returns Array of liked builds
   */
  async getLikedBuilds(userId: string): Promise<BuildType[]> {
    return await this.cache.getLikedBuildsByUserId(userId);
  }

  /**
   * Get builds by class ID
   *
   * @param classId - Class ID
   * @returns Array of builds for the class
   */
  async getBuildsByClass(classId: number): Promise<BuildType[]> {
    return await this.repo.findByClassId(classId);
  }

  /**
   * Get starter builds (templates)
   *
   * @returns Array of starter builds
   */
  async getStarterBuilds(): Promise<BuildType[]> {
    return await this.repo.findStarterBuilds();
  }

  // ================================================================
  // WRITE OPERATIONS
  // ================================================================

  /**
   * Create a new build (with permissions + cache invalidation)
   *
   * @param userId - User ID from session
   * @param data - Build data
   * @returns Created build
   */
  async createBuild(
    userId: string,
    data: {
      name: string;
      classId: number;
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
    }
  ): Promise<BuildType> {
    await this.permissions.requireAuth();

    const build = await this.repo.create({
      ...data,
      userId,
    });

    // Invalidate caches
    this.cache.invalidateUserBuilds(userId);
    this.cache.invalidateAllBuilds();

    return build;
  }

  /**
   * Update a build (with permissions + cache invalidation)
   *
   * @param userId - User ID from session
   * @param buildId - Build ID
   * @param data - Partial build data to update
   * @returns Updated build
   */
  async updateBuild(
    userId: string,
    buildId: number,
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
    await this.permissions.canModifyBuild(userId, buildId);

    const updated = await this.repo.update(buildId, data);
    this.cache.invalidateBuild(buildId);

    return updated;
  }

  /**
   * Delete a build (with permissions + cache invalidation)
   *
   * @param userId - User ID from session
   * @param buildId - Build ID
   */
  async deleteBuild(userId: string, buildId: number): Promise<void> {
    await this.permissions.canDeleteBuild(userId, buildId);

    await this.repo.delete(buildId);
    this.cache.invalidateBuild(buildId);
    this.cache.invalidateUserBuilds(userId);
  }

  // ================================================================
  // LIKE OPERATIONS
  // ================================================================

  /**
   * Toggle like on a build (with permissions + cache invalidation)
   *
   * @param userId - User ID from session
   * @param buildId - Build ID
   * @returns New like state (true if liked, false if unliked)
   */
  async toggleLike(userId: string, buildId: number): Promise<boolean> {
    await this.permissions.canLikeBuild(userId, buildId);

    const liked = await this.repo.hasUserLiked(buildId, userId);

    if (liked) {
      // Unlike: find and delete the like record
      const like = await this.repo.findLike(buildId, userId);
      if (like) {
        await this.repo.deleteLike(like.id);
      }
    } else {
      // Like: create new like record
      await this.repo.createLike(buildId, userId);
    }

    // Invalidate caches
    this.cache.invalidateBuild(buildId);
    this.cache.invalidateLikedBuilds(userId);

    return !liked; // Return new state
  }

  /**
   * Check if user liked a build
   *
   * @param buildId - Build ID
   * @param userId - User ID
   * @returns True if user liked the build
   */
  async hasUserLiked(buildId: number, userId: string): Promise<boolean> {
    return await this.repo.hasUserLiked(buildId, userId);
  }

  /**
   * Count likes for a build
   *
   * @param buildId - Build ID
   * @returns Number of likes
   */
  async countLikes(buildId: number): Promise<number> {
    return await this.repo.countLikes(buildId);
  }

  // ================================================================
  // PERMISSION HELPERS
  // ================================================================

  /**
   * Check if user can view a build
   *
   * @param userId - User ID from session (null if anonymous)
   * @param build - Build object
   * @returns True if user can view the build
   */
  canViewBuild(userId: string | null, build: BuildType): boolean {
    return this.permissions.canViewBuild(userId, build);
  }

  /**
   * Get current session
   *
   * @returns Session with user ID, or null if not authenticated
   */
  async getSession() {
    return await this.permissions.getSession();
  }
}

// Singleton instance
export const buildService = new BuildService();
export default buildService;
