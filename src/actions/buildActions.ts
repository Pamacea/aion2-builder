"use server";

import { auth } from "@/auth";
import { BuildSchema, BuildType } from "@/types/schema";
import { isStarterBuild } from "@/utils/buildUtils";
import { revalidatePath, revalidateTag } from "next/cache";
import { buildService } from "@/services/build.service";

// ======================================
// LOADING ACTIONS
// ======================================

export async function loadBuildAction(
  buildId: number
): Promise<BuildType | null> {
  if (!buildId || isNaN(buildId)) {
    return null;
  }
  return await buildService.getBuild(buildId);
}

// ======================================
// BUILD CRUD OPERATIONS
// ======================================

export async function getBuild(id: number): Promise<BuildType | null> {
  return await buildService.getBuild(id);
}

export async function getAllBuilds(): Promise<BuildType[]> {
  return await buildService.getAllBuilds();
}

export async function createBuild(buildData: BuildType): Promise<BuildType> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a build");
  }

  return await buildService.createBuild(session.user.id, buildData);
}

export async function updateBuild(
  buildId: number,
  data: Partial<BuildType>
): Promise<BuildType> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a build");
  }

  return await buildService.updateBuild(session.user.id, buildId, data);
}

export async function deleteBuildAction(buildId: number): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a build");
  }

  await buildService.deleteBuild(session.user.id, buildId);

  revalidateTag('builds', 'max');
  revalidatePath('/morebuild', 'page');
  revalidatePath('/myprofile', 'page');
  revalidatePath(`/build/${buildId}`, 'page');

  return { success: true };
}

// ======================================
// USER-SPECIFIC OPERATIONS
// ======================================

export async function getBuildsByUserId(userId: string): Promise<BuildType[]> {
  return await buildService.getUserBuilds(userId);
}

export async function getLikedBuildsByUserId(userId: string): Promise<BuildType[]> {
  return await buildService.getLikedBuilds(userId);
}

// ======================================
// LIKE OPERATIONS
// ======================================

export async function toggleLikeBuildAction(buildId: number): Promise<{ liked: boolean; likesCount: number }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to like a build");
  }

  const liked = await buildService.toggleLike(session.user.id, buildId);
  const likesCount = await buildService.countLikes(buildId);

  revalidateTag('builds', 'max');
  revalidatePath('/morebuild', 'page');
  revalidatePath(`/build/${buildId}`, 'page');
  revalidatePath(`/build/${buildId}/profile`, 'page');

  return { liked, likesCount };
}

export async function getBuildLikes(buildId: number): Promise<number> {
  return await buildService.countLikes(buildId);
}

export async function hasUserLikedBuild(buildId: number, userId: string): Promise<boolean> {
  return await buildService.hasUserLiked(buildId, userId);
}

// ======================================
// BUILD CREATION FROM TEMPLATES
// ======================================

export async function createBuildFromStarter(
  starterBuildId: number
): Promise<BuildType | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a build from starter");
  }

  const starterBuild = await buildService.getBuild(starterBuildId);
  if (!starterBuild) return null;

  const className = starterBuild.class.name.charAt(0).toUpperCase() +
                   starterBuild.class.name.slice(1);
  const ownerName = session.user.name || session.user.email || "Unknown";
  const firstAbilityId = starterBuild.class?.abilities
    ? Math.min(...starterBuild.class.abilities.map((a) => a.id))
    : null;

  return await buildService.createBuild(session.user.id, {
    name: `Build - ${className} - ${ownerName}`,
    classId: starterBuild.classId,
    baseSP: starterBuild.baseSP,
    extraSP: starterBuild.extraSP,
    baseSTP: starterBuild.baseSTP,
    extraSTP: starterBuild.extraSTP,
    abilities: starterBuild.abilities?.map((a) => ({
      abilityId: a.abilityId,
      level: a.abilityId === firstAbilityId ? 1 : 0,
      activeSpecialtyChoiceIds: [],
      selectedChainSkillIds: [],
    })) || [],
    passives: starterBuild.passives?.map((p) => ({
      passiveId: p.passiveId,
      level: 0,
      maxLevel: p.maxLevel,
    })) || [],
    stigmas: starterBuild.stigmas?.map((s) => ({
      stigmaId: s.stigmaId,
      level: s.level,
      stigmaCost: s.stigmaCost,
      activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds || [],
      selectedChainSkillIds: s.selectedChainSkillIds || [],
    })) || [],
  });
}

