"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-4">
      <div className="flex justify-between items-center w-1/2"></div>
      <div className="w-1/2"></div>
    </main>
  );
}
