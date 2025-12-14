"use client";

import { CLASS_PATH } from "@/constants/paths";
import { BuildType } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import { CreateBuildBase } from "./create-build-base";
import { ShowBuildButton } from "./show-build-button";

type BuildCardProps = {
  build: BuildType;
};

export const BuildCard = ({ build }: BuildCardProps) => {
  const bannerUrl = build.class?.bannerUrl || "default-banner.webp";

  return (
    <div className="relative group overflow-hidden  border-y-2 border-foreground/30 hover:border-primary transition-all">
      {/* Banner Background */}
      <div className="relative h-48 w-full">
        <Image
          src={`${CLASS_PATH}${bannerUrl.toLowerCase()}`}
          alt={`${build.class?.name} banner`}
          fill
          className="object-cover scale-125 opacity-60 group-hover:opacity-80 transition-opacity"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4  backdrop-blur-sm">
        <Link href={`/build/${build.id}/profile`}>
          <h3 className="text-lg font-bold text-foreground mb-2 truncate hover:text-primary transition-colors cursor-pointer">
            {build.name}
          </h3>
        </Link>
        <p className="text-sm text-foreground/70 mb-3 uppercase">{build.class?.name}</p>
        <div className="flex gap-2">
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <ShowBuildButton buildId={build.id} />
          </div>
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <CreateBuildBase buildId={build.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
