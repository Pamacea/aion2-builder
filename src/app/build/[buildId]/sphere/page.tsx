"use client";

import { useBuildLoader } from "../_utils/useBuildLoader";

export default function BuildSpherePage() {
  const { build, loading } = useBuildLoader();

  if (loading || !build) return <p>Loading...</p>;

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-4">
      <div className="flex justify-between items-center w-1/2"></div>
      <div className="w-1/2"></div>
    </main>
  );
}
