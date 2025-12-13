"use client";

import { BuildAbilityType, BuildPassiveType, BuildStigmaType } from "@/types/schema";
import { createContext, ReactNode, useContext, useState } from "react";

type SelectedSkill = {
  buildAbility?: BuildAbilityType;
  buildPassive?: BuildPassiveType;
  buildStigma?: BuildStigmaType;
} | null;

type SelectedSkillContextType = {
  selectedSkill: SelectedSkill;
  setSelectedSkill: (skill: SelectedSkill) => void;
};

const SelectedSkillContext = createContext<SelectedSkillContextType | undefined>(undefined);

export function SelectedSkillProvider({ children }: { children: ReactNode }) {
  const [selectedSkill, setSelectedSkill] = useState<SelectedSkill>(null);

  return (
    <SelectedSkillContext.Provider value={{ selectedSkill, setSelectedSkill }}>
      {children}
    </SelectedSkillContext.Provider>
  );
}

export function useSelectedSkill() {
  const context = useContext(SelectedSkillContext);
  if (context === undefined) {
    throw new Error("useSelectedSkill must be used within a SelectedSkillProvider");
  }
  return context;
}

