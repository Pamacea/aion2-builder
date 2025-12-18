"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProfileButtons = () => {
  const pathname = usePathname();
  const buildId = pathname.split("/")[2];

  return (
    <div className="flex items-center justify-start w-1/2 gap-4">
      {/* Bouton Compétences/Skills */}
      <Link
        href={`/build/${buildId}/skill`}
        className={cn(
          "h-full justify-center items-center gap-4 flex px-6 py-2  transition-colors bg-background/50 font-bold",
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
        />
        SKILL
      </Link>

      {/* Bouton Équipement/Gear */}
      <Link
        href={`/build/${buildId}/gear`}
        className={cn(
          "h-full justify-center items-center gap-4 flex px-6 py-2 transition-colors bg-background/50  font-bold",
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
        />
        GEAR
      </Link>

      {/* Bouton Daevanion/Sphere */}
      <Link
        href={`/build/${buildId}/sphere`}
        className={cn(
          "h-full justify-center items-center gap-4 flex px-6 py-2 transition-colors bg-background/50 font-bold",
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
        />
        DAEVANION
      </Link>
    </div>
  );
};
