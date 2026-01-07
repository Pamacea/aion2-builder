import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BuildType } from "@/types/schema";

// ========================================
// Error Types
// ========================================

export class PermissionError extends Error {
  constructor(
    message: string,
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "STARTER_BUILD_LOCKED" | "NOT_FOUND"
  ) {
    super(message);
    this.name = "PermissionError";
  }
}

// ========================================
// Error Constants (for backward compatibility)
// ========================================

export const Errors = {
  UNAUTHORIZED: new PermissionError(
    "You must be authenticated to perform this action",
    "UNAUTHORIZED"
  ),
  FORBIDDEN: new PermissionError(
    "You don't have permission to perform this action",
    "FORBIDDEN"
  ),
  STARTER_BUILD_LOCKED: new PermissionError(
    "Cannot modify starter builds. Please create a new build from the starter build.",
    "STARTER_BUILD_LOCKED"
  ),
  NOT_FOUND: new PermissionError(
    "Build not found",
    "NOT_FOUND"
  ),
};

// ========================================
// Build Permissions Service
// ========================================

/**
 * BuildPermissions handles ALL authorization logic for builds
 *
 * This centralizes permission checks to ensure consistent authorization
 * across the application. It handles:
 * - View permissions (public/private builds)
 * - Modify permissions (ownership and admin checks)
 * - Delete permissions
 * - Starter build protection
 * - Admin role management
 *
 * @example
 * ```typescript
 * const permissions = new BuildPermissions();
 * await permissions.canModifyBuild(userId, buildId); // Throws if unauthorized
 * ```
 */
export class BuildPermissions {
  /**
   * Check if a user can view a build
   *
   * Rules:
   * - Anonymous users can only view public builds
   * - Authenticated users can view their own builds
   * - Admins can view all builds
   * - Public builds are viewable by everyone
   *
   * @param userId - User ID from session, null if anonymous
   * @param build - Build object with userId and private fields
   * @returns true if user can view the build
   */
  canViewBuild(userId: string | null, build: BuildType): boolean {
    // Public builds are viewable by everyone
    if (!build.private) {
      return true;
    }

    // Private builds require authentication
    if (!userId) {
      return false;
    }

    // User can view their own private builds
    if (build.userId === userId) {
      return true;
    }

    // Admins can view all builds
    return this.isAdmin(userId);
  }

