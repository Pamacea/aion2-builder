"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProfileButtons = () => {
  const pathname = usePathname();
  const buildId = pathname.split("/")[2];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2 sm:gap-2 md:gap-4">
      {/* Bouton Compétences/Skills */}
      <Link
        href={`/build/${buildId}/skill`}
        className={cn(
          "w-full sm:w-auto justify-center items-center gap-1 sm:gap-2 md:gap-4 flex px-4 sm:px-4 md:px-6 py-2 transition-colors bg-background/50 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap",
          pathname.endsWith("/skill")
           ? "border-y-2 border-y-foreground hover:border-b-foreground/50"
            : "border-y-2 border-y-foreground/25 hover:border-y-foreground"
        )}
      >
        <Image
          src="/icons/IC_Builder_Skill.webp"
          alt="Skill"
          width={18}
          height={18}
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-[18px] md:h-[18px]"
        />
        <span className="hidden sm:inline">SKILL</span>
      </Link>

      {/* Bouton Équipement/Gear */}
      <Link
        href={`/build/${buildId}/gear`}
        className={cn(
          "w-full sm:w-auto justify-center items-center gap-1 sm:gap-2 md:gap-4 flex px-4 sm:px-4 md:px-6 py-2 transition-colors bg-background/50 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap",
          pathname.endsWith("/gear")
             ? "border-y-2 border-y-foreground hover:border-b-foreground/50"
            : "border-y-2 border-y-foreground/25 hover:border-y-foreground"
        )}
      >
        <Image
          src="/icons/IC_Builder_Gear.webp"
          alt="Gear"
          width={18}
          height={18}
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-[18px] md:h-[18px]"
        />
        <span className="hidden sm:inline">GEAR</span>
      </Link>

      {/* Bouton Daevanion/Sphere */}
      <Link
        href={`/build/${buildId}/sphere`}
        className={cn(
          "w-full sm:w-auto justify-center items-center gap-1 sm:gap-2 md:gap-4 flex px-4 sm:px-4 md:px-6 py-2 transition-colors bg-background/50 font-bold text-xs sm:text-sm md:text-base whitespace-nowrap",
          pathname.endsWith("/sphere")
            ? "border-y-2 border-y-foreground hover:border-b-foreground/50"
            : "border-y-2 border-y-foreground/25 hover:border-y-foreground"
        )}
      >
        <Image
          src="/icons/IC_Builder_Sphere.webp"
          alt="Sphere"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
        />
        <span className="hidden sm:inline">DAEVANION</span>
      </Link>
    </div>
  );
};
