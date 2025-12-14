import { ProfileButton, SkillButton, SphereButton } from "../client/buttons";

export const Buildbar = () => {
  return (
    <nav className="w-1/3 h-full flex items-center justify-center">
        <ProfileButton />
        <SkillButton  />
        <SphereButton />
    </nav>
  );
};
