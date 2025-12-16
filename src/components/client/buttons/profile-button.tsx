"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProfileButton = () => {
  const pathname = usePathname();
  return (
    <Link
      href={`/build/${pathname.split("/")[2]}/profile`}
      className={cn(
        "h-full justify-start items-center flex px-6",
        pathname.endsWith("/profile") 
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-foreground/50"
          : "border-b-2 border-b-background/25 hover:border-b-2 hover:border-b-foreground"
      )}
    >
      <Image
        src="/icons/IC_Builder_Profile.webp"
        alt="Profile Logo"
        width={24}
        height={24}
      />
    </Link>
  );
};
