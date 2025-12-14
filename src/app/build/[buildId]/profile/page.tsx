"use client";

import { getClassTags } from "@/actions/classActions";
import { useBuildStore } from "@/store/useBuildEditor";
import { TagTypeBase } from "@/types/schema";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BuildName } from "./_client/build-name";
import { ProfilelassBanner } from "./_client/class-banner";
import { ClassSelect } from "./_client/class-select";
import { TagsList } from "@/app/classes/[slug]/_components/tagsList";

export default function BuildProfilePage() {
  const params = useParams();
  const buildId = params?.buildId as string;
  const { build, loadBuild, loading } = useBuildStore();
  const [classTags, setClassTags] = useState<TagTypeBase[]>([]);

  useEffect(() => {
    if (buildId) {
      const numericBuildId = Number(buildId);
      if (!isNaN(numericBuildId)) {
        loadBuild(numericBuildId);
      }
    }
  }, [buildId, loadBuild]);

  useEffect(() => {
    if (build?.class?.name) {
      getClassTags(build.class.name).then(setClassTags);
    }
  }, [build?.class?.name]);

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
