"use client";

import { BANNER_PATH, CLASS_PATH } from "@/constants/paths";
import { ClassType } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

type ClassCardProps = {
  classData: ClassType;
};

export const ClassCard = memo(({ classData }: ClassCardProps) => {
  // Mémoriser l'URL de l'icône pour éviter les recalculs
  const iconUrl = useMemo(() => {
    if (classData.iconUrl?.startsWith("IC_")) {
      return `${CLASS_PATH}${classData.iconUrl}`;
    }
    return `${CLASS_PATH}IC_Class_${classData.name.charAt(0).toUpperCase() + classData.name.slice(1)}.webp`;
  }, [classData.iconUrl, classData.name]);

  const classUrl = useMemo(() => 
    `/classes/${classData.name.toLowerCase()}`,
    [classData.name]
  );

  const bannerUrl = useMemo(() => {
    const banner = classData.bannerUrl || `BA_${classData.name.charAt(0).toUpperCase() + classData.name.slice(1)}.webp`;
    return banner.startsWith("BA_")
      ? `${BANNER_PATH}${banner}`
      : `${BANNER_PATH}BA_${classData.name.charAt(0).toUpperCase() + classData.name.slice(1)}.webp`;
  }, [classData.bannerUrl, classData.name]);

  return (
    <Link href={classUrl} prefetch={true} suppressHydrationWarning>
      <div className="relative bg-secondary h-96 w-64 flex flex-col border-x-2 border-primary hover:border-primary hover:scale-105 transition-transform cursor-pointer overflow-hidden">
        {/* Banner en arrière-plan */}
        <div className="absolute inset-0">
          <Image
            src={bannerUrl}
            alt={`${classData.name} banner`}
            fill
            className="object-cover"
            sizes="1024px"
          />
          {/* Overlay sombre pour assombrir */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        {/* Contenu en bas */}
        <div className="relative z-10 mt-auto p-6 flex flex-col items-center justify-end gap-3">
          <Image
            src={iconUrl}
            alt={`${classData.name} icon`}
            width={96}
            height={96}
            className="rounded-md"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <h2 className="uppercase font-extrabold text-2xl text-center font-cinzel">
            {classData.name}
          </h2>
          <p className="text-center text-sm font-light">
            {classData.description}
          </p>
        </div>
      </div>
    </Link>
  );
});

ClassCard.displayName = "ClassCard";
