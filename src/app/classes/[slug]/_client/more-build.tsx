import { DefaultBuildButton } from "./buttons/defaultbuild-button";
import { ShowMoreBuildButton } from "./buttons/showmorebuild-button";

export const MoreBuild = ({
  starterBuildHref,
}: {
  starterBuildHref: string;
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
    <DefaultBuildButton starterBuildHref={starterBuildHref} />
    <ShowMoreBuildButton />
  </div>
);