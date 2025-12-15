import { ClassButton } from "../../_components/classButton";

export const DefaultBuildButton = ({
  starterBuildHref,
}: {
  starterBuildHref: string;
}) => {
  return (
    <ClassButton href={starterBuildHref} className="w-60">
      Starter Build
    </ClassButton>
  );
};
