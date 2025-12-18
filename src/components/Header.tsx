"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { LikeButton, ShareButton } from "./client/buttons";
import { AuthButton } from "./client/buttons/auth-button";
import { Bahion } from "./Header/Bahion";
import { Buildbar } from "./Header/BuildBar";
import { HeaderNav } from "./Header/HeaderNav";

export const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, userName } = useAuth();

  return (
    <header className="w-full h-14 flex items-center justify-between px-2 md:px-0 gap-2 md:gap-0 relative z-50">
      <Bahion />
      {!pathname?.startsWith("/build") && <HeaderNav />}
      {pathname?.startsWith("/build") && <Buildbar />}
      <div className="h-full w-auto md:w-1/3 justify-end items-center flex gap-1 sm:gap-2 md:gap-4 shrink-0">
        {pathname?.startsWith("/build") && (
          <>
            <LikeButton />
            <ShareButton />
          </>
        )}
        {!isLoading && (
          <AuthButton
            isAuthenticated={isAuthenticated || false}
            userName={userName}
            compact
          />
        )}
      </div>
    </header>
  );
};
