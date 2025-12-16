"use client";

import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { SelectedSkillProvider } from "./_context/SelectedSkillContext";
import { ShortcutProvider } from "./_context/ShortcutContext";

// Code splitting : charger les gros composants de manière lazy
const SkillDetails = dynamic(() => import("./_components/SkillDetails").then(mod => ({ default: mod.SkillDetails })), {
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>,
});

const Shortcut = dynamic(() => import("./_components/Shortcut").then(mod => ({ default: mod.Shortcut })), {
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>,
});

const Skill = dynamic(() => import("./_components/Skill").then(mod => ({ default: mod.Skill })), {
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>,
});

export default function BuildSkillPage() {
  const { build, loading } = useBuildLoader();

  if (loading || !build) return <p>Loading...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SelectedSkillProvider>
        <ShortcutProvider>
          <main className="w-full h-[88vh] flex flex-row justify-between">
            <div className="w-1/4 h-full overflow-y-auto">
              <SkillDetails />
            </div>
            <div className="w-2/5 h-full overflow-y-auto">
              <Shortcut />
            </div>
            <div className="w-4/16 h-full overflow-hidden">
              <Skill />
            </div>
          </main>
        </ShortcutProvider>
      </SelectedSkillProvider>
    </DndProvider>
  );
}
