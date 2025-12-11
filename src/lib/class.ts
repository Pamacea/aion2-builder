import { prisma } from "./prisma";
import { ClassType } from "@/types/schema";

export const getAllClass = async (): Promise<ClassType[]> => {
  return prisma.class.findMany({
    include: { tags: true },
  });
};

export const getClassByName = async (name: string): Promise<ClassType | null> => {
  const cls = await prisma.class.findUnique({
    where: { name },
    include: { tags: true, abilities: true, passives: true, stigmas: true, builds: true },
  });

  if (!cls) return null;

  return cls;
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