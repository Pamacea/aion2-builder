"use client";

import { CreateButton } from "@/components/client/buttons/create-button";
import { ClassType } from "@/types/schema";
import { memo, useMemo } from "react";
import { ClassBanner } from "../_client/class-banner";
import { ClassCharacter } from "../_client/class-character";
import { ClassHead } from "../_client/class-head";
import { MoreBuild } from "../_client/more-build";
import { TagsList } from "./tagsList";

export const Class = memo(({ classData, starterbuildId }: { classData: ClassType | null, starterbuildId: number | null }) => {
  // Mémoriser les valeurs calculées
  const bannerUrl = useMemo(() => classData?.bannerUrl || "default-banner.webp", [classData?.bannerUrl]);
  const characterUrl = useMemo(() => classData?.characterUrl || "default-character.webp", [classData?.characterUrl]);
  const starterBuildHref = useMemo(() => starterbuildId ? `/build/${starterbuildId}` : "", [starterbuildId]);
  const tags = useMemo(() => classData?.tags as { id: number; name: string }[] || [], [classData?.tags]);

  if (!classData) {
    return <div>Class is unavailable</div>;
  }

  return (
    <section className="w-full md:w-1/2 h-full flex flex-col justify-between md:flex-row gap-4 md:gap-8 lg:gap-16">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <ClassHead className={classData.name} />
        <TagsList tags={tags} />
        <ClassBanner classBanner={bannerUrl} />
        <CreateButton
          variant="text"
          starterBuildId={starterbuildId}
          text="create your build"
          showDiscordWhenUnauthenticated
          className="w-full py-3 flex justify-center items-center text-md uppercase bg-secondary/25 text-foreground font-bold hover:bg-primary/10 transition border-y-2 border-secondary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <MoreBuild starterBuildHref={starterBuildHref} />
      </div>
      <div className="flex justify-center items-center w-full md:w-1/2 h-full min-h-[400px] md:min-h-[600px]">
        <ClassCharacter ClassCharacter={characterUrl} />
      </div>
    </section>
  );
});

Class.displayName = "Class";
