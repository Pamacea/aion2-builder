import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BuildSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth-utils";
import { buildListingInclude } from "@/utils/actionsUtils";

// ========================================
// GET /api/v1/users/me/liked
// Get current user's liked builds
// ========================================

/**
 * Get all builds liked by the currently authenticated user.
 * Returns builds that the user has liked (public builds only).
 * Cached per user for 5 minutes.
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    const userId = session.user.id;

    // Cache user's liked builds for 5 minutes (per user)
    const getCachedLikedBuilds = unstable_cache(
      async (uid: string) => {
        // Find all likes by this user
        const likes = await prisma.like.findMany({
          where: { userId: uid },
          include: {
            build: {
              include: buildListingInclude,
            },
          },
          orderBy: { createdAt: "desc" },
        });

        // Extract builds from likes
        const builds = likes.map((like) => like.build).filter(Boolean);

        return builds;
      },
      [`user-liked-builds-${userId}`],
      { revalidate: 300 } // 5 minutes TTL
    );

    const builds = await getCachedLikedBuilds(userId);

    // Validate and return builds
    const validatedBuilds = builds.map((build) => BuildSchema.parse(build));

    return apiSuccess(validatedBuilds, 200, builds.length);
  } catch (error) {
    return handleApiError(error);
  }
}
