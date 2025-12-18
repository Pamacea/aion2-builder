"use client";

import { CLASS_PATH } from "@/constants/paths";
import { ClassGridProps } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";

type ClassGridItemProps = {
  classData: ClassGridProps["classes"][number];
};

const ClassGridItem = memo(({ classData }: ClassGridItemProps) => {
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

  return (
    <Link href={classUrl} prefetch={true}>
      <div className=" border-x-2 border-secondary bg-secondary/25 hover:border-primary p-2 hover:bg-primary/10 h-36 w-40 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform cursor-pointer text-foreground/70 hover:text-foreground">
        <Image
          src={iconUrl}
          alt={`${classData.name} icon`}
          width={64}
          height={64}
          className="rounded-md"
          loading="lazy"
        />
        <h2 className="text-lg text-center uppercase font-medium">
          {classData.name}
        </h2>
      </div>
    </Link>
  );
});

ClassGridItem.displayName = "ClassGridItem";

export const ClassGrid = memo(({ classes }: ClassGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-8 justify-center">
      {classes.map((cls) => (
        <ClassGridItem key={cls.id} classData={cls} />
      ))}
    </div>
  );
});

ClassGrid.displayName = "ClassGrid";

