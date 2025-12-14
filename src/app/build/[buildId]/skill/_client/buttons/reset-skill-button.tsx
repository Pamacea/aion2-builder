"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useEffect } from "react";
import { useSelectedSkill } from "../../_context/SelectedSkillContext";
import { IconButton } from "../../_utils/iconButton";

type ResetSkillButtonProps = {
  disabled?: boolean;
};

export const ResetSkillButton = ({ disabled = false }: ResetSkillButtonProps) => {
  const { selectedSkill, setSelectedSkill } = useSelectedSkill();
  const { updateAbilityLevel, updatePassiveLevel, updateStigmaLevel, build } = useBuildStore();

  // Sync selected skill with build updates (especially after reset)
  useEffect(() => {
    if (!build || !selectedSkill) return;

    if (selectedSkill.buildAbility) {
      const abilityId = selectedSkill.buildAbility.abilityId;
      const updated = build.abilities?.find((a) => a.abilityId === abilityId);
      if (updated) {
        setSelectedSkill({ buildAbility: updated });
      }
    } else if (selectedSkill.buildPassive) {
      const passiveId = selectedSkill.buildPassive.passiveId;
      const updated = build.passives?.find((p) => p.passiveId === passiveId);
      if (updated) {
        setSelectedSkill({ buildPassive: updated });
      }
    } else if (selectedSkill.buildStigma) {
      const stigmaId = selectedSkill.buildStigma.stigmaId;
      const updated = build.stigmas?.find((s) => s.stigmaId === stigmaId);
      if (updated) {
        setSelectedSkill({ buildStigma: updated });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build?.abilities, build?.passives, build?.stigmas]);

  const handleReset = () => {
    if (!selectedSkill || disabled) return;

    if (selectedSkill.buildAbility) {
      const abilityId = selectedSkill.buildAbility.abilityId;
      // Reset to level 0 (minimum level) - this will automatically filter specialtyChoices
      updateAbilityLevel(abilityId, 0);
    } else if (selectedSkill.buildPassive) {
      const passiveId = selectedSkill.buildPassive.passiveId;
      updatePassiveLevel(passiveId, 0);
    } else if (selectedSkill.buildStigma) {
      const stigmaId = selectedSkill.buildStigma.stigmaId;
      updateStigmaLevel(stigmaId, 0);
    }
  };

  const hasSelectedSkill = !!selectedSkill;

  return (
    <IconButton
      icon="/icons/reset-logo.webp"
      alt="Reset Icon"
      onClick={handleReset}
      disabled={!hasSelectedSkill || disabled}
      className="h-full bg-background/80 border-y-2 border-foreground/50 hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      iconSize={25}
    />
  );
};