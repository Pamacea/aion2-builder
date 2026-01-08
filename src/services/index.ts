/**
 * Services Module
 *
 * This module exports service classes that handle business logic
 * for AION2Builder builds.
 *
 * Architecture (Hybrid - Simple):
 * ```
 * buildActions.ts (Server Actions)
 *     ↓
 * BuildService (orchestration: repo + permissions + cache)
 *     ↓
 * BuildRepository (data access)
 * BuildPermissions (auth)
 * BuildCache (caching)
 * ```
 *
 * @example
 * ```typescript
 * import { buildService, BuildPermissions, BuildCache } from "@/services";
 * import { buildRepository } from "@/repositories";
 *
 * // Use service for most operations
 * const build = await buildService.getBuild(123);
 *
 * // Use individual services directly if needed
 * const permissions = new BuildPermissions();
 * await permissions.canModifyBuild(userId, buildId);
 *
 * const cache = new BuildCache();
 * const build = await cache.getBuild(buildId);
 *
 * // Use repository for data access
 * const builds = await buildRepository.findByClassId(1);
 * ```
 */

// Re-export build service (main orchestration layer)
export { BuildService } from "./build.service";
export { default as buildService } from "./build.service";

// Re-export permissions service
export {
  BuildPermissions,
  PermissionError,
  Errors,
} from "./build.permissions";

// Re-export cache service
export {
  BuildCache,
  CACHE_TAGS,
} from "./build.cache";

// Re-export cache singleton (default export)
export { default as buildCache } from "./build.cache";
