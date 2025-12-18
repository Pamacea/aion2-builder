"use client";

import { Button } from "@/components/ui/button";
import { useBuildStore } from "@/store/useBuildEditor";
import { canEditBuild } from "@/utils/buildUtils";

export const SkillLevelModifier = () => {
  const { build, currentUserId, updateAbilityLevel, updatePassiveLevel, updateStigmaLevel } =
    useBuildStore();
  const canEdit = canEditBuild(build, currentUserId);

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

  if (!build || !canEdit) return null;

  const hasAbilities = build.abilities && build.abilities.length > 0;
  const hasPassives = build.passives && build.passives.length > 0;
  const hasStigmas = build.stigmas && build.stigmas.some((s) => s.level > 1);

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2 py-1 sm:py-2">
      <Button
        onClick={handleSetAllAbilitiesTo10}
        disabled={!hasAbilities}
        className="w-full sm:w-1/3 text-[10px] xs:text-xs sm:text-sm bg-blue-600/10 text-blue-400 border-y-2 border-secondary text-center hover:border-primary font-bold uppercase px-1.5 sm:px-2 py-1 sm:py-1.5 md:py-2 hover:bg-blue-600/50 hover:text-blue-400 whitespace-nowrap"
      >
        <span className="hidden xs:inline">RANK ACTIVE TO 10</span>
        <span className="xs:hidden">ACTIVE 10</span>
      </Button>
      <Button
        onClick={handleSetAllPassivesTo10}
        disabled={!hasPassives}
        className="w-full sm:w-1/3 text-[10px] xs:text-xs sm:text-sm bg-green-600/10 text-green-400 border-y-2 border-secondary text-center hover:border-primary font-bold uppercase px-1.5 sm:px-2 py-1 sm:py-1.5 md:py-2 hover:bg-green-600/50 hover:text-green-400 whitespace-nowrap"
      >
        <span className="hidden xs:inline">RANK PASSIVE TO 10</span>
        <span className="xs:hidden">PASSIVE 10</span>
      </Button>
      <Button
        onClick={handleSetAllStigmasTo10}
        disabled={!hasStigmas}
        className="w-full sm:w-1/3 text-[10px] xs:text-xs sm:text-sm bg-purple-600/10 text-purple-400 border-y-2 border-secondary text-center hover:border-primary font-bold uppercase px-1.5 sm:px-2 py-1 sm:py-1.5 md:py-2 hover:bg-purple-600/50 hover:text-purple-400 whitespace-nowrap"
      >
        <span className="hidden xs:inline">RANK STIGMA TO 10</span>
        <span className="xs:hidden">STIGMA 10</span>
      </Button>
    </div>
  );
};
