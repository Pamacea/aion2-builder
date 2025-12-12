"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuildStore } from "@/store/useBuildEditor";
import { isStarterBuild } from "@/utils/buildUtils";

export const ClassSelect = () => {
  const { build, setClassByName } = useBuildStore();
  const classes = ["gladiator","templar","ranger","assassin","chanter","sorcerer","elementalist","cleric"];

  if (!build) return null;

  const isStarter = isStarterBuild(build);

  return (
    <section className="w-full flex flex-col items-start justify-start gap-4">
      <h2 className="uppercase font-bold text-xl text-ring">BUILD CLASS</h2>
      <Select
        value={build.class.name}
        onValueChange={(className) => setClassByName(className)}
        disabled={isStarter}
      >
        <SelectTrigger className="uppercase w-full text-3xl disabled:opacity-50 disabled:cursor-not-allowed">
          <SelectValue placeholder="Select a class" />
        </SelectTrigger>
        <SelectContent className="uppercase">
          {classes.map((cls) => (
            <SelectItem key={cls} value={cls}>
              {cls.charAt(0).toUpperCase() + cls.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isStarter && (
        <p className="text-sm text-muted-foreground">
          Starter builds cannot be modified. Create a new build to customize.
        </p>
      )}
    </section>
  );
};
