"use server";

import { ClassType, TagTypeBase } from "@/types/schema";
import { prisma } from "../lib/prisma";

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

export const getClassTags = async (className: string): Promise<TagTypeBase[]> => {
  const cls = await prisma.class.findUnique({
    where: { name: className },
    include: { tags: true },
  });

  if (!cls) {
    return [];
  }

  return cls.tags; 
};