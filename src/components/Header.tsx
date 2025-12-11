"use client";

import { usePathname } from "next/navigation";
import { CreateButton } from "./client/create-button";
import { Bahion } from "./Header/Bahion";
import { Navbar } from "./Header/Navbar";
import { SaveButton } from "./client/save-button";
import { ShareButton } from "./client/share-button";
import { Buildbar } from "./Header/BuildBar";

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="w-full h-16  flex items-center justify-center">
      <Bahion />
      {!pathname?.startsWith("/build") && <Navbar />}
      {pathname?.startsWith("/build") && <Buildbar />}
      <div className="h-full w-1/3 justify-end items-center flex gap-4">
        {!pathname?.startsWith("/build") && <CreateButton />}
        {pathname?.startsWith("/build") && (
          <>
            <SaveButton />
            <ShareButton />
          </>
        )}
      </div>
    </header>
  );
};
