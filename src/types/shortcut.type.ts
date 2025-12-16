import { AbilityType } from "./ability.type";
import { BuildAbilityType, BuildPassiveType, BuildStigmaType } from "./build.type";
import { PassiveType } from "./passive.type";
import { StigmaType } from "./stigma.type";

// ==========
// SHORTCUT TYPE
// ==========
export type ShortcutSkill = {
    type: "ability" | "passive" | "stigma";
    ability?: AbilityType;
    passive?: PassiveType;
    stigma?: StigmaType;
    buildAbility?: BuildAbilityType;
    buildPassive?: BuildPassiveType;
    buildStigma?: BuildStigmaType;
  };
  
  export type ShortcutContextType = {
    selectedSkill: ShortcutSkill | null;
    setSelectedSkill: (skill: ShortcutSkill | null) => void;
  };

  export type ShortcutSlotProps = {
    slotId: number;
    skill?: {
      type: "ability" | "passive" | "stigma";
      ability?: AbilityType;
      passive?: PassiveType;
      stigma?: StigmaType;
      buildAbility?: BuildAbilityType;
      buildPassive?: BuildPassiveType;
      buildStigma?: BuildStigmaType;
    };
    onDrop: (slotId: number, skill: ShortcutSlotProps["skill"], sourceSlotId?: number) => void;
    onClear: (slotId: number) => void;
    className?: string;
    isReserved?: boolean; // If true, this slot is reserved and cannot be dragged from or have other skills dropped in
    isStigmaOnly?: boolean; // If true, this slot only accepts stigmas
    disabled?: boolean; // If true, cannot drag, drop or modify shortcuts (e.g., when not owner)
  };