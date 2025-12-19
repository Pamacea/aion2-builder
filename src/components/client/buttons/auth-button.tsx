"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type AuthButtonProps = {
  isAuthenticated: boolean;
  userName?: string | null;
  compact?: boolean; // Pour le style compact dans le Header
};

export const AuthButton = ({
  isAuthenticated,
  userName,
  compact = false,
}: AuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignIn = () => {
    setIsLoading(true);
    // Récupérer l'URL actuelle pour rediriger après connexion
    const callbackUrl = encodeURIComponent(pathname || "/");
    window.location.href = `/api/auth/signin/discord?callbackUrl=${callbackUrl}`;
  };

  const handleSignOut = () => {
    setIsLoading(true);
    // Récupérer l'URL actuelle pour rediriger après déconnexion
    const callbackUrl = encodeURIComponent(pathname || "/");
    window.location.href = `/api/auth/signout?callbackUrl=${callbackUrl}`;
  };

  const handleProfileClick = () => {
    router.push("/myprofile");
  };

  // Style compact pour le Header
  if (compact) {
    if (isAuthenticated) {
      const isMyProfile = pathname === "/myprofile";
      return (
        <div className={`h-full flex items-center hover:border-b-2 hover:border-b-primary border-b-2 ${
          isMyProfile ? "border-b-foreground" : "border-b-secondary"
        }`}>
          {userName && (
            <Button
              onClick={handleProfileClick}
              className="h-full text-xs sm:text-sm md:text-md text-foreground uppercase font-semibold px-2 sm:px-4 md:px-8 hover:bg-secondary transition-all duration-300 whitespace-nowrap"
              title="Mon profil"
            >
              <span className="hidden sm:inline">{userName}</span>
              <span className="sm:hidden">{userName?.charAt(0).toUpperCase()}</span>
            </Button>
          )}
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            className="h-full bg-destructive/50 hover:bg-destructive/90 transition-all duration-300 px-2 sm:px-4 md:px-6"
            title="Déconnexion"
          >
            <LogOut className="size-4 sm:size-5" />
          </Button>
        </div>
      );
    }

    return (
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        className="h-full justify-center items-center flex px-2 sm:px-4 md:px-8 hover:border-b-2 hover:border-b-primary border-b-2 border-b-secondary"
        title="Connexion Discord"
      >
        <svg
          className="size-4 sm:size-5 md:size-6"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </Button>
    );
  }

  // Style original pour AuthSession (en bas à gauche)
  if (isAuthenticated) {
    return (
      <div
        className="flex items-center pr-2 gap-2 bg-background/50 border-y-2 border-foreground/50 hover:bg-background/70 hover:border-foreground/70 transition-all duration-300"
        suppressHydrationWarning
      >
        <Button
          onClick={handleSignOut}
          disabled={isLoading}
          className="gap-2 bg-destructive/50  hover:bg-destructive/70 transition-all duration-300"
          suppressHydrationWarning
        >
          <LogOut className="size-4" />
        </Button>
        {userName && (
          <span className="text-sm text-foreground/80 uppercase font-semibold px-2">
            {userName}
          </span>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full h-full bg-background/50 border-y-2 border-foreground/50 hover:bg-background/70 hover:border-foreground/70 transition-all duration-300"
    >
      <svg
        className="size-6 opacity-70 hover:opacity-100 hover:text-white transition-all duration-300"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    </Button>
  );
};
