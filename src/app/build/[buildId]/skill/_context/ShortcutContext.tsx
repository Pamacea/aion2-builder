"use client";

import { AbilityType, BuildAbilityType, BuildPassiveType, BuildStigmaType, PassiveType, StigmaType } from "@/types/schema";
import { createContext, ReactNode, useContext, useState } from "react";

type ShortcutSkill = {
  type: "ability" | "passive" | "stigma";
  ability?: AbilityType;
  passive?: PassiveType;
  stigma?: StigmaType;
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
};

type ShortcutContextType = {
  selectedSkill: ShortcutSkill | null;
  setSelectedSkill: (skill: ShortcutSkill | null) => void;
};

const ShortcutContext = createContext<ShortcutContextType | undefined>(undefined);

export const ShortcutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSkill, setSelectedSkill] = useState<ShortcutSkill | null>(null);

  return (
    <ShortcutContext.Provider value={{ selectedSkill, setSelectedSkill }}>
      {children}
    </ShortcutContext.Provider>
  );
};

export const useShortcutContext = () => {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error("useShortcutContext must be used within ShortcutProvider");
  }
  return context;
};