  /**
   * Check if a user can modify a build
   *
   * Rules:
   * - User must be authenticated
   * - Build must exist
   * - Starter builds cannot be modified
   * - User must be the owner or an admin
   *
   * @param userId - User ID from session
   * @param buildId - Build ID to check
   * @throws PermissionError if unauthorized
   */
  async canModifyBuild(userId: string, buildId: number): Promise<void> {
    // Fetch build with minimal data (only userId and name for starter check)
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true, name: true },
    });

    if (!build) {
      throw Errors.NOT_FOUND;
    }

    // Check if build is a starter build
    if (this.isStarterBuildByName(build.name)) {
      throw Errors.STARTER_BUILD_LOCKED;
    }

    // Check ownership or admin
    if (build.userId && build.userId !== userId && !this.isAdmin(userId)) {
      throw Errors.FORBIDDEN;
    }
  }

  /**
   * Check if a user can delete a build
   *
   * Rules:
   * - User must be authenticated
   * - Build must exist
   * - Starter builds cannot be deleted
   * - User must be the owner or an admin
   *
   * @param userId - User ID from session
   * @param buildId - Build ID to check
   * @throws PermissionError if unauthorized
   */
  async canDeleteBuild(userId: string, buildId: number): Promise<void> {
    // Fetch build with minimal data
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true, name: true },
    });

    if (!build) {
      throw Errors.NOT_FOUND;
    }

    // Check if build is a starter build
    if (this.isStarterBuildByName(build.name)) {
      throw Errors.STARTER_BUILD_LOCKED;
    }

    // Check ownership or admin
    if (build.userId && build.userId !== userId && !this.isAdmin(userId)) {
      throw Errors.FORBIDDEN;
    }
  }

  /**
   * Check if a build is a starter build
   *
   * Starter builds are templates that cannot be modified or deleted.
   * They are identified by the "-starter-build" suffix in their name.
   *
   * @param build - Build object
   * @returns true if build is a starter build
   */
  isStarterBuild(build: BuildType): boolean {
    return build.name.includes("-starter-build");
  }

  /**
   * Check if a build name indicates a starter build
   *
   * Internal helper used when full build object is not available.
   *
   * @param name - Build name
   * @returns true if build name indicates a starter build
   * @private
   */
  private isStarterBuildByName(name: string): boolean {
    return name.includes("-starter-build");
  }

  /**
   * Check if a user is an admin
   *
   * Admin check is currently done via environment variable (ADMIN_USER_ID).
   * This will be replaced with database role checks in the future.
   *
   * @param userId - User ID to check
   * @returns true if user is admin
   */
  isAdmin(userId: string | null | undefined): boolean {
    if (!userId) return false;

    // Server-side: use ADMIN_USER_ID (preferred) or NEXT_PUBLIC_ADMIN_USER_ID
    if (typeof process !== "undefined" && process.env) {
      const env = process.env as {
        ADMIN_USER_ID?: string;
        NEXT_PUBLIC_ADMIN_USER_ID?: string;
      };
      const adminUserId = env.ADMIN_USER_ID || env.NEXT_PUBLIC_ADMIN_USER_ID || null;

      if (!adminUserId) {
        // Debug: log in development to help troubleshoot
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[BuildPermissions.isAdmin] No ADMIN_USER_ID configured. " +
              "Set ADMIN_USER_ID or NEXT_PUBLIC_ADMIN_USER_ID in .env.local"
          );
        }
        return false;
      }

      return userId === adminUserId;
    }

    return false;
  }

  /**
   * Get the current authenticated user from session
   *
   * @returns Session with user ID, or null if not authenticated
   */
  async getSession(): Promise<{ user?: { id: string } } | null> {
    return await auth();
  }

  /**
   * Require authentication - throws if user is not authenticated
   *
   * @returns User ID
   * @throws PermissionError with UNAUTHORIZED code
   */
  async requireAuth(): Promise<string> {
    const session = await this.getSession();

    if (!session?.user?.id) {
      throw Errors.UNAUTHORIZED;
    }

    return session.user.id;
  }

  /**
   * Require admin privileges - throws if user is not admin
   *
   * @returns User ID
   * @throws PermissionError with FORBIDDEN code
   */
  async requireAdmin(): Promise<string> {
    const userId = await this.requireAuth();

    if (!this.isAdmin(userId)) {
      throw Errors.FORBIDDEN;
    }

    return userId;
  }

  /**
   * Check if user owns the build or is admin
   *
   * @param userId - User ID to check
   * @param build - Build object
   * @returns true if user owns build or is admin
   */
  isOwnerOrAdmin(userId: string, build: BuildType): boolean {
    // Admins can access all builds
    if (this.isAdmin(userId)) {
      return true;
    }

    // Owner can access their own builds
    if (build.userId === userId) {
      return true;
    }

    return false;
  }

  /**
   * Validate build ownership or admin status
   *
   * Useful for middleware-style validation where you need to ensure
   * the user has proper access before proceeding.
   *
   * @param userId - User ID to check
   * @param buildId - Build ID to validate
   * @throws PermissionError if user doesn't have access
   */
  async requireOwnershipOrAdmin(userId: string, buildId: number): Promise<void> {
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true, name: true },
    });

    if (!build) {
      throw Errors.NOT_FOUND;
    }

    if (!this.isOwnerOrAdmin(userId, build as BuildType)) {
      throw Errors.FORBIDDEN;
    }
  }

  /**
   * Check if user can like a build
   *
   * Rules:
   * - User must be authenticated
   * - Build must exist
   * - Users cannot like their own builds (optional, can be enabled)
   *
   * @param userId - User ID from session
   * @param buildId - Build ID to check
   * @throws PermissionError if unauthorized
   */
  async canLikeBuild(userId: string, buildId: number): Promise<void> {
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true },
    });

    if (!build) {
      throw Errors.NOT_FOUND;
    }

    // Optional: Prevent users from liking their own builds
    // if (build.userId === userId) {
    //   throw new PermissionError("You cannot like your own build", "FORBIDDEN");
    // }
  }

  /**
   * Check if user can update build's private status
   *
   * Rules:
   * - User must be authenticated
   * - Build must exist
   * - Only owner can change private status (not even admin)
   *
   * @param userId - User ID from session
   * @param buildId - Build ID to check
   * @throws PermissionError if unauthorized
   */
  async canUpdatePrivateStatus(userId: string, buildId: number): Promise<void> {
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { userId: true },
    });

    if (!build) {
      throw Errors.NOT_FOUND;
    }

    // Only the owner can change private status (not even admin)
    // This is a design choice - privacy settings should be controlled by the owner
    if (build.userId !== userId) {
      throw Errors.FORBIDDEN;
    }
  }

  /**
   * Batch permission check for multiple builds
   *
   * Optimized for checking permissions on lists of builds (e.g., API responses).
   * Returns a map of buildId -> canView boolean.
   *
   * @param userId - User ID from session, null if anonymous
   * @param builds - Array of builds to check
   * @returns Map of buildId to canView boolean
   */
  canViewBuildsBatch(userId: string | null, builds: BuildType[]): Map<number, boolean> {
    const result = new Map<number, boolean>();

    for (const build of builds) {
      result.set(build.id, this.canViewBuild(userId, build));
    }

    return result;
  }

  /**
   * Filter builds based on view permissions
   *
   * Returns only the builds that the user is allowed to view.
   * Useful for API endpoints that return lists of builds.
   *
   * @param userId - User ID from session, null if anonymous
   * @param builds - Array of builds to filter
   * @returns Filtered array of builds
   */
  filterViewableBuilds(userId: string | null, builds: BuildType[]): BuildType[] {
    return builds.filter((build) => this.canViewBuild(userId, build));
  }
}
