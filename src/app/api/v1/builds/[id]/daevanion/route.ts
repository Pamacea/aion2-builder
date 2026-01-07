import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError, requireBuildOwnership, validateRequest } from "@/lib/api-utils";
import { DaevanionSchema } from "@/types/api.schema";
import { revalidateTag, revalidatePath } from "next/cache";

// ========================================
// PUT /api/v1/builds/[id]/daevanion
// Update daevanion configuration for a build
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
    const validation = validateRequest(DaevanionSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const daevanionData = validation.data;

    // Check ownership
    await requireBuildOwnership(buildId);

    // Upsert daevanion data
    await prisma.buildDaevanion.upsert({
      where: { buildId },
      create: {
        buildId,
        nezekan: daevanionData.nezekan,
        zikel: daevanionData.zikel,
        vaizel: daevanionData.vaizel,
        triniel: daevanionData.triniel,
        ariel: daevanionData.ariel,
        azphel: daevanionData.azphel,
      },
      update: {
        nezekan: daevanionData.nezekan,
        zikel: daevanionData.zikel,
        vaizel: daevanionData.vaizel,
        triniel: daevanionData.triniel,
        ariel: daevanionData.ariel,
        azphel: daevanionData.azphel,
      },
    });

    // Invalidate cache
    revalidateTag("builds", "max");
    revalidatePath(`/build/${buildId}`, "page");
    revalidatePath(`/build/${buildId}/sphere`, "page");
    revalidatePath(`/build/${buildId}/skill`, "page");

    return apiSuccess(daevanionData);
  } catch (error) {
    return handleApiError(error);
  }
}
