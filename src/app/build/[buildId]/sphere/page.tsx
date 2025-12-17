"use client";

import { useBuildLoader } from "../_utils/useBuildLoader";
import { DaevanionPlanner } from "./_client/DaevanionPlanner";

export default function BuildSpherePage() {
  const { build, loading } = useBuildLoader();

  if (loading || !build) return <p>Loading...</p>;

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-4">
      <div className="w-full h-[88vh]">
        <DaevanionPlanner />
      </div>
    </main>
  );
}
