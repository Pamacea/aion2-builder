"use client";

import { Loading } from "@/components/Loading/Loading";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { DaevanionPlanner } from "./_components/DaevanionPlanner";

export default function BuildSpherePage() {
  const { build, loading } = useBuildLoader();

  if (loading || !build) return <Loading />;

  return (
    <main className="w-full h-auto lg:h-full flex flex-col items-center justify-between gap-2 sm:gap-4 lg:gap-8 px-2 sm:px-4 lg:px-0">
      <div className="w-full h-full">
        <DaevanionPlanner />
      </div>
    </main>
  );
}
