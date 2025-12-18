"use client";

import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { useDaevanionInitializer } from "../_utils/useDaevanionInitializer";
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
  // Initialiser le store Daevanion avec les données du build
  useDaevanionInitializer();

  if (loading || !build) return <p>Loading...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SelectedSkillProvider>
        <ShortcutProvider>
          <main className="w-full h-auto lg:h-[88vh] flex flex-col lg:flex-row justify-between gap-2 sm:gap-4 px-2 sm:px-4 lg:px-0">
            <div className="w-full lg:w-1/4 h-[40vh] sm:h-[50vh] lg:h-full overflow-y-auto border-b-2 lg:border-b-0 lg:border-r-2 border-secondary pb-2 lg:pb-0 pr-2 lg:pr-4">
              <SkillDetails />
            </div>
            <div className="w-full lg:w-2/5 h-[40vh] sm:h-[50vh] lg:h-full overflow-y-auto border-b-2 lg:border-b-0 lg:border-r-2 border-secondary pb-2 lg:pb-0 px-2 lg:px-4 lg:pr-4">
              <Shortcut />
            </div>
            <div className="w-full lg:w-4/16 h-auto lg:h-full overflow-hidden pl-2 lg:pl-4">
              <Skill />
            </div>
          </main>
        </ShortcutProvider>
      </SelectedSkillProvider>
    </DndProvider>
  );
}
