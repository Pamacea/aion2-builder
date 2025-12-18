"use client";

import { ClassImage } from "@/app/classes/[slug]/_components/classImage";
import { memo, useMemo } from "react";

export const ProfilelassBanner = memo(({
  classBanner,
}: {
  classBanner: string | null;
}) => {
  // Mémoriser l'alt text
  const altText = useMemo(() => `${classBanner} banner`, [classBanner]);

  if (!classBanner) return null;
  
  return (
    <section className="w-full sm:w-1/2 h-72 bg-secondary flex items-center justify-center border-2 border-foreground/30">
      <ClassImage
        src={classBanner}
        alt={altText}
        className="rounded-md h-full w-full object-center object-cover"
      />
    </section>
  );
});

ProfilelassBanner.displayName = "ProfilelassBanner";
