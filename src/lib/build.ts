import { BuildSchema, BuildType } from "@/types/schema";
import { prisma } from "./prisma";

export const getBuildById = async (id: number): Promise<BuildType | null> => {
  const build = await prisma.build.findUnique({
    where: { id },
    include: { class: true, abilities: true, passives: true, stigmas: true },
  });

  if (!build) return null;

  return BuildSchema.parse(build);
};

export const getStarterBuildIdByClassName = async (className: string): Promise<number | null> => {
  const cls = await prisma.class.findUnique({
    where: { name: className },
    select: { 
      builds: { 
        select: { id: true }, 
        take: 1 
      } 
    },
  });

  if (!cls) {
    return null;
  }
  if (cls.builds.length === 0) {
    return null; 
  }
  return cls.builds[0].id;
};