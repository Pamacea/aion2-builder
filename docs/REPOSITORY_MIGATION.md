# BuildRepository Migration Guide

## Overview

The `BuildRepository` class encapsulates all data access operations from `buildActions.ts`, following the Repository pattern to separate business logic from data access.

## Method Mapping

### Core CRUD Operations

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `getBuildById()` | `findById()` | Get build with detail include |
| - | `findByIdFull()` | Get build with full include (all relations) |
| `getAllBuilds()` | `findAll()` | List builds with optional filters |
| `getBuildsByUserId()` | `findByUserId()` | Get all builds for user |
| `createBuild()` | `create()` | Create new build |
| `updateBuild()` | `update()` | Full update with relations |
| `deleteBuildAction()` | `delete()` | Delete with transaction |

### Starter Build Operations

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `getStarterBuildIdByClassName()` | `findStarterBuildIdByClassName()` | Get starter build by class |
| `getRandomStarterBuildId()` | `findRandomStarterBuildId()` | Get random starter build |
| `createBuildFromStarter()` | `createFromStarter()` | Create from starter |

### Clone Operations

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `createBuildFromBuild()` | `clone()` | Clone existing build |

### Like Operations

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `toggleLikeBuildAction()` | `addLike()` / `removeLike()` | Split into two methods |
| `getBuildLikes()` | `countLikes()` | Count likes |
| `hasUserLikedBuild()` | `findLike()` | Check if like exists |
| `getLikedBuildsByUserId()` | `findLikedBuilds()` | Get user's liked builds |

### Optimized Updates

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `updateDaevanionOnly()` | `updateDaevanion()` | Update daevanion only |
| `updateShortcutsOnly()` | `updateShortcuts()` | Update shortcuts only |
| `updateBuildPrivateStatus()` | `updatePrivateStatus()` | Update private flag |
| `updateAbilitySpecialtyChoicesOnly()` | `updateAbilitySpecialtyChoices()` | Update ability specialty |
| `updateStigmaSpecialtyChoicesOnly()` | `updateStigmaSpecialtyChoices()` | Update stigma specialty |
| `updateAbilityChainSkillsOnly()` | `updateAbilityChainSkills()` | Update ability chains |
| `updateStigmaChainSkillsOnly()` | `updateStigmaChainSkills()` | Update stigma chains |
| `updateStigmaCostOnly()` | `updateStigmaCost()` | Update stigma cost |

### Add/Remove Operations

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `addAbilityOnly()` | `addAbility()` | Add or update ability |
| `removeAbilityOnly()` | `removeAbility()` | Remove ability |
| `addPassiveOnly()` | `addPassive()` | Add or update passive |
| `removePassiveOnly()` | `removePassive()` | Remove passive |
| `addStigmaOnly()` | `addStigma()` | Add or update stigma |
| `removeStigmaOnly()` | `removeStigma()` | Remove stigma |

### Level Updates

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| `updateAbilityLevelOnly()` | `updateAbilityLevel()` | Update ability level |
| `updatePassiveLevelOnly()` | `updatePassiveLevel()` | Update passive level |
| `updateStigmaLevelOnly()` | `updateStigmaLevel()` | Update stigma level |

### Utility Methods

| buildActions.ts | BuildRepository | Notes |
|----------------|-----------------|-------|
| - | `exists()` | Check if build exists |
| - | `getOwner()` | Get build owner (userId only) |

## Usage Examples

### Basic CRUD

```typescript
import { buildRepository } from '@/repositories';

// Find by ID
const build = await buildRepository.findById(1);

// Find all public builds
const builds = await buildRepository.findAll({ private: false });

// Find by user
const userBuilds = await buildRepository.findByUserId(userId);

// Create new build
const newBuild = await buildRepository.create({
  name: 'My Build',
  classId: 1,
  userId: 'user-123',
  abilities: [
    { abilityId: 1, level: 5, activeSpecialtyChoiceIds: [1, 2] }
  ]
});

// Update build
const updated = await buildRepository.update(1, {
  name: 'Updated Name',
  abilities: [
    { abilityId: 1, level: 6, activeSpecialtyChoiceIds: [1] }
  ]
});

// Delete build
await buildRepository.delete(1);
```

### Optimized Updates

```typescript
// Update only daevanion
await buildRepository.updateDaevanion(buildId, {
  nezekan: [1, 2, 3],
  zikel: [4, 5, 6],
  // ...
});

// Update only shortcuts
await buildRepository.updateShortcuts(buildId, {
  slot1: { type: 'ability', abilityId: 1 }
});

// Update ability level
await buildRepository.updateAbilityLevel(buildId, abilityId, 5);
```

### Like Operations

```typescript
// Add like
await buildRepository.addLike(buildId, userId);

// Remove like
await buildRepository.removeLike(buildId, userId);

// Check if liked
const like = await buildRepository.findLike(buildId, userId);
const hasLiked = !!like;

// Count likes
const count = await buildRepository.countLikes(buildId);

// Get user's liked builds
const likedBuilds = await buildRepository.findLikedBuilds(userId);
```

### Clone Operations

```typescript
// Clone existing build
const clonedBuild = await buildRepository.clone(sourceBuildId, newUserId, 'Cloned Build');

// Create from starter build
const newBuild = await buildRepository.createFromStarter(
  starterBuildId,
  userId,
  'Owner Name'
);
```

## Key Benefits

1. **Separation of Concerns**: Data access logic is isolated from business logic
2. **Testability**: Easy to mock repository for unit tests
3. **Type Safety**: Full TypeScript types for all operations
4. **Optimization**: Specialized methods for partial updates (avoid loading full relations)
5. **Transactions**: Built-in transaction support for complex operations
6. **Consistency**: All database operations go through the same interface

## Migration Notes

- The repository does NOT handle authorization (that belongs in actions/services)
- The repository does NOT handle cache invalidation (that belongs in actions/services)
- The repository does NOT validate business rules (that belongs in actions/services)
- The repository ONLY handles data access operations

## Next Steps

1. Update `buildActions.ts` to use `buildRepository` instead of direct `prisma` calls
2. Keep authorization, validation, and cache logic in actions
3. Actions should call repository methods for data operations
4. Add unit tests for repository methods
