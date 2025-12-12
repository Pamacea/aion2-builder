import { DefaultBuildButton } from "./defaultbuild-button"
import { ShowMoreBuildButton } from "./showmorebuild-button"

export const MoreBuild = ({starterBuildHref} : {starterBuildHref: string}) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <DefaultBuildButton starterBuildHref={starterBuildHref} />
            <ShowMoreBuildButton />
        </div>
    );
};