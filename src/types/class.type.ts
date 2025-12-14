import { z } from "zod";
import type { AbilityType } from "./ability.type";
import type { BuildType } from "./build.type";
import type { PassiveType } from "./passive.type";
import type { StigmaType } from "./stigma.type";
import type { TagType } from "./tags.type";


// ======================================
// CLASS HELPER TYPE
// ======================================
export type ClassItem = { id: number; maxLevel?: number; baseCost?: number };


// ======================================
// CLASSES TYPE
// ======================================
export type ClassImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export type ClassButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  asButton?: boolean;
};

export type ClassGridProps = {
  classes: ClassType[];
};

// ---------------------------
// Class Schema Base
// ---------------------------
export const ClassSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  characterUrl: z.string().nullable(),
  description: z.string().nullable(),
});
export type ClassTypeBase = z.infer<typeof ClassSchemaBase>;

// ---------------------------
// Class Type (with relations)
// ---------------------------
export type ClassType = ClassTypeBase & {
  tags?: TagType[];
  abilities?: AbilityType[];
  passives?: PassiveType[];
  stigmas?: StigmaType[];
  builds?: BuildType[];
};