export async function createBuildFromBuild(
  sourceBuildId: number
): Promise<BuildType | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a build from existing build");
  }

  const sourceBuild = await buildService.getBuild(sourceBuildId);
  if (!sourceBuild) return null;

  const className = sourceBuild.class.name.charAt(0).toUpperCase() +
                   sourceBuild.class.name.slice(1);
  const ownerName = session.user.name || session.user.email || "Unknown";
  const firstAbilityId = sourceBuild.class?.abilities
    ? Math.min(...sourceBuild.class.abilities.map((a) => a.id))
    : null;

  return await buildService.createBuild(session.user.id, {
    name: `Build - ${className} - ${ownerName}`,
    classId: sourceBuild.classId,
    baseSP: sourceBuild.baseSP,
    extraSP: sourceBuild.extraSP,
    baseSTP: sourceBuild.baseSTP,
    extraSTP: sourceBuild.extraSTP,
    abilities: sourceBuild.abilities?.map((a) => ({
      abilityId: a.abilityId,
      level: a.abilityId === firstAbilityId ? 1 : a.level,
      activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds || [],
      selectedChainSkillIds: a.selectedChainSkillIds || [],
    })) || [],
    passives: sourceBuild.passives?.map((p) => ({
      passiveId: p.passiveId,
      level: p.level,
      maxLevel: p.maxLevel,
    })) || [],
    stigmas: sourceBuild.stigmas?.map((s) => ({
      stigmaId: s.stigmaId,
      level: s.level,
      stigmaCost: s.stigmaCost,
      activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds || [],
      selectedChainSkillIds: s.selectedChainSkillIds || [],
    })) || [],
  });
}

// ======================================
// DAEVANION OPERATIONS
// ======================================

export async function updateDaevanion(
  buildId: number,
  data: {
    nezekan: number[];
    zikel: number[];
    vaizel: number[];
    triniel: number[];
    ariel: number[];
    azphel: number[];
  }
): Promise<BuildType> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update daevanion");
  }

  return await buildService.updateBuild(session.user.id, buildId, { daevanion: data });
}

// ======================================
// UTILITY FUNCTIONS
// ======================================

export async function getStarterBuildIdByClassName(
  className: string
): Promise<number | null> {
  const starterBuilds = await buildService.getStarterBuilds();
  const classBuild = starterBuilds.find(build =>
    build.class.name.toLowerCase() === className.toLowerCase()
  );
  return classBuild?.id || null;
}

export async function getRandomStarterBuildId(): Promise<number | null> {
  const classes = [
    "gladiator", "templar", "ranger", "assassin",
    "chanter", "sorcerer", "elementalist", "cleric"
  ];
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  return await getStarterBuildIdByClassName(randomClass);
}

// ======================================
// SERVER-SPECIFIC ACTIONS
// ======================================

export async function saveBuildAction(
  buildId: number,
  data: BuildType
): Promise<BuildType | null> {
  const session = await auth();

  // Prevent saving starter builds
  if (isStarterBuild(data)) {
    throw new Error(
      "Cannot modify starter builds. Please create a new build from the starter build."
    );
  }

  return await updateBuild(buildId, data as Partial<BuildType>);
}

export async function updateDaevanionOnly(
  buildId: number,
  daevanionData: {
    nezekan: number[];
    zikel: number[];
    vaizel: number[];
    triniel: number[];
    ariel: number[];
    azphel: number[];
  }
): Promise<{ success: boolean }> {
  await updateDaevanion(buildId, daevanionData);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/sphere`, 'page');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateBuildPrivateStatus(
  buildId: number,
  isPrivate: boolean
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update build privacy");
  }

  await buildService.updateBuild(session.user.id, buildId, { private: isPrivate });

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}`, 'page');
  revalidatePath(`/build/${buildId}/profile`, 'page');
  revalidatePath('/morebuild', 'page');

  return { success: true };
}

// ======================================
// DEBUG AND ADMIN FUNCTIONS
// ======================================

