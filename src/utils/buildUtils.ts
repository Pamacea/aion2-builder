import { BuildAbilityType, BuildStigmaType, BuildType, ClassItem } from "@/types/schema";

// ======================================
// HELPER: Get admin user ID
// ======================================
function getAdminUserId(): string | null {
  // Server-side: use ADMIN_USER_ID (preferred) or NEXT_PUBLIC_ADMIN_USER_ID
  if (typeof process !== "undefined" && process.env) {
    const env = process.env as { ADMIN_USER_ID?: string; NEXT_PUBLIC_ADMIN_USER_ID?: string };
    return env.ADMIN_USER_ID || env.NEXT_PUBLIC_ADMIN_USER_ID || null;
  }
  // Client-side: only NEXT_PUBLIC_ADMIN_USER_ID is available
  // Next.js exposes NEXT_PUBLIC_ variables via process.env at build time
  if (typeof window !== "undefined") {
    const env = (typeof process !== "undefined" ? (process.env as { NEXT_PUBLIC_ADMIN_USER_ID?: string }) : {}) || {};
    return env.NEXT_PUBLIC_ADMIN_USER_ID || null;
  }
  return null;
}

// ======================================
// HELPER: Check if user is admin
// Works both server-side and client-side
// ======================================
export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const adminUserId = getAdminUserId();
  if (!adminUserId) {
    // Debug: log in development to help troubleshoot
    if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
      console.warn("[isAdmin] No ADMIN_USER_ID configured. Set ADMIN_USER_ID or NEXT_PUBLIC_ADMIN_USER_ID in .env.local");
    }
    return false;
  }
  const isAdminResult = userId === adminUserId;
  // Debug: log in development to help troubleshoot
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development" && isAdminResult) {
    console.log("[isAdmin] Admin check passed for userId:", userId);
  }
  return isAdminResult;
}

// ======================================
// HELPER: Check if build is a starter build
// ======================================
export function isStarterBuild(build: BuildType | null): boolean {
  if (!build) return false;
  return build.name.includes("-starter-build");
}

// ======================================
// HELPER: Check if user is the owner of the build
// ======================================
export function isBuildOwner(build: BuildType | null, userId: string | null | undefined): boolean {
  if (!build) return false;
  // Starter builds n'ont pas de propriétaire
  if (isStarterBuild(build)) return false;
  // Si le build n'a pas de userId, il n'a pas de propriétaire
  if (!build.userId) return false;
  // Vérifier si l'utilisateur actuel est le propriétaire
  return build.userId === userId;
}

// ======================================
// HELPER: Check if user can edit the build (owner or admin)
// ======================================
export function canEditBuild(build: BuildType | null, userId: string | null | undefined): boolean {
  if (!build) return false;
  // Les admins peuvent modifier tous les builds (sauf starter builds)
  if (isAdmin(userId) && !isStarterBuild(build)) return true;
  // Sinon, vérifier si c'est le propriétaire
  return isBuildOwner(build, userId);
}

export const syncChainSkills = <T extends BuildAbilityType | BuildStigmaType>(
  items: T[],
  parentLevel: number,
  chainSkillIds: number[],
  getClassItem: (id: number) => ClassItem | undefined,
  createNewItem: (id: number, level: number, classItem: ClassItem) => T
): T[] => {
  const result = [...items];
  
  chainSkillIds.forEach((chainSkillId) => {
    const existingIndex = result.findIndex((item) => 
      ('abilityId' in item ? item.abilityId : item.stigmaId) === chainSkillId
    );
    
    if (existingIndex !== -1) {
      result[existingIndex] = { ...result[existingIndex], level: parentLevel };
    } else {
      const classItem = getClassItem(chainSkillId);
      if (classItem) {
        result.push(createNewItem(chainSkillId, parentLevel, classItem));
      }
    }
  });
  
  return result;
};