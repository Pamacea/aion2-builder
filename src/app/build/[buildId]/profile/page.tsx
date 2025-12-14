"use client";

import { TagsList } from "@/app/classes/[slug]/_components/tagsList";
import { useBuildLoader } from "../_utils/useBuildLoader";
import { BuildName } from "./_client/build-name";
import { ProfilelassBanner } from "./_client/class-banner";
import { ClassSelect } from "./_client/class-select";
import { useClassTags } from "./_utils/useClassTags";

export default function BuildProfilePage() {
  const { build, loading } = useBuildLoader();
  const classTags = useClassTags();

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
      <ProfilelassBanner classBanner={build.class.bannerUrl} />
    </main>
  );
}
