import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ClassSchema } from "@/types/schema";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

// ========================================
// GET /api/v1/classes
// List all classes with basic information
// ========================================

/**
 * List all available classes.
 * Returns basic class information (id, name, description, icon).
 * Cached for 1 hour.
 */
export async function GET(request: NextRequest) {
  try {
    // Cache the classes list for 1 hour
    const getCachedClasses = unstable_cache(
      async () => {
        // Fetch all classes with selective fields (lightweight)
        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            iconUrl: true,
            bannerUrl: true,
            characterUrl: true,
          },
          orderBy: { name: "asc" },
        });

        return classes;
      },
      ["classes-list"],
      { revalidate: 3600 } // 1 hour TTL
    );

    const classes = await getCachedClasses();

    return apiSuccess(classes, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
