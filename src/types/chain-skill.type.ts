export type ChainSkillItem = { 
    id: number; 
    parentAbilities?: Array<{ chainAbility: { id: number } }>; 
    parentStigmas?: Array<{ chainStigma: { id: number } }> 
  };