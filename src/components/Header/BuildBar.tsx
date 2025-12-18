import { ProfileButton, SkillButton, SphereButton } from "../client/buttons";
import { GearButton } from "../client/buttons/gear-button";

export const Buildbar = () => {
  return (
    <nav className="w-full md:w-1/3 h-full flex items-center justify-center gap-1 md:gap-0">
        <ProfileButton />
        <SkillButton  />
        <GearButton />
        <SphereButton />
    </nav>
  );
};
