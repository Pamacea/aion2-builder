import { BuildType } from "@/types/schema";

// ======================================
// HELPER: Check if build is a starter build
// ======================================
export function isStarterBuild(build: BuildType | null): boolean {
  if (!build) return false;
  return build.name.startsWith("Starter Build -");
}
