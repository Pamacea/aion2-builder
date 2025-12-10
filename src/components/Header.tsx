import { CreateButton } from "./client/create-button";
import { Bahion } from "./Header/Bahion";
import { Navbar } from "./Header/Navbar";

export const Header = () => {
  return (
    <header className="w-full h-16  flex items-center justify-center">
      <Bahion />
      <Navbar />
      <div
        className="h-full w-1/3 justify-end items-center flex"
      >
        <CreateButton />
      </div>
    </header>
  );
};
