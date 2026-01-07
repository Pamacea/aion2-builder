# Build Services

This directory contains service classes that handle business logic for AION2Builder builds.

## Services

### BuildPermissions

Handles ALL authorization logic for builds.

**Usage:**

```typescript
import { BuildPermissions } from "@/services";

const permissions = new BuildPermissions();

// Check if user can modify build
try {
  await permissions.canModifyBuild(userId, buildId);
  // User can modify
} catch (error) {
  if (error instanceof PermissionError) {
    console.error(error.code); // UNAUTHORIZED, FORBIDDEN, etc.
    console.error(error.message);
  }
}

// Check if user can view build
const canView = permissions.canViewBuild(userId, build);

// Check if user is admin
const isAdmin = permissions.isAdmin(userId);

// Require authentication
const userId = await permissions.requireAuth();
```

**Key Methods:**

- `canViewBuild(userId, build)` - Check view permissions
- `canModifyBuild(userId, buildId)` - Check modify permissions (throws if unauthorized)
- `canDeleteBuild(userId, buildId)` - Check delete permissions (throws if unauthorized)
- `isStarterBuild(build)` - Check if build is a starter build
- `isAdmin(userId)` - Check if user is admin
- `requireAuth()` - Require authentication (throws if not authenticated)
- `requireAdmin()` - Require admin privileges (throws if not admin)
- `canLikeBuild(userId, buildId)` - Check if user can like build
- `canUpdatePrivateStatus(userId, buildId)` - Check if user can update private status

**Error Codes:**

- `UNAUTHORIZED` - User must be authenticated
- `FORBIDDEN` - User doesn't have permission
- `STARTER_BUILD_LOCKED` - Cannot modify starter builds
- `NOT_FOUND` - Build not found

### BuildCache

Handles ALL caching logic for builds.

**Usage:**

```typescript
import buildCache from "@/services/build.cache";

// Get cached build
const build = await buildCache.getBuild(123);

// Get all public builds (cached)
const builds = await buildCache.getAllBuilds();

// Get user's builds (cached)
const userBuilds = await buildCache.getBuildsByUserId(userId);

// Invalidate cache after update
buildCache.invalidateBuild(123);

// Invalidate user's builds
buildCache.invalidateUserBuilds(userId);

// Nuclear option - invalidate all build caches
buildCache.invalidateAll();
```

**Key Methods:**

**Single Build Operations:**
- `getBuild(id)` - Get build by ID (cached, 1 min TTL)
- `setBuild(id, build)` - Manual cache (invalidates to force re-fetch)
- `invalidateBuild(id)` - Invalidate specific build cache

**Build List Operations:**
- `getAllBuilds()` - Get all public builds (cached, 5 min TTL)
- `setAllBuilds(builds)` - Manual cache (invalidates to force re-fetch)
- `invalidateAllBuilds()` - Invalidate build listings cache

**User Build Operations:**
- `getBuildsByUserId(userId)` - Get user's builds (cached, 5 min TTL)
- `invalidateUserBuilds(userId)` - Invalidate user's builds cache

**Liked Builds Operations:**
- `getLikedBuildsByUserId(userId)` - Get liked builds (cached, 5 min TTL)
- `invalidateLikedBuilds(userId)` - Invalidate liked builds cache

**Batch Operations:**
- `tagBuilds(buildIds)` - Tag multiple builds for revalidation
- `tagBuild(buildId)` - Tag single build for revalidation
- `revalidateTag(tag)` - Revalidate specific tag
- `invalidateAll()` - Invalidate ALL build caches (nuclear option)

**Cache TTL:**

- `SHORT` (60s) - Build details
- `MEDIUM` (300s) - Build listings, user builds
- `LONG` (3600s) - Not currently used

**Cache Tags:**

- `builds` - All build-related caches
- `build-{id}` - Specific build cache
- `builds-listing` - Build listings only
- `builds-detail` - Build details only
- `user-builds-{userId}` - User's builds
- `liked-builds-{userId}` - Liked builds

## Integration Example

Here's how to use both services together in an API route:

```typescript
import { NextResponse } from "next/server";
import { BuildPermissions, BuildCache } from "@/services";

const permissions = new BuildPermissions();
const cache = new BuildCache();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const buildId = parseInt(params.id);

  try {
    // Check authentication
    const userId = await permissions.requireAuth();

    // Check permissions
    await permissions.canModifyBuild(userId, buildId);

    // Update build...
    // const updatedBuild = await updateBuild(...);

    // Invalidate cache
    cache.invalidateBuild(buildId);

    return NextResponse.json({ success: true, data: updatedBuild });
  } catch (error) {
    if (error instanceof PermissionError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.code === "UNAUTHORIZED" ? 401 : 403 }
      );
    }
    throw error;
  }
}
```

## Migration Notes

### From buildActions.ts

**Before:**
```typescript
// Old way - scattered permission checks
const session = await auth();
if (isStarterBuild(data)) {
  throw new Error("Cannot modify starter builds");
}
const userIsAdmin = isAdmin(session?.user?.id);
if (data.userId && session?.user?.id !== data.userId && !userIsAdmin) {
  throw new Error("Unauthorized");
}
```

**After:**
```typescript
// New way - centralized permission checks
const permissions = new BuildPermissions();
await permissions.canModifyBuild(userId, buildId);
```

**Before:**
```typescript
// Old way - manual cache calls
revalidateTag('builds', 'max');
revalidatePath(`/build/${buildId}`, 'page');
```

**After:**
```typescript
// New way - semantic cache invalidation
import buildCache from "@/services/build.cache";
buildCache.invalidateBuild(buildId);
```

## Best Practices

1. **Always use BuildPermissions for authorization**
   - Never check permissions directly in actions
   - Let the service handle all logic

2. **Always use BuildCache for caching**
   - Never call `revalidateTag` directly in business logic
   - Use semantic methods like `invalidateBuild`

3. **Error handling**
   - Catch `PermissionError` for proper error responses
   - Map error codes to HTTP status codes

4. **Cache invalidation**
   - Invalidate cache AFTER successful database update
   - Use specific invalidation methods when possible
   - Only use `invalidateAll()` for bulk operations

5. **Testing**
   - Mock both services in tests
   - Test permission checks thoroughly
   - Test cache behavior with integration tests
