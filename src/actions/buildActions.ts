"use server";

import { auth } from "@/auth";
import { BuildSchema, BuildType } from "@/types/schema";
import { fullBuildInclude } from "@/utils/actionsUtils";
import { isStarterBuild } from "@/utils/buildUtils";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "../lib/prisma";

// ======================================
// DATA MAPPING HELPERS
// ======================================
const mapBuildAbilityData = (
  ability: NonNullable<BuildType["abilities"]>[number]
) => ({
  abilityId: ability.abilityId,
  level: ability.level,
  activeSpecialtyChoiceIds: ability.activeSpecialtyChoiceIds ?? [],
  selectedChainSkillIds: ability.selectedChainSkillIds ?? [],
});

const mapBuildPassiveData = (
  passive: NonNullable<BuildType["passives"]>[number]
) => ({
  passiveId: passive.passiveId,
  level: passive.level,
});

const mapBuildStigmaData = (
  stigma: NonNullable<BuildType["stigmas"]>[number]
) => ({
  stigmaId: stigma.stigmaId,
  level: stigma.level,
  stigmaCost: stigma.stigmaCost ?? 10,
  activeSpecialtyChoiceIds: stigma.activeSpecialtyChoiceIds ?? [],
  selectedChainSkillIds: stigma.selectedChainSkillIds ?? [],
});

export async function loadBuildAction(
  buildId: number
): Promise<BuildType | null> {
  if (!buildId || isNaN(buildId)) {
    return null;
  }
  return await getBuildById(buildId);
}

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

  // Vérifier que l'utilisateur est le propriétaire du build
  if (data.userId && session?.user?.id !== data.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }

  return await updateBuild(buildId, data as Partial<BuildType>);
}

// ======================================
// GET BUILD BY ID (full BuildType)
// ======================================
// Cache pour getBuildById - revalidate toutes les minutes
const getBuildByIdCached = unstable_cache(
  async (id: number): Promise<BuildType | null> => {
    const build = await prisma.build.findUnique({
      where: { id },
      include: fullBuildInclude,
    });

    if (!build) return null;
    return BuildSchema.parse(build);
  },
  ['build-by-id'], // Cache key prefix
  {
    revalidate: 60, // Revalidate toutes les minutes
    tags: ['builds'], // Tag pour invalidation manuelle
  }
);

export const getBuildById = cache(async (id: number): Promise<BuildType | null> => {
  return getBuildByIdCached(id);
});

