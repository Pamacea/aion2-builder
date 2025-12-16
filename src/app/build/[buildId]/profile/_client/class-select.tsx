"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuildStore } from "@/store/useBuildEditor";
import { isBuildOwner, isStarterBuild } from "@/utils/buildUtils";
import { memo, useCallback, useMemo } from "react";
import { StarterBuildMessage } from "../_components/starterBuildMessage";
import { CLASSES } from "../_utils/constants";

export const ClassSelect = memo(() => {
  const { build, setClassByName, currentUserId } = useBuildStore();

  // Mémoriser les valeurs calculées
  const isStarter = useMemo(() => build ? isStarterBuild(build) : false, [build]);
  const isOwner = useMemo(() => build ? isBuildOwner(build, currentUserId) : false, [build, currentUserId]);
  const isDisabled = useMemo(() => isStarter || !isOwner, [isStarter, isOwner]);
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
    <section className="w-full flex flex-col items-start justify-start gap-4">
      <h2 className="uppercase font-bold text-xl text-ring">BUILD CLASS</h2>
      <Select
        value={currentClassName}
        onValueChange={handleClassChange}
        disabled={isDisabled}
      >
        <SelectTrigger className="uppercase w-full text-3xl disabled:opacity-50 disabled:cursor-not-allowed">
          <SelectValue placeholder="Select a class" />
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
