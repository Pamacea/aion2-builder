"use server";

import { BuildSchema, BuildType } from "@/types/schema";
import { isStarterBuild } from "@/utils/buildUtils";
import { prisma } from "../lib/prisma";

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
    include: {
      class: {
        include: {
          tags: true,
          abilities: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
          passives: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
          stigmas: {
            include: {
              spellTag: true,
            },
          },
        },
      },
      abilities: {
        include: {
          ability: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
        },
      },
      passives: {
        include: {
          passive: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
        },
      },
      stigmas: {
        include: {
          stigma: {
            include: {
              spellTag: true,
              classes: {
                include: {
                  tags: true,
                },
              },
            },
          },
        },
      },
    },
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
        create: buildData.abilities?.map((ability) => ({
          abilityId: ability.abilityId,
          level: ability.level,
          activeSpecialtyChoiceIds: ability.activeSpecialtyChoiceIds ?? [],
        })) ?? [],
      },

      passives: {
        create: buildData.passives?.map((passive) => ({
          passiveId: passive.passiveId,
          level: passive.level,
        })) ?? [],
      },

      stigmas: {
        create: buildData.stigmas?.map((stigma) => ({
          stigmaId: stigma.stigmaId,
          stigmaCost: stigma.stigmaCost,
        })) ?? [],
      },
    },

    include: {
      class: {
        include: {
          tags: true,
          abilities: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
          passives: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
          stigmas: {
            include: {
              spellTag: true,
            },
          },
        },
      },
      abilities: {
        include: {
          ability: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
        },
      },
      passives: {
        include: {
          passive: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
        },
      },
      stigmas: {
        include: {
          stigma: {
            include: {
              spellTag: true,
              classes: {
                include: {
                  tags: true,
                },
              },
            },
          },
        },
      },
    },
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
  
  // Handle abilities update
  if ('abilities' in data && data.abilities !== undefined) {
    updateData.abilities = {
      deleteMany: { buildId },
      create: data.abilities.map((a) => ({
        abilityId: a.abilityId,
        level: a.level,
        activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds ?? [],
      })),
    };
  }
  
  // Handle passives update
  if ('passives' in data && data.passives !== undefined) {
    updateData.passives = {
      deleteMany: { buildId },
      create: data.passives.map((p) => ({
        passiveId: p.passiveId,
        level: p.level,
      })),
    };
  }
  
  // Handle stigmas update
  if ('stigmas' in data && data.stigmas !== undefined) {
    updateData.stigmas = {
      deleteMany: { buildId },
      create: data.stigmas.map((s) => ({
        stigmaId: s.stigmaId,
        level: s.level,
        stigmaCost: s.stigmaCost ?? 10,
      })),
    };
  }
  
  const updated = await prisma.build.update({
    where: { id: buildId },
    data: updateData,
    include: {
      class: {
        include: {
          tags: true,
          abilities: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
          passives: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
          stigmas: {
            include: {
              spellTag: true,
            },
          },
        },
      },
      abilities: {
        include: {
          ability: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
        },
      },
      passives: {
        include: {
          passive: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
        },
      },
      stigmas: {
        include: {
          stigma: {
            include: {
              spellTag: true,
              classes: {
                include: {
                  tags: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return BuildSchema.parse(updated);
}

// ======================================
// CREATE BUILD FROM STARTER BUILD
// ======================================
export async function createBuildFromStarter(starterBuildId: number): Promise<BuildType | null> {
  // Get the starter build
  const starterBuild = await getBuildById(starterBuildId);
  if (!starterBuild) return null;

  // Create a new build based on the starter build
  const className = starterBuild.class.name.charAt(0).toUpperCase() + starterBuild.class.name.slice(1);
  const newBuild = await prisma.build.create({
    data: {
      name: `Custom - ${className} Build`,
      classId: starterBuild.classId,
      baseSP: starterBuild.baseSP,
      extraSP: starterBuild.extraSP,
      baseSTP: starterBuild.baseSTP,
      extraSTP: starterBuild.extraSTP,

      abilities: {
        create: starterBuild.abilities?.map((ability) => ({
          abilityId: ability.abilityId,
          level: ability.level,
          activeSpecialtyChoiceIds: ability.activeSpecialtyChoiceIds ?? [],
        })) ?? [],
      },

      passives: {
        create: starterBuild.passives?.map((passive) => ({
          passiveId: passive.passiveId,
          level: passive.level,
        })) ?? [],
      },

      stigmas: {
        create: starterBuild.stigmas?.map((stigma) => ({
          stigmaId: stigma.stigmaId,
          stigmaCost: stigma.stigmaCost,
        })) ?? [],
      },
    },

    include: {
      class: {
        include: {
          tags: true,
          abilities: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
          passives: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
          stigmas: {
            include: {
              spellTag: true,
            },
          },
        },
      },
      abilities: {
        include: {
          ability: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
              specialtyChoices: true,
            },
          },
        },
      },
      passives: {
        include: {
          passive: {
            include: {
              class: {
                include: {
                  tags: true,
                },
              },
              spellTag: true,
            },
          },
        },
      },
      stigmas: {
        include: {
          stigma: {
            include: {
              spellTag: true,
              classes: {
                include: {
                  tags: true,
                },
              },
            },
          },
        },
      },
    },
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

