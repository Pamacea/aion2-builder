import { ClassButton, HomeButton, MoreBuildButton } from "../client/buttons";

export const HeaderNav = () => {
  return (
    <nav className="w-full md:w-1/3 h-full flex items-center justify-center gap-2 md:gap-0">
      <HomeButton />
      <ClassButton />
      <MoreBuildButton />
    </nav>
  );
};
