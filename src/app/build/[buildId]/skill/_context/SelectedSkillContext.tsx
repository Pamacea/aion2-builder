"use client";

import {
  SelectedSkill,
  SelectedSkillContextType,
} from "@/types/selected-context.type";
import { createContext, ReactNode, useContext, useState } from "react";

const SelectedSkillContext = createContext<
  SelectedSkillContextType | undefined
>(undefined);

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
    throw new Error(
      "useSelectedSkill must be used within a SelectedSkillProvider"
    );
  }
  return context;
}
