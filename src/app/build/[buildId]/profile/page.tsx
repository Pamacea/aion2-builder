"use client";

import { TagsList } from "@/app/classes/[slug]/_components/tagsList";
import { Loading } from "@/components/Loading/Loading";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { ProfilelassBanner } from "./_client/class-banner";
import { ProfileButtons } from "./_client/profile-buttons";
import { useClassTags } from "./_utils/useClassTags";

// Code splitting : charger les composants de manière lazy
const BuildName = dynamic(() => import("./_client/build-name").then(mod => ({ default: mod.BuildName })), {
  loading: () => <Loading />,
});

const ClassSelect = dynamic(() => import("./_client/class-select").then(mod => ({ default: mod.ClassSelect })), {
  loading: () => <Loading />,
});

export default function BuildProfilePage() {
  const { build, loading } = useBuildLoader();
  const classTags = useClassTags();

  // Mémoriser la bannière pour éviter les recalculs
  const classBanner = useMemo(() => build?.class.bannerUrl, [build?.class.bannerUrl]);

  if (loading || !build) return <Loading />;

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-6 sm:gap-8 py-4 px-2 sm:px-0">
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-start md:justify-around items-center justify-center gap-4 md:gap-0">
        <ClassSelect />
        <BuildName />
      </div>
      <div className="w-full max-w-5xl flex justify-center">
        <TagsList tags={classTags} />
      </div>
      {classBanner && <ProfilelassBanner classBanner={classBanner} />}
      <ProfileButtons />
    </main>
  );
}
