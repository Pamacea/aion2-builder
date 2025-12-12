import { ClassType } from "@/types/schema";
import { ClassBanner } from "../client/class-banner";
import { ClassCharacter } from "../client/class-character";
import { ClassHead } from "../client/class-head";
import { CreateYourBuildButton } from "../client/createyourbuild-button";
import { MoreBuild } from "../client/morebuild";
import { TagList } from "./TagList";

export const Class = ({ classData, starterbuildId }: { classData: ClassType | null, starterbuildId: number | null }) => {
  if (!classData) {
    return <div>Class is unavailable</div>;
  }

  return (
    <section className="w-1/2 h-full flex flex-col justify-between md:flex-row gap-8 md:gap-16">
      <div className="flex flex-col gap-4">
        <ClassHead className={classData.name} />
        <TagList tags={classData.tags as { id: number; name: string }[]} />
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