// ======================================
// GET STARTER BUILD
// ======================================
export const getStarterBuildIdByClassName = async (
  className: string
): Promise<number | null> => {
  const cls = await prisma.class.findUnique({
    where: { name: className },
    select: {
      builds: {
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!cls || cls.builds.length === 0) return null;

  return cls.builds[0].id;
};

// ======================================
// CREATE BUILD (full BuildType)
// ======================================
export async function createBuild(buildData: BuildType): Promise<BuildType> {
  const newBuild = await prisma.build.create({
    data: {
      name: buildData.name,
      classId: buildData.classId,
      abilities: {
        create:
          buildData.abilities?.map((a) => ({
            abilityId: a.abilityId,
            level: a.level,
            activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
          })) ?? [],
      },
      passives: {
        create: buildData.passives?.map(mapBuildPassiveData) ?? [],
      },
      stigmas: {
        create:
          buildData.stigmas?.map((s) => ({
            stigmaId: s.stigmaId,
            stigmaCost: s.stigmaCost,
          })) ?? [],
      },
    },
    include: fullBuildInclude,
  });

  return BuildSchema.parse(newBuild);
}

// ======================================
// UPDATE BUILD (full BuildType)
// ======================================
export async function updateBuild(
  buildId: number,
  data: Partial<BuildType>
): Promise<BuildType> {
  const session = await auth();

  // Récupérer le build actuel pour vérifier le propriétaire
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  // Vérifier que l'utilisateur est le propriétaire du build (sauf si le build n'a pas de propriétaire)
  if (currentBuild?.userId && session?.user?.id !== currentBuild.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }
  const updateData: {
    name?: string;
    classId?: number;
    shortcuts?: Record<string, unknown> | null;
    abilities?: {
      deleteMany: { buildId: number };
      create: Array<{
        abilityId: number;
        level: number;
        activeSpecialtyChoiceIds: number[];
      }>;
    };
    passives?: {
      deleteMany: { buildId: number };
      create: Array<{
        passiveId: number;
        level: number;
      }>;
    };
    stigmas?: {
      deleteMany: { buildId: number };
      create: Array<{
        stigmaId: number;
        level: number;
        stigmaCost: number;
      }>;
    };
    daevanion?: {
      upsert: {
        create: {
          nezekan: number[];
          zikel: number[];
          vaizel: number[];
          triniel: number[];
          ariel: number[];
          azphel: number[];
        };
        update: {
          nezekan: number[];
          zikel: number[];
          vaizel: number[];
          triniel: number[];
          ariel: number[];
          azphel: number[];
        };
      };
    };
  } = {};

  if ("name" in data && data.name !== undefined) {
    updateData.name = data.name as string;
  }

  if (
    "class" in data &&
    data.class &&
    typeof data.class === "object" &&
    "id" in data.class
  ) {
    updateData.classId = (data.class as { id: number }).id;
  }

  // Handle shortcuts update
  if ("shortcuts" in data && data.shortcuts !== undefined) {
    updateData.shortcuts = data.shortcuts as BuildType["shortcuts"];
  }

  // Handle abilities update
  if ("abilities" in data && data.abilities !== undefined) {
    updateData.abilities = {
      deleteMany: { buildId },
      create: data.abilities.map(mapBuildAbilityData),
    };
  }

  // Handle passives update
  if ("passives" in data && data.passives !== undefined) {
    updateData.passives = {
      deleteMany: { buildId },
      create: data.passives.map(mapBuildPassiveData),
    };
  }

  // Handle stigmas update
  if ("stigmas" in data && data.stigmas !== undefined) {
    updateData.stigmas = {
      deleteMany: { buildId },
      create: data.stigmas.map(mapBuildStigmaData),
    };
  }

  // Handle daevanion update
  if ("daevanion" in data && data.daevanion !== undefined && data.daevanion !== null) {
    const daevanionData = data.daevanion as NonNullable<BuildType["daevanion"]>;
    updateData.daevanion = {
      upsert: {
        create: {
          nezekan: daevanionData.nezekan || [],
          zikel: daevanionData.zikel || [],
          vaizel: daevanionData.vaizel || [],
          triniel: daevanionData.triniel || [],
          ariel: daevanionData.ariel || [],
          azphel: daevanionData.azphel || [],
        },
        update: {
          nezekan: daevanionData.nezekan || [],
          zikel: daevanionData.zikel || [],
          vaizel: daevanionData.vaizel || [],
          triniel: daevanionData.triniel || [],
          ariel: daevanionData.ariel || [],
          azphel: daevanionData.azphel || [],
        },
      },
    };
  }

  const updated = await prisma.build.update({
    where: { id: buildId },
    data: updateData as Parameters<typeof prisma.build.update>[0]["data"],
    include: fullBuildInclude,
  });

  // Invalider le cache si le nom a été modifié
  if ("name" in data && data.name !== undefined) {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}`, 'page');
    revalidatePath(`/build/${buildId}/profile`, 'page');
  }

  // Invalider le cache si les shortcuts ont été modifiés
  if ("shortcuts" in data && data.shortcuts !== undefined) {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}`, 'page');
    revalidatePath(`/build/${buildId}/profile`, 'page');
    revalidatePath(`/build/${buildId}/skill`, 'page');
  }

  // Invalider le cache si daevanion a été modifié
  if ("daevanion" in data && data.daevanion !== undefined) {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}`, 'page');
    revalidatePath(`/build/${buildId}/sphere`, 'page');
    revalidatePath(`/build/${buildId}/skill`, 'page');
  }

  return BuildSchema.parse(updated);
}

// ======================================
// UPDATE DAEVANION ONLY (optimized)
// ======================================
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
  const session = await auth();

  // Récupérer le build actuel pour vérifier le propriétaire (seulement userId)
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  if (!currentBuild) {
    throw new Error("Build not found");
  }

  // Vérifier que l'utilisateur est le propriétaire du build
  if (currentBuild.userId && session?.user?.id !== currentBuild.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }

  // Mettre à jour uniquement daevanion sans charger toutes les relations
  await prisma.buildDaevanion.upsert({
    where: { buildId },
    create: {
      buildId,
      nezekan: daevanionData.nezekan,
      zikel: daevanionData.zikel,
      vaizel: daevanionData.vaizel,
      triniel: daevanionData.triniel,
      ariel: daevanionData.ariel,
      azphel: daevanionData.azphel,
    },
    update: {
      nezekan: daevanionData.nezekan,
      zikel: daevanionData.zikel,
      vaizel: daevanionData.vaizel,
      triniel: daevanionData.triniel,
      ariel: daevanionData.ariel,
      azphel: daevanionData.azphel,
    },
  });

  // Invalider le cache (les revalidations sont déjà asynchrones dans Next.js)
  // On les fait après la réponse pour ne pas bloquer
  Promise.resolve().then(() => {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}/sphere`, 'page');
    revalidatePath(`/build/${buildId}/skill`, 'page');
  });

  return { success: true };
}

