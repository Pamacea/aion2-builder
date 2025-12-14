import { STIGMA_SLOT_END, STIGMA_SLOT_START } from "@/app/build/[buildId]/skill/_utils/constants";
import { ShortcutSkill } from "@/types/shortcut.type";

// Helper function to check if a slot is reserved for stigmas
export const isStigmaOnlySlot = (slotId: number): boolean => {
    return slotId >= STIGMA_SLOT_START && slotId <= STIGMA_SLOT_END;
  };
  
  // Helper function to check if two skills are the same
  export const isSameSkill = (
    skill1: ShortcutSkill | undefined,
    skill2: ShortcutSkill | undefined
  ): boolean => {
    if (!skill1 || !skill2) return false;
    if (skill1.type !== skill2.type) return false;
  
    if (skill1.type === "ability" && skill2.type === "ability") {
      return (
        skill1.ability?.id === skill2.ability?.id &&
        skill1.buildAbility?.id === skill2.buildAbility?.id
      );
    }
  
    if (skill1.type === "stigma" && skill2.type === "stigma") {
      return (
        skill1.stigma?.id === skill2.stigma?.id &&
        skill1.buildStigma?.id === skill2.buildStigma?.id
      );
    }
  
    return false;
  };