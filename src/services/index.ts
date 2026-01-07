/**
 * Services Module
 *
 * This module exports service classes that handle business logic
 * for AION2Builder builds.
 *
 * @example
 * ```typescript
 * import { BuildPermissions, BuildCache } from "@/services";
 *
 * const permissions = new BuildPermissions();
 * const cache = new BuildCache();
 *
 * // Check permissions
 * await permissions.canModifyBuild(userId, buildId);
 *
 * // Cache operations
 * const build = await cache.getBuild(buildId);
 * cache.invalidateBuild(buildId);
 * ```
 */

// Re-export permissions service
export {
  BuildPermissions,
  PermissionError,
  Errors,
} from "./build.permissions";

// Re-export cache service
export {
  BuildCache,
  CACHE_TTL,
  CACHE_TAGS,
} from "./build.cache";

// Re-export cache singleton (default export)
export { default as buildCache } from "./build.cache";

// TODO: BuildService is under construction
// export { BuildService } from "./build.service";
// export { default as buildService } from "./build.service";
// export type {
//   BuildCreateInput,
//   BuildUpdateInput,
//   DaevanionInput,
//   BuildFilter,
// } from "./build.service";
