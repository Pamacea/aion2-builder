"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { LikeButton, ShareButton } from "./client/buttons";
import { AuthButton } from "./client/buttons/auth-button";
import { Bahion } from "./Header/Bahion";
import { Navbar } from "./Header/NavBar";
import { Buildbar } from "./Header/buildBar";

export const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, userName } = useAuth();

  return (
    <header className="w-full h-14  flex items-center justify-center">
      <Bahion />
      {!pathname?.startsWith("/build") && <Navbar />}
      {pathname?.startsWith("/build") && <Buildbar />}
      <div className="h-full w-1/3 justify-end items-center flex gap-4">
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
