"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Shortcut } from "./_components/Shortcut";
import { Skill } from "./_components/Skill";
import { SkillDetails } from "./_components/SkillDetails";
import { SelectedSkillProvider } from "./_context/SelectedSkillContext";
import { ShortcutProvider } from "./_context/ShortcutContext";

export default function BuildSkillPage() {
  const params = useParams();
  const buildId = params?.buildId as string;
  const { build, loadBuild, loading } = useBuildStore();

  useEffect(() => {
    if (buildId) {
      const numericBuildId = Number(buildId);
      if (!isNaN(numericBuildId)) {
        loadBuild(numericBuildId);
      }
    }
  }, [buildId, loadBuild]);

  if (loading || !build) return <p>Loading...</p>;


  return (
    <DndProvider backend={HTML5Backend}>
      <SelectedSkillProvider>
        <ShortcutProvider>
          <main className="w-full h-[88vh] flex flex-row justify-between">
            {/* Left: Skill Details */}
            <div className="w-1/4 h-full overflow-y-auto">
              <SkillDetails />
            </div>

            {/* Middle: Shortcut Bar  */}
            <div className="w-2/5 h-full overflow-y-auto">
              <Shortcut />
            </div>

            {/* Right: Skills Grid */}
            <div className="w-4/16 h-full overflow-hidden">
              <Skill />
            </div>
          </main>
        </ShortcutProvider>
      </SelectedSkillProvider>
    </DndProvider>
  );
}
