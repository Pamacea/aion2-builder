import { DefaultBuildButton } from "./defaultbuild-button"
import { ShowMoreBuildButton } from "./showmorebuild-button"

export const MoreBuild = () => {
    return (
        <div className="flex items-center justify-between gap-4">
            <DefaultBuildButton />
            <ShowMoreBuildButton />
        </div>
    );
};