// ======================================
// UPDATE SHORTCUTS ONLY (optimized)
// ======================================
export async function updateShortcutsOnly(
  buildId: number,
  shortcuts: Record<string, { type: "ability" | "stigma"; abilityId?: number; stigmaId?: number }> | null
): Promise<{ success: boolean }> {
  const session = await auth();

  // Récupérer le build actuel pour vérifier le propriétaire (seulement userId)
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  if (!currentBuild) {
    throw new Error("Build not found");
  }

  // Vérifier que l'utilisateur est le propriétaire du build
  if (currentBuild.userId && session?.user?.id !== currentBuild.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }

  // Mettre à jour uniquement shortcuts sans charger toutes les relations
  const updateData: { shortcuts: BuildType["shortcuts"] } = { 
    shortcuts: shortcuts as BuildType["shortcuts"]
  };
  
  await prisma.build.update({
    where: { id: buildId },
    data: updateData as Parameters<typeof prisma.build.update>[0]["data"],
  });

  // Invalider le cache de manière synchrone pour garantir la cohérence
  revalidateTag('builds', 'max');
  revalidatePath(`/build/${buildId}`, 'page');
  revalidatePath(`/build/${buildId}/profile`, 'page');
  revalidatePath(`/build/${buildId}/skill`, 'page');

  return { success: true };
}

