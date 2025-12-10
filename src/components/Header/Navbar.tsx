import { ClassButton } from "../client/class-button";
import { HomeButton } from "../client/home-button";

export const Navbar = () => {
  return (
    <nav className="w-1/3 h-full flex items-center justify-center">
      <HomeButton />
      <ClassButton />
    </nav>
  );
};
