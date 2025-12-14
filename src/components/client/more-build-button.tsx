"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MoreBuildButton = () => {
  const pathname = usePathname();
  return (
    <Link
      href="/morebuild"
      className={cn(
        "h-full justify-start items-center flex px-6",
        pathname === "/morebuild"
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-foreground/50"
          : "border-b-2 border-b-background/25 hover:border-b-2 hover:border-b-foreground"
      )}
    >
      <Image
        src="/icons/home-logo.webp"
        alt="Bahion Logo"
        width={32}
        height={32}
      />
    </Link>
  );
};
