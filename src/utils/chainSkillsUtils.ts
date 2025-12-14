import { ChainSkillItem } from "@/types/chain-skill.type";

export const filterChainSkills = <T extends ChainSkillItem>(
    items: T[],
    getChainIds: (item: T) => number[]
  ): T[] => {
    const chainSkillIds = new Set<number>();
    items.forEach((item) => {
      getChainIds(item).forEach((id) => chainSkillIds.add(id));
    });
    return items.filter((item) => !chainSkillIds.has(item.id));
  };