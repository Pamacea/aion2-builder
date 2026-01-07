# BuildService - Business Logic Layer Documentation

## Overview

The BuildService is the business logic layer for all Build-related operations in AION2Builder. It follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│                   (buildActions.ts)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                      │
│                  (BuildService.ts)                          │
│  • Validates inputs                                         │
│  • Checks permissions                                       │
│  • Coordinates operations                                   │
│  • Manages transactions                                     │
└───┬───────────────┬───────────────────┬────────────────────┘
    │               │                   │
    ▼               ▼                   ▼
┌─────────┐  ┌─────────────┐  ┌──────────────┐
│  Repo   │  │ Permissions │  │    Cache     │
└─────────┘  └─────────────┘  └──────────────┘
```

## Architecture Components

### 1. BuildService (`src/services/build.service.ts`)

**Responsibilities:**
- Orchestrates business logic
- Validates inputs using Zod schemas
- Checks permissions via BuildPermissions
- Persists data via BuildRepository
- Manages cache invalidation via BuildCache
- Handles transactions
- Throws proper errors for client handling

**Key Methods:**
- `getBuildById(id)` - Get single build with caching
- `getAllBuilds(filter?)` - List builds with caching
- `getBuildsByUserId(userId)` - Get user's builds
- `createBuild(userId, data)` - Create new build
- `updateBuild(userId, buildId, data)` - Update build
- `duplicateBuild(userId, buildId)` - Duplicate build
- `deleteBuild(userId, buildId)` - Delete build
- `toggleLike(userId, buildId)` - Toggle like on build
- `hasUserLiked(userId, buildId)` - Check if user liked build
- `updateDaevanion(userId, buildId, daevanion)` - Update daevanion
- `getStarterBuilds()` - Get all starter builds
- `getStarterBuildByClass(classId)` - Get starter build for class
- Plus 20+ optimized operations for partial updates

### 2. BuildRepository (`src/repositories/build.repository.ts`)

**Responsibilities:**
- Data access layer
- Database operations via Prisma
- Transaction management
- Query optimization with selective includes
- Raw data access (no business logic)

**Key Methods:**
- `findById(id)` - Find build by ID
- `findByIdFull(id)` - Find with all relations
- `findAll(filter?)` - List builds with filters
- `create(data)` - Create new build
- `update(id, data)` - Update build
- `delete(id)` - Delete build
- `toggleLike(buildId, userId)` - Toggle like
- Plus optimized CRUD operations for abilities, passives, stigmas

### 3. BuildPermissions (`src/services/build.permissions.ts`)

**Responsibilities:**
- Authorization and permission checks
- Ownership validation
- Admin role management
- Starter build protection
- Privacy validation

**Key Methods:**
- `canViewBuild(userId, build)` - Check view permission
- `canModifyBuild(userId, buildId)` - Check modify permission
- `canDeleteBuild(userId, buildId)` - Check delete permission
- `canLikeBuild(userId, buildId)` - Check like permission
- `isStarterBuild(build)` - Check if starter build
- `isAdmin(userId)` - Check if user is admin
- `filterViewableBuilds(userId, builds)` - Filter by visibility

### 4. BuildCache (`src/services/build.cache.ts`)

**Responsibilities:**
- Caching strategy management
- Cache invalidation
- Tag-based cache hierarchy
- TTL configuration
- Cache statistics

**Cache Strategy:**
- Build listings: 5 minutes TTL
- Build details: 1 minute TTL
- User builds: 5 minutes TTL
- Liked builds: 5 minutes TTL

**Cache Tags:**
- `builds` - All build-related caches
- `build-{id}` - Specific build cache
- `builds-listing` - Build listings only
- `builds-detail` - Build details only
- `user-builds-{userId}` - User's builds
- `liked-builds-{userId}` - User's liked builds

## Usage Examples

### Basic CRUD Operations

```typescript
import buildService from "@/services";

// Get a build
const build = await buildService.getBuildById(123);

// Get all builds (public only)
const builds = await buildService.getAllBuilds();

// Get user's builds
const userBuilds = await buildService.getBuildsByUserId(userId);

// Create a new build
const newBuild = await buildService.createBuild(userId, {
  name: "My New Build",
  classId: 1,
  baseSP: 231,
  baseSTP: 40,
});

// Update a build
const updated = await buildService.updateBuild(userId, 123, {
  name: "Updated Name",
});

// Delete a build
await buildService.deleteBuild(userId, 123);
```

### Like Operations

```typescript
// Toggle like
const result = await buildService.toggleLike(userId, 123);
console.log(result.liked, result.likesCount);

