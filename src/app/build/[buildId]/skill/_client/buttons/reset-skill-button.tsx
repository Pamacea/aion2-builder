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
  const { updateAbilityLevel, updatePassiveLevel, updateStigmaLevel, build, updateShortcuts } = useBuildStore();

  // Get the first ability ID (auto-attack) - cannot be reset to level 0
  const firstAbilityId = build?.class?.abilities
    ?.sort((a, b) => a.id - b.id)[0]?.id;

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
      // First ability (auto-attack) cannot be reset to level 0, reset to level 1 instead
      if (abilityId === firstAbilityId) {
        updateAbilityLevel(abilityId, 1);
        // Don't remove first ability from shortcuts (it must stay in reserved slot)
      } else {
        // Reset to level 0 (minimum level) - this will automatically filter specialtyChoices
        updateAbilityLevel(abilityId, 0);
        // Remove from shortcuts
        removeSkillFromShortcuts("ability", abilityId);
      }
    } else if (selectedSkill.buildPassive) {
      const passiveId = selectedSkill.buildPassive.passiveId;
      updatePassiveLevel(passiveId, 0);
      // Remove from shortcuts
      removeSkillFromShortcuts("passive", passiveId);
    } else if (selectedSkill.buildStigma) {
      const stigmaId = selectedSkill.buildStigma.stigmaId;
      updateStigmaLevel(stigmaId, 0);
      // Remove from shortcuts
      removeSkillFromShortcuts("stigma", stigmaId);
    }
  };

  // Remove skill from shortcuts
  const removeSkillFromShortcuts = (type: "ability" | "passive" | "stigma", skillId: number) => {
    if (!build?.shortcuts) return;
    
    // Get the first ability ID (auto-attack) - cannot be removed from shortcuts
    const firstAbilityId = build?.class?.abilities
      ?.sort((a, b) => a.id - b.id)[0]?.id;
    
    // Don't remove first ability from shortcuts (it must stay in reserved slot)
    if (type === "ability" && skillId === firstAbilityId) {
      return;
    }
    
    const updatedShortcuts: Record<string, { type: "ability" | "stigma"; abilityId?: number; stigmaId?: number }> = {};
    
    Object.entries(build.shortcuts).forEach(([slotIdStr, shortcutData]) => {
      if (!shortcutData || typeof shortcutData !== "object") return;
      
      const shortcut = shortcutData as {
        type: "ability" | "stigma";
        abilityId?: number;
        stigmaId?: number;
      };
      
      // Keep shortcuts that don't match the skill being reset
      if (type === "ability" && shortcut.type === "ability" && shortcut.abilityId === skillId) {
        // Skip this shortcut (remove it)
        return;
      } else if (type === "stigma" && shortcut.type === "stigma" && shortcut.stigmaId === skillId) {
        // Skip this shortcut (remove it)
        return;
      } else {
        // Keep this shortcut
        updatedShortcuts[slotIdStr] = shortcut;
      }
    });
    
    updateShortcuts(Object.keys(updatedShortcuts).length > 0 ? updatedShortcuts : null);
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