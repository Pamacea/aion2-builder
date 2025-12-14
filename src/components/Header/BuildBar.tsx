import { ProfileButton, SkillButton, SphereButton } from "../client/buttons";
import { GearButton } from "../client/buttons/gear-button";

export const Buildbar = () => {
  return (
    <nav className="w-1/3 h-full flex items-center justify-center">
        <ProfileButton />
        <SkillButton  />
        <GearButton />
        <SphereButton />
    </nav>
  );
};
