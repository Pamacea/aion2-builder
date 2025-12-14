import { ClassButton, HomeButton, MoreBuildButton } from "../client/buttons";

export const Navbar = () => {
  return (
    <nav className="w-1/3 h-full flex items-center justify-center">
      <HomeButton />
      <ClassButton />
      <MoreBuildButton />
    </nav>
  );
};
