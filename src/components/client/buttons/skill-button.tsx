"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SkillButton = () => {
  const pathname = usePathname();

  return (
    <Link
      href={`/build/${pathname.split("/")[2]}/skill`}
      className={cn(
        "h-full justify-start items-center flex px-2 sm:px-4 md:px-6",
        pathname.endsWith("/skill")
          ? "border-b-2 border-b-foreground hover:border-b-2 hover:border-b-primary/80"
          : "border-b-2 border-b-secondary hover:border-b-2 hover:border-b-foreground/50"
      )}
      aria-label="Build skills"
      aria-current={pathname.endsWith("/skill") ? "page" : undefined}
    >
      <Image
        src="/icons/IC_Builder_Skill.webp"
        alt=""
        width={32}
        height={32}
        className="w-6 h-6 md:w-8 md:h-8"
        aria-hidden="true"
      />
    </Link>
  );
};
