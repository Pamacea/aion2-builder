import { z } from "zod";
import type { ClassType } from "./class.type";

// ---------------------------
// Tag Schema Base
// ---------------------------
export const TagSchemaBase = z.object({
  id: z.number(),
  name: z.string(),
});
export type TagTypeBase = z.infer<typeof TagSchemaBase>;

// ---------------------------
// Tag Type (with relations)
// ---------------------------
export type TagType = TagTypeBase & {
  classes?: ClassType[];
};