// Check if liked
const hasLiked = await buildService.hasUserLiked(userId, 123);

// Add like
await buildService.addLike(userId, 123);

// Remove like
await buildService.removeLike(userId, 123);
```

### Optimized Updates

```typescript
// Update only shortcuts (faster than full update)
await buildService.updateShortcuts(userId, 123, shortcuts);

// Update ability level
await buildService.updateAbilityLevel(userId, 123, abilityId, 5);

// Update daevanion
await buildService.updateDaevanion(userId, 123, {
  nezekan: [1, 2, 3],
  zikel: [4, 5],
  vaizel: [],
  triniel: [],
  ariel: [],
  azphel: [],
});
```

### Starter Builds

```typescript
// Get all starter builds
const starters = await buildService.getStarterBuilds();

// Get starter build for class
const gladiatorStarter = await buildService.getStarterBuildByClass("gladiator");

// Create build from starter
const newBuild = await buildService.createFromStarterBuild(userId, starterId);

// Get random starter build ID
const randomId = await buildService.getRandomStarterBuildId();
```

## Error Handling

The service throws structured errors that can be caught and handled:

```typescript
import {
  BuildNotFoundError,
  StarterBuildLockedError,
  BuildOwnershipError,
  AuthenticationError,
  BusinessLogicError,
} from "@/lib/errors";

try {
  await buildService.updateBuild(userId, buildId, data);
} catch (error) {
  if (error instanceof BuildNotFoundError) {
    // Handle not found
  } else if (error instanceof StarterBuildLockedError) {
    // Handle starter build locked
  } else if (error instanceof BuildOwnershipError) {
    // Handle ownership error
  } else if (error instanceof AuthenticationError) {
    // Handle authentication error
  }
}
```

## Migration from buildActions.ts

### Before (buildActions.ts):
```typescript
export async function updateBuild(
  buildId: number,
  data: Partial<BuildType>
): Promise<BuildType> {
  const session = await auth();

  // Permission check mixed with business logic
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  const userIsAdmin = isAdmin(session?.user?.id);
  if (currentBuild?.userId && session?.user?.id !== currentBuild.userId && !userIsAdmin) {
    throw new Error("Unauthorized");
  }

  // Direct database access
  const updated = await prisma.build.update({...});

  // Manual cache invalidation
  revalidateTag('builds', 'max');

  return BuildSchema.parse(updated);
}
```

### After (BuildService):
```typescript
// In buildActions.ts - now just a thin wrapper:
export async function updateBuild(
  buildId: number,
  data: Partial<BuildType>
): Promise<BuildType> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  // Delegate to service layer
  return buildService.updateBuild(session.user.id, buildId, data);
}
```

## Benefits

1. **Separation of Concerns:**
   - Repository handles data access
   - Service handles business logic
   - Actions handle server/client boundary

2. **Testability:**
   - Each layer can be tested independently
   - Mock dependencies easily
   - Clear test boundaries

3. **Maintainability:**
   - Business logic in one place
   - Easy to find and modify
   - Reduced code duplication

4. **Scalability:**
   - Easy to add new features
   - Clear extension points
   - Reusable components

5. **Type Safety:**
   - Strong TypeScript typing
   - Zod schema validation
   - Compile-time error checking

6. **Performance:**
   - Optimized queries
   - Strategic caching
   - Efficient invalidation

## Next Steps

1. **Refactor buildActions.ts:**
   - Replace business logic with service calls
   - Keep actions as thin wrappers
   - Handle authentication/session only

2. **Add Unit Tests:**
   - Test service layer with mocked dependencies
   - Test repository with test database
   - Test permissions logic

3. **Monitor Performance:**
   - Track cache hit rates
   - Monitor query performance
   - Optimize based on usage patterns

4. **Add Logging:**
   - Log service operations
   - Track permission checks
   - Monitor cache operations

## File Structure

```
src/
├── services/
│   ├── build.service.ts       # Business logic layer
│   ├── build.permissions.ts   # Authorization logic
│   ├── build.cache.ts         # Caching strategy
│   └── index.ts               # Barrel export
├── repositories/
│   └── build.repository.ts    # Data access layer
├── lib/
│   └── errors/
│       └── index.ts           # Custom error classes
└── actions/
    └── buildActions.ts        # Server actions (thin wrappers)
```

## Contributing

When adding new features:

1. Add repository methods for data access
2. Add service methods for business logic
3. Add permission checks if needed
4. Add cache invalidation
5. Update buildActions.ts to expose to UI
6. Add error handling
7. Update this documentation

## Questions?

See the inline JSDoc comments in each file for detailed API documentation.
