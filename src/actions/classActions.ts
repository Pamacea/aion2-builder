"use server";

import { ClassType, TagTypeBase } from "@/types/schema";
import { prisma } from "../lib/prisma";

export const getAllClass = async (): Promise<ClassType[]> => {
  try {
    return await prisma.class.findMany({
      include: { tags: true },
    });
  } catch (error) {
    console.error("Error in getAllClass:", error);
    // Si erreur de connexion, retourner un tableau vide plutôt que de casser l'app
    if (error instanceof Error && error.message.includes("ETIMEDOUT")) {
      console.error("Database connection timeout - check DATABASE_URL configuration");
      throw new Error("Database connection timeout. Please check your database configuration.");
    }
    throw error;
  }
};

export const getClassByName = async (name: string): Promise<ClassType | null> => {
  const cls = await prisma.class.findUnique({
    where: { name },
    include: { tags: true, abilities: true, passives: true, stigmas: true, builds: true },
  });
  return cls as ClassType | null;
};

export const getClassTags = async (className: string): Promise<TagTypeBase[]> => {
  const cls = await prisma.class.findUnique({
    where: { name: className },
    include: { tags: true },
  });

  return cls?.tags ?? [];
};