import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError, requireAuth } from "@/lib/api-utils";
import { revalidateTag, revalidatePath } from "next/cache";

// ========================================
// POST /api/v1/builds/[id]/like
// Toggle like on a build
// ========================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const buildId = parseInt(id, 10);

    if (isNaN(buildId)) {
      return apiError("Invalid build ID", 400);
    }

    // Check authentication
    const session = await requireAuth();

    // Check if build exists
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      select: { id: true },
    });

    if (!build) {
      return apiError("Build not found", 404);
    }

    // Check if user already liked this build
    const existingLike = await prisma.like.findUnique({
      where: {
        buildId_userId: {
          buildId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike: delete the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // Like: create new like
      await prisma.like.create({
        data: {
          buildId,
          userId: session.user.id,
        },
      });
    }

    // Count total likes
    const likesCount = await prisma.like.count({
      where: { buildId },
    });

    // Invalidate cache
    revalidateTag("builds", "max");
    revalidatePath("/morebuild", "page");
    revalidatePath(`/build/${buildId}`, "page");
    revalidatePath(`/build/${buildId}/profile`, "page");

    // Return like status and count
    return apiSuccess({
      liked: !existingLike,
      likesCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
