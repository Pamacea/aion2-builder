"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShareButton } from "./client/buttons";
import { AuthButton } from "./client/buttons/auth-button";
import { Bahion } from "./Header/Bahion";
import { Buildbar } from "./Header/buildBar";
import { Navbar } from "./Header/navBar";

export const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Récupérer le nom d'utilisateur depuis la session
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated === true) {
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then((data) => {
          const name = data?.user?.name || data?.user?.email || null;
          if (name !== userName) {
            setUserName(name);
          }
        })
        .catch(() => {
          if (userName !== null) {
            setUserName(null);
          }
        });
    }
    // Note: userName sera automatiquement null si isAuthenticated change à false
    // car le composant se re-rendra et userName sera réinitialisé
  }, [isAuthenticated, userName]);

  return (
    <header className="w-full h-14  flex items-center justify-center">
      <Bahion />
      {!pathname?.startsWith("/build") && <Navbar />}
      {pathname?.startsWith("/build") && <Buildbar />}
      <div className="h-full w-1/3 justify-end items-center flex gap-4">
        {pathname?.startsWith("/build") && <ShareButton />}
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