export async function checkAdminStatus(): Promise<{
  userId: string | null;
  adminUserId: string | null;
  isAdmin: boolean;
  message: string;
}> {
  const session = await auth();
  const userId = session?.user?.id || null;

  const adminUserId = process.env.ADMIN_USER_ID || process.env.NEXT_PUBLIC_ADMIN_USER_ID || null;

  const userIsAdmin = adminUserId === userId;

  return {
    userId,
    adminUserId,
    isAdmin: userIsAdmin,
    message: userIsAdmin
      ? "You are admin!"
      : adminUserId
        ? "You are not admin."
        : "No ADMIN_USER_ID configured in .env.local"
  };
}

// ======================================
// OPTIMIZED UPDATE HELPERS
// ======================================

export async function updateAbilitySpecialtyChoicesOnly(
  buildId: number,
  abilityId: number,
  activeSpecialtyChoiceIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateAbilitySpecialtyChoices(buildId, abilityId, activeSpecialtyChoiceIds);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateStigmaSpecialtyChoicesOnly(
  buildId: number,
  stigmaId: number,
  activeSpecialtyChoiceIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateStigmaSpecialtyChoices(buildId, stigmaId, activeSpecialtyChoiceIds);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateAbilityLevelOnly(
  buildId: number,
  abilityId: number,
  level: number
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateAbilityLevel(buildId, abilityId, level);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updatePassiveLevelOnly(
  buildId: number,
  passiveId: number,
  level: number
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updatePassiveLevel(buildId, passiveId, level);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateStigmaLevelOnly(
  buildId: number,
  stigmaId: number,
  level: number
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateStigmaLevel(buildId, stigmaId, level);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateStigmaCostOnly(
  buildId: number,
  stigmaId: number,
  cost: number
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateStigmaCost(buildId, stigmaId, cost);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateAbilityChainSkillsOnly(
  buildId: number,
  abilityId: number,
  selectedChainSkillIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateAbilityChainSkills(buildId, abilityId, selectedChainSkillIds);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateStigmaChainSkillsOnly(
  buildId: number,
  stigmaId: number,
  selectedChainSkillIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update directly via repository
  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.updateStigmaChainSkills(buildId, stigmaId, selectedChainSkillIds);

  // Invalidate cache
  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function updateShortcutsOnly(
  buildId: number,
  shortcuts: Record<string, unknown> | null,
  shortcutLabels?: Record<string, string> | null
): Promise<{ success: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  // Check permissions
  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  // Update via service (shortcuts need full update)
  const updateData: { shortcuts: Record<string, unknown> | null; shortcutLabels?: Record<string, string> | null } = {
    shortcuts
  };
  if (shortcutLabels) {
    updateData.shortcutLabels = shortcutLabels;
  }
  await buildService.updateBuild(session.user.id, buildId, updateData);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function addAbilityOnly(
  buildId: number,
  abilityId: number,
  level: number,
  maxLevel: number,
  activeSpecialtyChoiceIds: number[],
  selectedChainSkillIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.addAbility(buildId, abilityId, level, maxLevel, activeSpecialtyChoiceIds, selectedChainSkillIds);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function addPassiveOnly(
  buildId: number,
  passiveId: number,
  level: number,
  maxLevel: number
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.addPassive(buildId, passiveId, level, maxLevel);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function addStigmaOnly(
  buildId: number,
  stigmaId: number,
  level: number,
  maxLevel: number,
  stigmaCost: number,
  activeSpecialtyChoiceIds: number[],
  selectedChainSkillIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.addStigma(buildId, stigmaId, level, maxLevel, stigmaCost, activeSpecialtyChoiceIds, selectedChainSkillIds);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function removeAbilityOnly(
  buildId: number,
  abilityId: number
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.removeAbility(buildId, abilityId);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function removePassiveOnly(
  buildId: number,
  passiveId: number
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.removePassive(buildId, passiveId);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

export async function removeStigmaOnly(
  buildId: number,
  stigmaId: number
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to update this build");
  }

  const { BuildPermissions } = await import("@/services/build.permissions");
  const permissions = new BuildPermissions();
  await permissions.canModifyBuild(session.user.id, buildId);

  const { buildRepository } = await import("@/repositories/build.repository");
  await buildRepository.removeStigma(buildId, stigmaId);

  const { BuildCache } = await import("@/services/build.cache");
  const cache = new BuildCache();
  cache.invalidateBuild(buildId);

  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

// ======================================
// LEGACY ALIASES (for backward compatibility)
// ======================================

export const getBuildById = getBuild;