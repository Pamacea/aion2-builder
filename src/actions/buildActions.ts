"use server";

import { BuildSchema, BuildType } from "@/types/schema";
import { fullBuildInclude } from "@/utils/actionsUtils";
import { isStarterBuild } from "@/utils/buildUtils";
import { prisma } from "../lib/prisma";

// ======================================
// DATA MAPPING HELPERS
// ======================================
const mapBuildAbilityData = (ability: NonNullable<BuildType["abilities"]>[number]) => ({
  abilityId: ability.abilityId,
  level: ability.level,
  activeSpecialtyChoiceIds: ability.activeSpecialtyChoiceIds ?? [],
  selectedChainSkillIds: ability.selectedChainSkillIds ?? [],
});

const mapBuildPassiveData = (passive: NonNullable<BuildType["passives"]>[number]) => ({
  passiveId: passive.passiveId,
  level: passive.level,
});

const mapBuildStigmaData = (stigma: NonNullable<BuildType["stigmas"]>[number]) => ({
  stigmaId: stigma.stigmaId,
  level: stigma.level,
  stigmaCost: stigma.stigmaCost ?? 10,
  activeSpecialtyChoiceIds: stigma.activeSpecialtyChoiceIds ?? [],
  selectedChainSkillIds: stigma.selectedChainSkillIds ?? [],
});

export async function loadBuildAction(buildId: number): Promise<BuildType | null> {
  if (!buildId || isNaN(buildId)) {
    return null;
  }
  return await getBuildById(buildId);
}

export async function saveBuildAction(
  buildId: number,
  data: BuildType
): Promise<BuildType | null> {
  // Prevent saving starter builds
  if (isStarterBuild(data)) {
    throw new Error("Cannot modify starter builds. Please create a new build from the starter build.");
  }
  return await updateBuild(buildId, data as Partial<BuildType>);
}


// ======================================
// GET BUILD BY ID (full BuildType)
// ======================================
export const getBuildById = async (id: number): Promise<BuildType | null> => {
  const build = await prisma.build.findUnique({
    where: { id },
    include: fullBuildInclude,
  });

  if (!build) return null;
  return BuildSchema.parse(build);
};

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
        create: buildData.abilities?.map((a) => ({
          abilityId: a.abilityId,
          level: a.level,
          activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
        })) ?? [],
      },
      passives: {
        create: buildData.passives?.map(mapBuildPassiveData) ?? [],
      },
      stigmas: {
        create: buildData.stigmas?.map((s) => ({
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
  } = {};
  
  if ('name' in data && data.name !== undefined) {
    updateData.name = data.name as string;
  }
  
  if ('class' in data && data.class && typeof data.class === 'object' && 'id' in data.class) {
    updateData.classId = (data.class as { id: number }).id;
  }
  
  // Handle shortcuts update
  if ('shortcuts' in data && data.shortcuts !== undefined) {
    updateData.shortcuts = data.shortcuts as BuildType["shortcuts"];
  }
  
  // Handle abilities update
  if ('abilities' in data && data.abilities !== undefined) {
    updateData.abilities = {
      deleteMany: { buildId },
      create: data.abilities.map(mapBuildAbilityData),
    };
  }
  
  // Handle passives update
  if ('passives' in data && data.passives !== undefined) {
    updateData.passives = {
      deleteMany: { buildId },
      create: data.passives.map(mapBuildPassiveData),
    };
  }
  
  // Handle stigmas update
  if ('stigmas' in data && data.stigmas !== undefined) {
    updateData.stigmas = {
      deleteMany: { buildId },
      create: data.stigmas.map(mapBuildStigmaData),
    };
  }
  
  const updated = await prisma.build.update({
    where: { id: buildId },
    data: updateData as Parameters<typeof prisma.build.update>[0]['data'],
    include: fullBuildInclude,
  });

  return BuildSchema.parse(updated);
}

// ======================================
// CREATE BUILD FROM STARTER BUILD
// ======================================
export async function createBuildFromStarter(starterBuildId: number): Promise<BuildType | null> {
  const starterBuild = await getBuildById(starterBuildId);
  if (!starterBuild) return null;

  const className = starterBuild.class.name.charAt(0).toUpperCase() + starterBuild.class.name.slice(1);
  
  // Find the first ability (smallest abilityId) - this is the auto attack
  const firstAbilityId = starterBuild.class?.abilities
    ? Math.min(...starterBuild.class.abilities.map(a => a.id))
    : null;
  
  const newBuild = await prisma.build.create({
    data: {
      name: `Custom - ${className} Build`,
      classId: starterBuild.classId,
      baseSP: starterBuild.baseSP,
      extraSP: starterBuild.extraSP,
      baseSTP: starterBuild.baseSTP,
      extraSTP: starterBuild.extraSTP,
      abilities: {
        create: starterBuild.abilities?.map((a) => ({
          abilityId: a.abilityId,
          level: a.abilityId === firstAbilityId ? 1 : 0, // First ability (auto attack) always starts at level 1
          activeSpecialtyChoiceIds: [],
        })) ?? [],
      },
      passives: {
        create: starterBuild.passives?.map((p) => ({
          passiveId: p.passiveId,
          level: 0, // New builds start at level 0, not copying starter build levels
          maxLevel: p.maxLevel,
        })) ?? [],
      },
      stigmas: {
        create: starterBuild.stigmas?.map((s) => ({
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
// GET RANDOM STARTER BUILD ID
// ======================================
export async function getRandomStarterBuildId(): Promise<number | null> {
  const classes = ["gladiator", "templar", "ranger", "assassin", "chanter", "sorcerer", "elementalist", "cleric"];
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  return await getStarterBuildIdByClassName(randomClass);
}

// ======================================
// GET ALL BUILDS
// ======================================
export async function getAllBuilds(): Promise<BuildType[]> {
  const builds = await prisma.build.findMany({
    include: {
      class: {
        include: {
          tags: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return builds.map((build) => BuildSchema.parse(build));
}

// ======================================
// CREATE BUILD FROM EXISTING BUILD
// ======================================
export async function createBuildFromBuild(sourceBuildId: number): Promise<BuildType | null> {
  const sourceBuild = await getBuildById(sourceBuildId);
  if (!sourceBuild) return null;

  // Find the first ability (smallest abilityId) - this is the auto attack
  const firstAbilityId = sourceBuild.class?.abilities
    ? Math.min(...sourceBuild.class.abilities.map(a => a.id))
    : null;

  const newBuild = await prisma.build.create({
    data: {
      name: `${sourceBuild.name} (Copy)`,
      classId: sourceBuild.classId,
      baseSP: sourceBuild.baseSP,
      extraSP: sourceBuild.extraSP,
      baseSTP: sourceBuild.baseSTP,
      extraSTP: sourceBuild.extraSTP,
      abilities: {
        create: sourceBuild.abilities?.map((a) => ({
          abilityId: a.abilityId,
          level: a.abilityId === firstAbilityId ? 1 : a.level, // First ability (auto attack) always starts at level 1
          activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
        })) ?? [],
      },
      passives: {
        create: sourceBuild.passives?.map(mapBuildPassiveData) ?? [],
      },
      stigmas: {
        create: sourceBuild.stigmas?.map((s) => ({
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

