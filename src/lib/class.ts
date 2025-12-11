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
