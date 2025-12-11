import { ClassButton } from "../client/class-button";
import { HomeButton } from "../client/home-button";
import { ProfileButton } from "../client/profile-button";
import { SkillButton } from "../client/skill-button";
import { SphereButton } from "../client/sphere-button";

export const Buildbar = () => {
  return (
    <nav className="w-1/3 h-full flex items-center justify-center">
        <ProfileButton />
        <SkillButton  />
        <SphereButton />
    </nav>
  );
};