// ======================================
// UPDATE ABILITY SPECIALTY CHOICES ONLY (optimized)
// ======================================
export async function updateAbilitySpecialtyChoicesOnly(
  buildId: number,
  abilityId: number,
  activeSpecialtyChoiceIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  // Récupérer le build actuel pour vérifier le propriétaire (seulement userId)
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  if (!currentBuild) {
    throw new Error("Build not found");
  }

  // Vérifier que l'utilisateur est le propriétaire du build
  if (currentBuild.userId && session?.user?.id !== currentBuild.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }

  // Mettre à jour uniquement activeSpecialtyChoiceIds de l'ability spécifique
  await prisma.buildAbility.updateMany({
    where: {
      buildId,
      abilityId,
    },
    data: {
      activeSpecialtyChoiceIds,
    },
  });

  // Invalider le cache (les revalidations sont déjà asynchrones dans Next.js)
  Promise.resolve().then(() => {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}/skill`, 'page');
  });

  return { success: true };
}

// ======================================
// UPDATE STIGMA SPECIALTY CHOICES ONLY (optimized)
// ======================================
export async function updateStigmaSpecialtyChoicesOnly(
  buildId: number,
  stigmaId: number,
  activeSpecialtyChoiceIds: number[]
): Promise<{ success: boolean }> {
  const session = await auth();

  // Récupérer le build actuel pour vérifier le propriétaire (seulement userId)
  const currentBuild = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  if (!currentBuild) {
    throw new Error("Build not found");
  }

  // Vérifier que l'utilisateur est le propriétaire du build
  if (currentBuild.userId && session?.user?.id !== currentBuild.userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier ce build. Seul le propriétaire peut le modifier."
    );
  }

  // Mettre à jour uniquement activeSpecialtyChoiceIds du stigma spécifique
  await prisma.buildStigma.updateMany({
    where: {
      buildId,
      stigmaId,
    },
    data: {
      activeSpecialtyChoiceIds,
    },
  });

  // Invalider le cache (les revalidations sont déjà asynchrones dans Next.js)
  Promise.resolve().then(() => {
    revalidateTag('builds', 'max');
    revalidatePath(`/build/${buildId}/skill`, 'page');
  });

  return { success: true };
}

// ======================================
// CREATE BUILD FROM STARTER BUILD
// ======================================
export async function createBuildFromStarter(
  starterBuildId: number
): Promise<BuildType | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté pour créer un build");
  }

  const starterBuild = await getBuildById(starterBuildId);
  if (!starterBuild) return null;

  const className =
    starterBuild.class.name.charAt(0).toUpperCase() +
    starterBuild.class.name.slice(1);

  // Get owner name from session
  const ownerName = session.user.name || session.user.email || "Unknown";

  // Find the first ability (smallest abilityId) - this is the auto attack
  const firstAbilityId = starterBuild.class?.abilities
    ? Math.min(...starterBuild.class.abilities.map((a) => a.id))
    : null;

  const newBuild = await prisma.build.create({
    data: {
      name: `Build - ${className} - ${ownerName}`,
      classId: starterBuild.classId,
      userId: session.user.id,
      baseSP: starterBuild.baseSP,
      extraSP: starterBuild.extraSP,
      baseSTP: starterBuild.baseSTP,
      extraSTP: starterBuild.extraSTP,
      abilities: {
        create:
          starterBuild.abilities?.map((a) => ({
            abilityId: a.abilityId,
            level: a.abilityId === firstAbilityId ? 1 : 0, // First ability (auto attack) always starts at level 1
            activeSpecialtyChoiceIds: [],
          })) ?? [],
      },
      passives: {
        create:
          starterBuild.passives?.map((p) => ({
            passiveId: p.passiveId,
            level: 0, // New builds start at level 0, not copying starter build levels
            maxLevel: p.maxLevel,
          })) ?? [],
      },
      stigmas: {
        create:
          starterBuild.stigmas?.map((s) => ({
            stigmaId: s.stigmaId,
            stigmaCost: s.stigmaCost,
          })) ?? [],
      },
    },
    include: fullBuildInclude,
  });

  return BuildSchema.parse(newBuild);
}

// ======================================
// LIKE/UNLIKE BUILD
// ======================================
export async function toggleLikeBuildAction(buildId: number): Promise<{ liked: boolean; likesCount: number }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté pour liker un build");
  }

  // Vérifier si l'utilisateur a déjà liké ce build
  const existingLike = await prisma.like.findUnique({
    where: {
      buildId_userId: {
        buildId,
        userId: session.user.id,
      },
    },
  });

  if (existingLike) {
    // Unliker : supprimer le like
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // Liker : créer un nouveau like
    await prisma.like.create({
      data: {
        buildId,
        userId: session.user.id,
      },
    });
  }

  // Compter le nombre total de likes après l'action
  const likesCount = await prisma.like.count({
    where: { buildId },
  });
  
   // Invalider le cache Next.js pour que les données soient à jour au reload
   revalidateTag('builds', 'max'); // Invalide le cache de getAllBuilds et getBuildById
   revalidatePath('/morebuild', 'page'); // Invalide la page /morebuild
   revalidatePath(`/build/${buildId}`, 'page'); // Invalide la page du build spécifique
   revalidatePath(`/build/${buildId}/profile`, 'page'); // Invalide aussi la page profile du build

  // Le statut après l'action : si on a supprimé (existingLike existait), on a unliké (false)
  // Si on a créé (existingLike n'existait pas), on a liké (true)
  const liked = !existingLike;

  return {
    liked,
    likesCount,
  };
}

export async function getBuildLikes(buildId: number): Promise<number> {
  return await prisma.like.count({
    where: { buildId },
  });
}

export async function hasUserLikedBuild(buildId: number, userId: string): Promise<boolean> {
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

// ======================================
// GET RANDOM STARTER BUILD ID
// ======================================
export async function getRandomStarterBuildId(): Promise<number | null> {
  const classes = [
    "gladiator",
    "templar",
    "ranger",
    "assassin",
    "chanter",
    "sorcerer",
    "elementalist",
    "cleric",
  ];
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  return await getStarterBuildIdByClassName(randomClass);
}

// ======================================
// GET ALL BUILDS
// ======================================
// Cache pour getAllBuilds - revalidate toutes les minutes (les builds peuvent changer)
const getAllBuildsCached = unstable_cache(
  async (): Promise<BuildType[]> => {
    const builds = await prisma.build.findMany({
      include: fullBuildInclude,
      orderBy: {
        id: "desc",
      },
    });

    return builds.map((build) => BuildSchema.parse(build));
  },
  ['all-builds'], // Cache key
  {
    revalidate: 60, // Revalidate toutes les minutes (les builds peuvent être créés/modifiés)
    tags: ['builds'], // Tag pour invalidation manuelle si nécessaire
  }
);

export const getAllBuilds = cache(async (): Promise<BuildType[]> => {
  return getAllBuildsCached();
});

// ======================================
// GET BUILDS BY USER ID
// ======================================
export async function getBuildsByUserId(userId: string): Promise<BuildType[]> {
  const builds = await prisma.build.findMany({
    where: {
      userId: userId,
    },
    include: fullBuildInclude,
    orderBy: {
      id: "desc",
    },
  });

  return builds.map((build) => BuildSchema.parse(build));
}

// ======================================
// GET LIKED BUILDS BY USER ID
// ======================================
export async function getLikedBuildsByUserId(userId: string): Promise<BuildType[]> {
  const likes = await prisma.like.findMany({
    where: {
      userId: userId,
    },
    include: {
      build: {
        include: fullBuildInclude,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return likes.map((like) => BuildSchema.parse(like.build));
}

// ======================================
// CREATE BUILD FROM EXISTING BUILD
// ======================================
export async function createBuildFromBuild(
  sourceBuildId: number
): Promise<BuildType | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté pour créer un build");
  }

  const sourceBuild = await getBuildById(sourceBuildId);
  if (!sourceBuild) return null;

  const className =
    sourceBuild.class.name.charAt(0).toUpperCase() +
    sourceBuild.class.name.slice(1);

  // Get owner name from session
  const ownerName = session.user.name || session.user.email || "Unknown";

  // Find the first ability (smallest abilityId) - this is the auto attack
  const firstAbilityId = sourceBuild.class?.abilities
    ? Math.min(...sourceBuild.class.abilities.map((a) => a.id))
    : null;

  const newBuild = await prisma.build.create({
    data: {
      name: `Build - ${className} - ${ownerName}`,
      classId: sourceBuild.classId,
      userId: session.user.id,
      baseSP: sourceBuild.baseSP,
      extraSP: sourceBuild.extraSP,
      baseSTP: sourceBuild.baseSTP,
      extraSTP: sourceBuild.extraSTP,
      abilities: {
        create:
          sourceBuild.abilities?.map((a) => ({
            abilityId: a.abilityId,
            level: a.abilityId === firstAbilityId ? 1 : a.level, // First ability (auto attack) always starts at level 1
            activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
          })) ?? [],
      },
      passives: {
        create: sourceBuild.passives?.map(mapBuildPassiveData) ?? [],
      },
      stigmas: {
        create:
          sourceBuild.stigmas?.map((s) => ({
            stigmaId: s.stigmaId,
            level: s.level,
            stigmaCost: s.stigmaCost,
            activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds ?? [],
          })) ?? [],
      },
    },
    include: fullBuildInclude,
  });

  return BuildSchema.parse(newBuild);
}
