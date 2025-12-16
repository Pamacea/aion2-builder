"use server";

import { ClassType, TagTypeBase } from "@/types/schema";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "../lib/prisma";

// Cache Next.js pour les données statiques (revalidate toutes les 5 minutes)
const getAllClassCached = unstable_cache(
  async (): Promise<ClassType[]> => {
    try {
      // Optimisation: sélectionner uniquement les champs nécessaires pour réduire la latence
      return await prisma.class.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          iconUrl: true,
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: 'asc', // Ordre cohérent pour le cache
        },
      }) as ClassType[];
    } catch (error) {
      console.error("Error in getAllClass:", error);
      if (error instanceof Error && error.message.includes("ETIMEDOUT")) {
        console.error("Database connection timeout - check DATABASE_URL configuration");
        throw new Error("Database connection timeout. Please check your database configuration.");
      }
      throw error;
    }
  },
  ['all-classes'], // Cache key
  {
    revalidate: 300, // Revalidate toutes les 5 minutes (300 secondes)
    tags: ['classes'], // Tag pour invalidation manuelle si nécessaire
  }
);

// Utiliser React cache + Next.js cache pour éviter les requêtes dupliquées
export const getAllClass = cache(async (): Promise<ClassType[]> => {
  return getAllClassCached();
});

// Cache pour getClassByName - les données de classe changent rarement
const getClassByNameCached = unstable_cache(
  async (name: string): Promise<ClassType | null> => {
    const cls = await prisma.class.findUnique({
      where: { name },
      include: { tags: true, abilities: true, passives: true, stigmas: true, builds: true },
    });
    return cls as ClassType | null;
  },
  ['class-by-name'], // Cache key prefix
  {
    revalidate: 600, // Revalidate toutes les 10 minutes (les classes changent rarement)
    tags: ['classes'], // Tag pour invalidation manuelle si nécessaire
  }
);

export const getClassByName = cache(async (name: string): Promise<ClassType | null> => {
  return getClassByNameCached(name);
});

export const getClassTags = async (className: string): Promise<TagTypeBase[]> => {
  const cls = await prisma.class.findUnique({
    where: { name: className },
    include: { tags: true },
  });

  return cls?.tags ?? [];
};