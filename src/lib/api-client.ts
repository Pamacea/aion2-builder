"use client";

// Client-side API wrappers to avoid importing server actions directly
// This prevents bundling server-only code (prisma) in client components

import { BuildType } from "@/types/schema";

export const loadBuildApi = async (buildId: number): Promise<BuildType | null> => {
  const response = await fetch(`/api/builds/${buildId}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
};

export const saveBuildApi = async (buildId: number, build: Partial<BuildType>): Promise<void> => {
  const response = await fetch(`/api/builds/${buildId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(build),
  });
  if (!response.ok) {
    throw new Error("Failed to save build");
  }
};

export const getClassByNameApi = async (className: string) => {
  const response = await fetch(`/api/classes/${className}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
};

