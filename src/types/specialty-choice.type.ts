import { z } from "zod";
import type { AbilityType } from "./ability.type";
import type { StigmaType } from "./stigma.type";

// ---------------------------
// SpecialtyChoice Schema Base
// ---------------------------
export const SpecialtyChoiceSchemaBase = z.object({
  id: z.number(),
  description: z.string(),
  unlockLevel: z.number(),
  abilityId: z.number().nullish(),
  stigmaId: z.number().nullish(),
});
export type SpecialtyChoiceTypeBase = z.infer<typeof SpecialtyChoiceSchemaBase>;

// ---------------------------
// SpecialtyChoice Type (with relations)
// ---------------------------
export type SpecialtyChoiceType = SpecialtyChoiceTypeBase & {
  ability?: AbilityType;
  stigma?: StigmaType;
};

