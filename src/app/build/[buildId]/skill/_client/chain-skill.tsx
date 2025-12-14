"use client";

import { ABILITY_PATH } from "@/constants/paths";
import { useBuildStore } from "@/store/useBuildEditor";
import { AbilityType, BuildAbilityType, BuildStigmaType, StigmaType } from "@/types/schema";
import Image from "next/image";
import { useSelectedSkill } from "../_context/SelectedSkillContext";

type ChainSkillProps = {
  buildAbility?: BuildAbilityType;
  buildStigma?: BuildStigmaType;
  ability?: AbilityType;
  stigma?: StigmaType;
};

export const ChainSkill = ({
  buildAbility,
  buildStigma,
  ability,
  stigma,
}: ChainSkillProps) => {
  const { build, updateChainSkill } = useBuildStore();
  const { setSelectedSkill, selectedSkill } = useSelectedSkill();

  // Determine if we're working with ability or stigma
  const isAbility = !!ability || !!buildAbility;
  const targetAbility = buildAbility?.ability || ability;
  const targetStigma = buildStigma?.stigma || stigma;
  const selectedChainSkillIds = buildAbility?.selectedChainSkillIds || buildStigma?.selectedChainSkillIds || [];

  // Get available chain skills (extract from parentAbilities relation)
  // IMPORTANT: chainSkills = abilities where THIS ability is the chain skill
  //            parentAbilities = ChainSkills where THIS ability is the parent (what we want!)
  let availableChainSkills: (AbilityType | StigmaType)[] = [];
  
  if (isAbility && targetAbility) {
    // First try targetAbility.parentAbilities (from build.abilities[].ability)
    // parentAbilities contains ChainSkills where this ability is the parent
    if (targetAbility.parentAbilities && targetAbility.parentAbilities.length > 0) {
      availableChainSkills = targetAbility.parentAbilities.map((cs) => cs.chainAbility).filter(Boolean);
    } else {
      // Fallback: try to find the ability in class.abilities with parentAbilities
      const classAbility = build?.class?.abilities?.find((a) => a.id === targetAbility.id);
      if (classAbility?.parentAbilities && classAbility.parentAbilities.length > 0) {
        availableChainSkills = classAbility.parentAbilities.map((cs) => cs.chainAbility).filter(Boolean);
      } else {
        // Last resort: try to find by name in class.abilities
        const classAbilityByName = build?.class?.abilities?.find((a) => a.name === targetAbility.name);
        if (classAbilityByName?.parentAbilities && classAbilityByName.parentAbilities.length > 0) {
          availableChainSkills = classAbilityByName.parentAbilities.map((cs) => cs.chainAbility).filter(Boolean);
        }
      }
    }
  } else if (!isAbility && targetStigma) {
    // For stigmas - same logic
    if (targetStigma.parentStigmas && targetStigma.parentStigmas.length > 0) {
      availableChainSkills = targetStigma.parentStigmas.map((cs) => cs.chainStigma).filter(Boolean);
    } else {
      // Fallback: try to find the stigma in class.stigmas with parentStigmas
      const classStigma = build?.class?.stigmas?.find((s) => s.id === targetStigma.id);
      if (classStigma?.parentStigmas && classStigma.parentStigmas.length > 0) {
        availableChainSkills = classStigma.parentStigmas.map((cs) => cs.chainStigma).filter(Boolean);
      } else {
        // Last resort: try to find by name in class.stigmas
        const classStigmaByName = build?.class?.stigmas?.find((s) => s.name === targetStigma.name);
        if (classStigmaByName?.parentStigmas && classStigmaByName.parentStigmas.length > 0) {
          availableChainSkills = classStigmaByName.parentStigmas.map((cs) => cs.chainStigma).filter(Boolean);
        }
      }
    }
  }

  // Debug: log chain skills data
  if (process.env.NODE_ENV === 'development') {
    const classAbility = build?.class?.abilities?.find((a) => a.id === targetAbility?.id);
    const classAbilityByName = build?.class?.abilities?.find((a) => a.name === targetAbility?.name);
    console.log('ChainSkill Debug:', {
      isAbility,
      targetAbility: targetAbility?.name,
      targetAbilityId: targetAbility?.id,
      targetStigma: targetStigma?.name,
      parentAbilitiesRaw: isAbility ? targetAbility?.parentAbilities : targetStigma?.parentStigmas,
      classAbility: classAbility ? { 
        id: classAbility.id, 
        name: classAbility.name, 
        parentAbilities: classAbility.parentAbilities?.length || 0,
        parentAbilitiesData: classAbility.parentAbilities?.map(cs => ({ id: cs.id, chainAbilityName: cs.chainAbility?.name }))
      } : null,
      classAbilityByName: classAbilityByName ? { 
        id: classAbilityByName.id, 
        name: classAbilityByName.name, 
        parentAbilities: classAbilityByName.parentAbilities?.length || 0,
        parentAbilitiesData: classAbilityByName.parentAbilities?.map(cs => ({ id: cs.id, chainAbilityName: cs.chainAbility?.name }))
      } : null,
      classAbilitiesCount: build?.class?.abilities?.length || 0,
      availableChainSkills: availableChainSkills.map(cs => ({ id: cs.id, name: cs.name })),
      buildAbility: buildAbility ? { abilityId: buildAbility.abilityId, level: buildAbility.level } : null,
    });
  }

  // Get selected chain skills (for slots 1 and 2)
  const selectedChainSkills = availableChainSkills.filter((skill) =>
    selectedChainSkillIds.includes(skill.id)
  );

  // If no chain skills available, don't render
  if (availableChainSkills.length === 0) {
    // In development, show a message to help debug
    if (process.env.NODE_ENV === 'development' && (targetAbility || targetStigma)) {
      return (
        <div className="flex flex-col gap-2 p-2 border border-yellow-500/50 rounded bg-yellow-500/10">
          <h3 className="text-sm font-bold text-foreground uppercase">Chain Skill</h3>
          <p className="text-xs text-yellow-500">
            No chain skills found for {targetAbility?.name || targetStigma?.name}. 
            Make sure the seed has been run and the chain skills are in the database.
          </p>
        </div>
      );
    }
    return null;
  }

  // Get chain skills for display (show first available if slot is empty)
  const chainSkill1 = selectedChainSkills[0] || availableChainSkills[0];
  const chainSkill2 = selectedChainSkills[1] || (availableChainSkills.length > 1 ? availableChainSkills[1] : null);

  const handleChainSkillSelect = (chainSkill: AbilityType | StigmaType) => {
    // Select the chain skill to display its details
    // Try to find the buildAbility/buildStigma if the skill is in the build
    if (isAbility) {
      const chainSkillAbility = chainSkill as AbilityType;
      // Find if this ability is in the build
      const chainSkillBuildAbility = build?.abilities?.find(
        (ba) => ba.abilityId === chainSkillAbility.id
      );
      if (chainSkillBuildAbility) {
        // Skill is in build, use buildAbility
        setSelectedSkill({ buildAbility: chainSkillBuildAbility });
      } else {
        // Skill is not in build, use ability
        setSelectedSkill({ ability: chainSkillAbility });
      }
    } else {
      const chainSkillStigma = chainSkill as StigmaType;
      // Find if this stigma is in the build
      const chainSkillBuildStigma = build?.stigmas?.find(
        (bs) => bs.stigmaId === chainSkillStigma.id
      );
      if (chainSkillBuildStigma) {
        // Stigma is in build, use buildStigma
        setSelectedSkill({ buildStigma: chainSkillBuildStigma });
      } else {
        // Stigma is not in build, use stigma
        setSelectedSkill({ stigma: chainSkillStigma });
      }
    }
  };

  const handleChainSkillSlotClick = (chainSkillId: number, slotIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Select/deselect for slot
    if (isAbility && buildAbility) {
      const currentIds = [...selectedChainSkillIds];
      // If clicking on an already selected skill, deselect it
      if (currentIds.includes(chainSkillId)) {
        const newIds = currentIds.filter((id) => id !== chainSkillId);
        updateChainSkill(buildAbility.abilityId, newIds, "ability");
      } else {
        // If slot is already occupied, replace it
        if (currentIds[slotIndex] !== undefined) {
          currentIds[slotIndex] = chainSkillId;
        } else {
          // Add to the first available slot
          currentIds.push(chainSkillId);
        }
        // Remove duplicates and limit to 2 slots
        const uniqueIds = Array.from(new Set(currentIds)).slice(0, 2);
        updateChainSkill(buildAbility.abilityId, uniqueIds, "ability");
      }
    } else if (!isAbility && buildStigma) {
      const currentIds = [...selectedChainSkillIds];
      if (currentIds.includes(chainSkillId)) {
        const newIds = currentIds.filter((id) => id !== chainSkillId);
        updateChainSkill(buildStigma.stigmaId, newIds, "stigma");
      } else {
        if (currentIds[slotIndex] !== undefined) {
          currentIds[slotIndex] = chainSkillId;
        } else {
          currentIds.push(chainSkillId);
        }
        const uniqueIds = Array.from(new Set(currentIds)).slice(0, 2);
        updateChainSkill(buildStigma.stigmaId, uniqueIds, "stigma");
      }
    }
  };

  const getIconSrc = (skill: AbilityType | StigmaType) => {
    const className = isAbility
      ? (targetAbility?.class?.name || build?.class?.name)
      : (targetStigma?.classes?.[0]?.name || build?.class?.name);
    
    if (!className) return null;
    
    const iconUrl = skill.iconUrl || "default-icon.webp";
    const path = isAbility ? ABILITY_PATH : ABILITY_PATH; // Stigmas also use ability path
    
    return `${path}${className.toLowerCase()}/${iconUrl.toLowerCase()}`;
  };

  // Base skill (always slot 0)
  const baseSkill = isAbility ? targetAbility : targetStigma;
  const baseIconSrc = baseSkill ? getIconSrc(baseSkill) : null;

  // Check which skill is currently selected to add golden border
  // Compare by ID: check both ability.id and buildAbility.abilityId for abilities
  const selectedAbilityId = selectedSkill?.ability?.id || selectedSkill?.buildAbility?.abilityId;
  const selectedStigmaId = selectedSkill?.stigma?.id || selectedSkill?.buildStigma?.stigmaId;
  // Get the selected skill ID regardless of type (ability or stigma)
  const selectedSkillId = selectedAbilityId || selectedStigmaId;
  
  // Base skill is selected only if it matches the selected skill ID
  const isBaseSelected = baseSkill && baseSkill.id === selectedSkillId;
  // Chain skills are selected if they match the selected skill ID
  const isChainSkill1Selected = chainSkill1 && chainSkill1.id === selectedSkillId;
  const isChainSkill2Selected = chainSkill2 && chainSkill2.id === selectedSkillId;

  return (
    <div className="flex flex-col gap-2 border-t-2 border-background/40 pt-6">
      <h3 className="text-sm font-bold text-foreground uppercase">Chain Skill</h3>
      <div className="flex items-center gap-2">
        {/* Slot 0: Base Skill (always present) */}
        <div 
          className={`relative w-12 h-12 border-2 rounded flex items-center justify-center bg-background/60 cursor-pointer transition-all ${
            isBaseSelected 
              ? "border-yellow-500 shadow-lg shadow-yellow-500/50" 
              : "border-foreground/50 hover:border-primary"
          }`}
          onClick={() => {
            if (baseSkill) {
              // For base skill, prefer using buildAbility/buildStigma if available
              if (isAbility && buildAbility) {
                setSelectedSkill({ buildAbility });
              } else if (!isAbility && buildStigma) {
                setSelectedSkill({ buildStigma });
              } else {
                handleChainSkillSelect(baseSkill);
              }
            }
          }}
        >
          {baseIconSrc ? (
            <Image
              src={baseIconSrc}
              alt={baseSkill?.name || "Base skill"}
              width={40}
              height={40}
              className="object-contain"
            />
          ) : (
            <div className="text-xs text-foreground/50">?</div>
          )}
        </div>

        {/* Dashed line */}
        <div className="flex-1 h-0.5 border-t-2 border-dashed border-foreground/30" />

        {/* Slot 1: First Chain Skill */}
        <div
          className={`relative w-12 h-12 border-2 rounded flex items-center justify-center bg-background/60 cursor-pointer transition-all ${
            isChainSkill1Selected
              ? "border-yellow-500 shadow-lg shadow-yellow-500/50"
              : selectedChainSkillIds.includes(chainSkill1?.id || 0)
              ? "border-foreground/80 hover:border-primary"
              : "border-foreground/30 hover:border-foreground/50"
          }`}
          onClick={() => {
            if (chainSkill1) {
              // Left click: show details
              handleChainSkillSelect(chainSkill1);
            }
          }}
          onDoubleClick={(e) => {
            if (chainSkill1) {
              // Double click: select/deselect for slot
              handleChainSkillSlotClick(chainSkill1.id, 0, e);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            if (chainSkill1 && selectedChainSkillIds.includes(chainSkill1.id)) {
              // Right click to deselect
              handleChainSkillSlotClick(chainSkill1.id, 0, e);
            }
          }}
        >
          {chainSkill1 ? (
            <>
              {getIconSrc(chainSkill1) ? (
                <Image
                  src={getIconSrc(chainSkill1)!}
                  alt={chainSkill1.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div className="text-xs text-foreground/50">?</div>
              )}
            </>
          ) : (
            <div className="text-xs text-foreground/30">+</div>
          )}
        </div>

        {/* Dashed line */}
        <div className="flex-1 h-0.5 border-t-2 border-dashed border-foreground/30" />

        {/* Slot 2: Second Chain Skill */}
        <div
          className={`relative w-12 h-12 border-2 rounded flex items-center justify-center bg-background/60 cursor-pointer transition-all ${
            isChainSkill2Selected
              ? "border-yellow-500 shadow-lg shadow-yellow-500/50"
              : chainSkill2 && selectedChainSkillIds.includes(chainSkill2.id)
              ? "border-foreground/80 hover:border-primary"
              : chainSkill2
              ? "border-foreground/30 hover:border-foreground/50"
              : "border-foreground/20 opacity-50"
          }`}
          onClick={() => {
            if (chainSkill2) {
              // Left click: show details
              handleChainSkillSelect(chainSkill2);
            }
          }}
          onDoubleClick={(e) => {
            if (chainSkill2) {
              // Double click: select/deselect for slot
              handleChainSkillSlotClick(chainSkill2.id, 1, e);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            if (chainSkill2 && selectedChainSkillIds.includes(chainSkill2.id)) {
              // Right click to deselect
              handleChainSkillSlotClick(chainSkill2.id, 1, e);
            }
          }}
        >
          {chainSkill2 ? (
            <>
              {getIconSrc(chainSkill2) ? (
                <Image
                  src={getIconSrc(chainSkill2)!}
                  alt={chainSkill2.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <div className="text-xs text-foreground/50">?</div>
              )}
            </>
          ) : (
            <div className="text-xs text-foreground/30">+</div>
          )}
        </div>
      </div>
    </div>
  );
};

