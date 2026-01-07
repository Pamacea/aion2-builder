# Service Layer Refactoring Plan for buildActions.ts

## Current State
- buildActions.ts: 1,560 lines
- Mixed concerns: business logic, database access, permissions, caching, Next.js specific code

## Target State  
- buildActions.ts: ~200-300 lines (thin orchestration layer)
- BuildRepository: All database operations
- BuildPermissions: Authorization logic
- BuildCache: Caching strategy
- BuildService: Business logic orchestration

## Implementation Strategy

Given the size and complexity, I recommend creating the service layer files in this order:

### Phase 1: Extract Repository Layer (src/repositories/build.repository.ts)
Extract all Prisma database calls into repository methods. Keep the same logic, just move it.

### Phase 2: Extract Permissions (src/actions/build.permissions.ts)
Extract all auth checks and isAdmin() logic.

### Phase 3: Create Cache Layer (src/actions/build.cache.ts)
Extract unstable_cache and caching logic.

### Phase 4: Create Service Layer (src/services/build.service.ts)
Combine repository + permissions + cache into business logic methods.

### Phase 5: Refactor buildActions.ts
Replace all implementations with service calls. Keep only:
- 'use server' directives
- Auth session validation
- revalidatePath/revalidateTag calls
- Error formatting

## Files to Create
1. src/repositories/build.repository.ts (~500 lines)
2. src/actions/build.permissions.ts (~100 lines)  
3. src/actions/build.cache.ts (~150 lines)
4. src/services/build.service.ts (~400 lines)
5. Refactored src/actions/buildActions.ts (~250 lines)

Total: ~1,400 lines (vs 1,560 current) but with clear separation of concerns.
