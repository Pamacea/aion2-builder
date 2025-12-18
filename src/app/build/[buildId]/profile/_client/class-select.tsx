"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuildStore } from "@/store/useBuildEditor";
import { canEditBuild, isStarterBuild } from "@/utils/buildUtils";
import { memo, useCallback, useMemo } from "react";
import { StarterBuildMessage } from "../_components/starterBuildMessage";
import { CLASSES } from "../_utils/constants";

export const ClassSelect = memo(() => {
  const { build, setClassByName, currentUserId } = useBuildStore();

  // Mémoriser les valeurs calculées
  const isStarter = useMemo(() => build ? isStarterBuild(build) : false, [build]);
  const canEdit = useMemo(() => build ? canEditBuild(build, currentUserId) : false, [build, currentUserId]);
  const isDisabled = useMemo(() => isStarter || !canEdit, [isStarter, canEdit]);
  const currentClassName = useMemo(() => build?.class.name || "", [build?.class.name]);

  // Mémoriser le handler pour éviter les re-renders
  const handleClassChange = useCallback((className: string) => {
    setClassByName(className);
  }, [setClassByName]);

  // Mémoriser les items de classe
  const classItems = useMemo(() => 
    CLASSES.map((cls) => (
      <SelectItem key={cls} value={cls}>
        {cls.charAt(0).toUpperCase() + cls.slice(1)}
      </SelectItem>
    )),
    []
  );

  if (!build) return null;

  return (
    <section className="w-full md:w-1/2 md:max-w-1/2 flex flex-col items-center md:items-start justify-center gap-3 sm:gap-4">
      <h2 className="uppercase font-bold text-base sm:text-lg md:text-xl text-ring">BUILD CLASS</h2>
      <Select
        value={currentClassName}
        onValueChange={handleClassChange}
        disabled={isDisabled}
      >
        <SelectTrigger className="border-b-2 border-secondary uppercase w-full text-xl sm:text-2xl md:text-3xl disabled:opacity-50 disabled:cursor-not-allowed [&>span[data-slot='select-value']]:md:text-left [&>span[data-slot='select-value']]:text-center [&>span[data-slot='select-value']]:w-full">
          <SelectValue placeholder="Select a class" className="text-center md:text-left" />
        </SelectTrigger>
        <SelectContent className="uppercase">
          {classItems}
        </SelectContent>
      </Select>
      {isStarter && <StarterBuildMessage />}
    </section>
  );
});

ClassSelect.displayName = "ClassSelect";
