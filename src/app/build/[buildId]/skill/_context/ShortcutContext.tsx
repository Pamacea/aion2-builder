"use client";

import { ShortcutContextType, ShortcutSkill } from "@/types/shortcut.type";
import { createContext, ReactNode, useContext, useState } from "react";

const ShortcutContext = createContext<ShortcutContextType | undefined>(
  undefined
);

export const ShortcutProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSkill, setSelectedSkill] = useState<ShortcutSkill | null>(
    null
  );

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
