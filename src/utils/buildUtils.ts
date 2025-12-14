import { BuildAbilityType, BuildStigmaType, BuildType, ClassItem } from "@/types/schema";

// ======================================
// HELPER: Check if build is a starter build
// ======================================
export function isStarterBuild(build: BuildType | null): boolean {
  if (!build) return false;
  return build.name.startsWith("Starter Build -");
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