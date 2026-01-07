import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildListingInclude } from "@/utils/actionsUtils";
import { BuildSchema } from "@/types/schema";
import { apiError, apiSuccess, handleApiError, validateRequest } from "@/lib/api-utils";
import { BuildQuerySchema, CreateBuildSchema } from "@/types/api.schema";

// ========================================
// GET /api/v1/builds
// List builds with filtering and pagination
// ========================================

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryValidation = validateRequest(
      BuildQuerySchema,
      Object.fromEntries(searchParams)
    );

    if (!queryValidation.success) {
      return queryValidation.error;
    }

    const { classId, userId, private: isPrivate, limit, offset } = queryValidation.data;

    // Build where clause
    const where: {
      classId?: number;
      userId?: string;
      private?: boolean;
    } = {};

    if (classId) where.classId = classId;
    if (userId) where.userId = userId;
    if (isPrivate !== undefined) where.private = isPrivate;

    // Fetch builds with count
    const [builds, total] = await Promise.all([
      prisma.build.findMany({
        where,
        include: buildListingInclude,
        orderBy: { id: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.build.count({ where }),
    ]);

    // Validate and return builds
    const validatedBuilds = builds.map((build) => BuildSchema.parse(build));

    return apiSuccess(validatedBuilds, 200, total);
  } catch (error) {
    return handleApiError(error);
  }
}

// ========================================
// POST /api/v1/builds
// Create a new build
// ========================================

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(CreateBuildSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const buildData = validation.data;

    // Check authentication
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return apiError("You must be authenticated to create a build", 401);
    }

    // Create build with relations
    const newBuild = await prisma.build.create({
      data: {
        name: buildData.name,
        classId: buildData.classId,
        userId: session.user.id,
        baseSP: buildData.baseSP,
        extraSP: buildData.extraSP,
        baseSTP: buildData.baseSTP,
        extraSTP: buildData.extraSTP,
        private: buildData.private,
        shortcuts: buildData.shortcuts as any,
        abilities: buildData.abilities
          ? {
              create: buildData.abilities.map((a) => ({
                abilityId: a.abilityId,
                level: a.level,
                activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds,
                selectedChainSkillIds: a.selectedChainSkillIds,
              })),
            }
          : undefined,
        passives: buildData.passives
          ? {
              create: buildData.passives.map((p) => ({
                passiveId: p.passiveId,
                level: p.level,
              })),
            }
          : undefined,
        stigmas: buildData.stigmas
          ? {
              create: buildData.stigmas.map((s) => ({
                stigmaId: s.stigmaId,
                level: s.level,
                stigmaCost: s.stigmaCost,
                activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds,
                selectedChainSkillIds: s.selectedChainSkillIds,
              })),
            }
          : undefined,
      },
      include: buildListingInclude,
    });

    // Validate and return build
    const validatedBuild = BuildSchema.parse(newBuild);

    return apiSuccess(validatedBuild, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
