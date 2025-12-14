"use client";

import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/store/useBuildEditor";

export const SkillLevelModifier = () => {
  const { build, updateAbilityLevel, updatePassiveLevel, updateStigmaLevel } = useBuildStore();

  const handleSetAllAbilitiesTo10 = () => {
    if (!build?.abilities) return;
    
    build.abilities.forEach((buildAbility) => {
      if (buildAbility.level !== 10) {
        updateAbilityLevel(buildAbility.abilityId, 10);
      }
    });
  };

  const handleSetAllPassivesTo10 = () => {
    if (!build?.passives) return;
    
    build.passives.forEach((buildPassive) => {
      if (buildPassive.level !== 10) {
        updatePassiveLevel(buildPassive.passiveId, 10);
      }
    });
  };

  const handleSetAllStigmasTo10 = () => {
    if (!build?.stigmas) return;
    
    build.stigmas.forEach((buildStigma) => {
      // Only update stigmas that are > level 1
      if (buildStigma.level > 1 && buildStigma.level !== 10) {
        updateStigmaLevel(buildStigma.stigmaId, 10);
      }
    });
  };

  if (!build) return null;

  const hasAbilities = build.abilities && build.abilities.length > 0;
  const hasPassives = build.passives && build.passives.length > 0;
  const hasStigmas = build.stigmas && build.stigmas.some((s) => s.level > 1);

  return (
    <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-2 py-2">
      <Button
        onClick={handleSetAllAbilitiesTo10}
        disabled={!hasAbilities}
        className="w-full xl:w-1/3  text-xs bg-blue-600/30 text-blue-400 border-y-2 border-foreground/50 text-center font-bold uppercase px-2 py-2 hover:bg-blue-600/50 hover:text-blue-400²"
      >
        RANK ACTIVE TO 10
      </Button>
      <Button
        onClick={handleSetAllPassivesTo10}
        disabled={!hasPassives}
       className="w-full xl:w-1/3 text-xs bg-green-600/30 text-green-400 border-y-2 border-foreground/50 text-center font-bold uppercase px-2 py-2 hover:bg-green-600/50 hover:text-green-400"
      >
        RANK PASSIVE TO 10
      </Button>
      <Button
        onClick={handleSetAllStigmasTo10}
        disabled={!hasStigmas}
        className="w-full xl:w-1/3 text-xs bg-purple-600/30 text-purple-400 border-y-2 border-foreground/50 text-center font-bold uppercase px-2 py-2  hover:bg-purple-600/50 hover:text-purple-400"
      >
        RANK STIGMA TO 10
      </Button>
    </div>
  );
};

