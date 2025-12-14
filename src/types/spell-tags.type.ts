import { z } from "zod";
import type { AbilityType } from "./ability.type";
import type { PassiveType } from "./passive.type";
import type { StigmaType } from "./stigma.type";

// ---------------------------
// SpellTag Schema Base
// ---------------------------
export const SpellTagSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
});
export type SpellTagTypeBase = z.infer<typeof SpellTagSchemaBase>;

// ---------------------------
// SpellTag Type (with relations)
// ---------------------------
export type SpellTagType = SpellTagTypeBase & {
  abilities?: AbilityType[];
  passives?: PassiveType[];
  stigmas?: StigmaType[];
};

