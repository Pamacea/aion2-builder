"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProfileButton = () => {
  const pathname = usePathname();

  return (
    <Link
      href="/build/profile"
      className={cn(
        "h-full justify-start items-center flex px-6",
        pathname.startsWith("/build/profile") 
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-foreground/50"
          : "border-b-2 border-b-background/25 hover:border-b-2 hover:border-b-foreground"
      )}
    >
      <Image
        src="/icons/profile-logo.webp"
        alt="Profile Logo"
        width={24}
        height={24}
      />
    </Link>
  );
};
