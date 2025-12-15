import { BuildAbilityType, BuildStigmaType, BuildType, ClassItem } from "@/types/schema";

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