import { ClassType } from "@/types/schema";
import { CreateYourBuildButton } from "../_client/buttons/createyourbuild-button";
import { ClassBanner } from "../_client/class-banner";
import { ClassCharacter } from "../_client/class-character";
import { ClassHead } from "../_client/class-head";
import { MoreBuild } from "../_client/more-build";
import { TagsList } from "./tagsList";

export const Class = ({ classData, starterbuildId }: { classData: ClassType | null, starterbuildId: number | null }) => {
  if (!classData) {
    return <div>Class is unavailable</div>;
  }

  return (
    <section className="w-1/2 h-full flex flex-col justify-between md:flex-row gap-8 md:gap-16">
      <div className="w-1/2 flex flex-col gap-4">
        <ClassHead className={classData.name} />
        <TagsList tags={classData.tags as { id: number; name: string }[]} />
        <ClassBanner
          classBanner={classData.bannerUrl || "default-banner.webp"}
        />
        <CreateYourBuildButton starterBuildId={starterbuildId} />
        <MoreBuild starterBuildHref={`/build/${starterbuildId}`} />
      </div>
      <div className="flex justify-center items-center">
        <ClassCharacter
          ClassCharacter={classData.characterUrl || "default-character.webp"}
        />
      </div>
    </section>
  );
};
