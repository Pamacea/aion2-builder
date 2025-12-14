"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { isStarterBuild } from "@/utils/buildUtils";
import { usePathname } from "next/navigation";
import { CreateButton, ShareButton } from "./client/buttons";
import { Bahion } from "./Header/Bahion";
import { Buildbar } from "./Header/buildBar";
import { Navbar } from "./Header/navBar";

export const Header = () => {
  const pathname = usePathname();

  const { build } = useBuildStore();
  const isStarter = isStarterBuild(build);

  return (
    <header className="w-full h-14  flex items-center justify-center">
      <Bahion />
      {!pathname?.startsWith("/build") && <Navbar />}
      {pathname?.startsWith("/build") && <Buildbar />}
      <div className="h-full w-1/3 justify-end items-center flex gap-4">
        {!pathname?.startsWith("/build") && <CreateButton />}
        {pathname?.startsWith("/build") && (
          <>
            {!isStarter && <ShareButton />}
            {isStarter && <CreateButton />}
          </>
        )}
      </div>
    </header>
  );
};
