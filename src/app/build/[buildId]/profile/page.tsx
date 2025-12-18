"use client";

import { TagsList } from "@/app/classes/[slug]/_components/tagsList";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { ProfilelassBanner } from "./_client/class-banner";
import { ProfileButtons } from "./_client/profile-buttons";
import { useClassTags } from "./_utils/useClassTags";

// Code splitting : charger les composants de manière lazy
const BuildName = dynamic(() => import("./_client/build-name").then(mod => ({ default: mod.BuildName })), {
  loading: () => <div className="w-full">Loading...</div>,
});

const ClassSelect = dynamic(() => import("./_client/class-select").then(mod => ({ default: mod.ClassSelect })), {
  loading: () => <div className="w-full">Loading...</div>,
});

export default function BuildProfilePage() {
  const { build, loading } = useBuildLoader();
  const classTags = useClassTags();

  // Mémoriser la bannière pour éviter les recalculs
  const classBanner = useMemo(() => build?.class.bannerUrl, [build?.class.bannerUrl]);

  if (loading || !build) return <p>Loading...</p>;

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-4">
      <div className="flex justify-between items-center w-1/2">
        <ClassSelect />
        <BuildName />
      </div>
      <div className="w-1/2">
        <TagsList tags={classTags} />
      </div>
      {classBanner && <ProfilelassBanner classBanner={classBanner} />}
      <ProfileButtons />
    </main>
  );
}
