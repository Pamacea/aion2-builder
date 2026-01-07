import { z } from "zod";

// ========================================
// API Response Schemas
// ========================================

export const ApiResponseSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  count: z.number().optional(),
});

export const ApiResponseErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type ApiResponseSuccess<T = unknown> = {
  success: true;
  data: T;
  count?: number;
};

export type ApiResponseError = {
  success: false;
  error: string;
};

export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;

// ========================================
// Query Parameter Schemas
// ========================================

export const BuildQuerySchema = z.object({
  classId: z.coerce.number().optional(),
  userId: z.string().optional(),
  private: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export type BuildQuery = z.infer<typeof BuildQuerySchema>;

// ========================================
// Request Body Schemas
// ========================================

export const CreateBuildSchema = z.object({
  name: z.string().min(1).max(255),
  classId: z.number(),
  baseSP: z.number().default(231),
  extraSP: z.number().default(0),
  baseSTP: z.number().default(40),
  extraSTP: z.number().default(0),
  private: z.boolean().default(true),
  abilities: z.array(z.object({
    abilityId: z.number(),
    level: z.number(),
    activeSpecialtyChoiceIds: z.array(z.number()).default([]),
    selectedChainSkillIds: z.array(z.number()).default([]),
  })).optional(),
  passives: z.array(z.object({
    passiveId: z.number(),
    level: z.number(),
  })).optional(),
  stigmas: z.array(z.object({
    stigmaId: z.number(),
    level: z.number(),
    stigmaCost: z.number(),
    activeSpecialtyChoiceIds: z.array(z.number()).default([]),
    selectedChainSkillIds: z.array(z.number()).default([]),
  })).optional(),
  shortcuts: z.record(z.string(), z.object({
    type: z.enum(["ability", "stigma"]),
    abilityId: z.number().optional(),
    stigmaId: z.number().optional(),
  })).optional(),
  shortcutLabels: z.record(z.string(), z.string()).optional(),
});

export type CreateBuildBody = z.infer<typeof CreateBuildSchema>;

export const UpdateBuildSchema = CreateBuildSchema.partial().extend({
  name: z.string().min(1).max(255).optional(),
});

export type UpdateBuildBody = z.infer<typeof UpdateBuildSchema>;

export const DaevanionSchema = z.object({
  nezekan: z.array(z.number()).default([]),
  zikel: z.array(z.number()).default([]),
  vaizel: z.array(z.number()).default([]),
  triniel: z.array(z.number()).default([]),
  ariel: z.array(z.number()).default([]),
  azphel: z.array(z.number()).default([]),
});

export type DaevanionBody = z.infer<typeof DaevanionSchema>;
