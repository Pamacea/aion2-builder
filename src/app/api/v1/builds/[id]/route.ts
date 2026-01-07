import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fullBuildInclude } from "@/utils/actionsUtils";
import { BuildSchema } from "@/types/schema";
import { apiError, apiSuccess, handleApiError, requireBuildOwnership, validateRequest } from "@/lib/api-utils";
import { UpdateBuildSchema } from "@/types/api.schema";
import { revalidateTag, revalidatePath } from "next/cache";

// ========================================
// GET /api/v1/builds/[id]
// Get a single build by ID
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const buildId = parseInt(id, 10);

    if (isNaN(buildId)) {
      return apiError("Invalid build ID", 400);
    }

    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: fullBuildInclude,
    });

    if (!build) {
      return apiError("Build not found", 404);
    }

    const validatedBuild = BuildSchema.parse(build);

    return apiSuccess(validatedBuild);
  } catch (error) {
    return handleApiError(error);
  }
}

// ========================================
// PUT /api/v1/builds/[id]
// Update a build
// ========================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const buildId = parseInt(id, 10);

    if (isNaN(buildId)) {
      return apiError("Invalid build ID", 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(UpdateBuildSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const buildData = validation.data;

    // Check ownership
    await requireBuildOwnership(buildId);

    // Build update data - use Prisma's type system directly
    const updateData: any = {};

    if (buildData.name !== undefined) updateData.name = buildData.name;
    if (buildData.classId !== undefined) updateData.classId = buildData.classId;
    if (buildData.baseSP !== undefined) updateData.baseSP = buildData.baseSP;
    if (buildData.extraSP !== undefined) updateData.extraSP = buildData.extraSP;
    if (buildData.baseSTP !== undefined) updateData.baseSTP = buildData.baseSTP;
    if (buildData.extraSTP !== undefined) updateData.extraSTP = buildData.extraSTP;
    if (buildData.private !== undefined) updateData.private = buildData.private;
    if (buildData.shortcuts !== undefined) updateData.shortcuts = buildData.shortcuts;

    if (buildData.abilities !== undefined) {
      updateData.abilities = {
        deleteMany: { buildId },
        create: buildData.abilities.map((a) => ({
          abilityId: a.abilityId,
          level: a.level,
          activeSpecialtyChoiceIds: a.activeSpecialtyChoiceIds,
          selectedChainSkillIds: a.selectedChainSkillIds,
        })),
      };
    }

    if (buildData.passives !== undefined) {
      updateData.passives = {
        deleteMany: { buildId },
        create: buildData.passives.map((p) => ({
          passiveId: p.passiveId,
          level: p.level,
        })),
      };
    }

    if (buildData.stigmas !== undefined) {
      updateData.stigmas = {
        deleteMany: { buildId },
        create: buildData.stigmas.map((s) => ({
          stigmaId: s.stigmaId,
          level: s.level,
          stigmaCost: s.stigmaCost,
          activeSpecialtyChoiceIds: s.activeSpecialtyChoiceIds,
          selectedChainSkillIds: s.selectedChainSkillIds,
        })),
      };
    }

    // Update build
    const updatedBuild = await prisma.build.update({
      where: { id: buildId },
      data: updateData,
      include: fullBuildInclude,
    });

    // Invalidate cache
    revalidateTag("builds", "max");
    revalidatePath(`/build/${buildId}`, "page");
    revalidatePath("/morebuild", "page");

    // Validate and return build
    const validatedBuild = BuildSchema.parse(updatedBuild);

    return apiSuccess(validatedBuild);
  } catch (error) {
    return handleApiError(error);
  }
}

// ========================================
// DELETE /api/v1/builds/[id]
// Delete a build
// ========================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const buildId = parseInt(id, 10);

    if (isNaN(buildId)) {
      return apiError("Invalid build ID", 400);
    }

    // Check ownership
    await requireBuildOwnership(buildId);

    // Delete build (relations will be cascade deleted)
    await prisma.build.delete({
      where: { id: buildId },
    });

    // Invalidate cache
    revalidateTag("builds", "max");
    revalidatePath("/morebuild", "page");
    revalidatePath("/myprofile", "page");
    revalidatePath(`/build/${buildId}`, "page");

    return apiSuccess({ deleted: true }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
