"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { Shortcut } from "./_components/Shortcut";
import { Skill } from "./_components/Skill";
import { SkillDetails } from "./_components/SkillDetails";
import { SelectedSkillProvider } from "./_context/SelectedSkillContext";
import { ShortcutProvider } from "./_context/ShortcutContext";

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
