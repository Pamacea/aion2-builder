"use client";

import { useBuildLoader } from "../_utils/useBuildLoader";
import { DaevanionPlanner } from "./_components/DaevanionPlanner";

export default function BuildSpherePage() {
  const { build, loading } = useBuildLoader();

  if (loading || !build) return <p>Loading...</p>;

  return (
    <main className="w-full h-full flex flex-col items-center justify-between gap-8">
      <div className="w-full">
        <DaevanionPlanner />
      </div>
    </main>
  );
}
