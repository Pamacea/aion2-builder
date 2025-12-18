"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SphereButton = () => {
  const pathname = usePathname();

  return (
    <Link
      href={`/build/${pathname.split("/")[2]}/sphere`}
      className={cn(
        "h-full justify-start items-center flex px-2 sm:px-4 md:px-6",
        pathname.endsWith("/sphere") 
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-primary/80"
          : "border-b-2 border-b-secondary hover:border-b-2 hover:border-b-foreground/50"
      )}
    >
      <Image
        src="/icons/IC_Builder_Sphere.webp"
        alt="Class Logo"
        width={40}
        height={32}
        className="w-6 h-6 md:w-8 md:h-8"
      />
    </Link>
  );
};
