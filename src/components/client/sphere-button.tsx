"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SphereButton = () => {
  const pathname = usePathname();

  return (
    <Link
      href="/build/sphere"
      className={cn(
        "h-full justify-start items-center flex px-6",
        pathname.startsWith("/build/sphere") 
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-foreground/50"
          : "border-b-2 border-b-background/25 hover:border-b-2 hover:border-b-foreground"
      )}
    >
      <Image
        src="/icons/spherier-logo.webp"
        alt="Class Logo"
        width={40}
        height={32}
      />
    </Link>
  );
};
