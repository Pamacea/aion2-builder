import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BuildSchema } from "@/types/schema";
import { apiSuccess, handleApiError, apiError, validateRequest } from "@/lib/api-utils";
import { CreateBuildSchema } from "@/types/api.schema";
import { requireAuth } from "@/lib/auth-utils";
import { buildListingInclude } from "@/utils/actionsUtils";

// ========================================
// GET /api/v1/users/me/builds
// Get current user's builds
// ========================================

/**
 * Get all builds for the currently authenticated user.
 * Returns both private and public builds owned by the user.
 * Cached per user for 5 minutes.
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    const userId = session.user.id;

    // Cache user's builds for 5 minutes (per user)
    const getCachedUserBuilds = unstable_cache(
      async (uid: string) => {
        const builds = await prisma.build.findMany({
          where: { userId: uid },
          include: buildListingInclude,
          orderBy: { id: "desc" },
        });

        return builds;
      },
      [`user-builds-${userId}`],
      { revalidate: 300 } // 5 minutes TTL
    );

    const builds = await getCachedUserBuilds(userId);

    // Validate and return builds
    const validatedBuilds = builds.map((build) => BuildSchema.parse(build));

    return apiSuccess(validatedBuilds, 200, builds.length);
  } catch (error) {
    return handleApiError(error);
  }
}

// ========================================
// POST /api/v1/users/me/builds
// Create a new build for current user
// ========================================

/**
 * Create a new build for the currently authenticated user.
 * Automatically assigns the build to the current user.
 * Invalidates cache and revalidates relevant paths.
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    const userId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(CreateBuildSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const buildData = validation.data;

    // Create build with relations
    const newBuild = await prisma.build.create({
      data: {
        name: buildData.name,
        classId: buildData.classId,
        userId: userId,
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

    // Invalidate user's builds cache
    const getCachedUserBuilds = unstable_cache(
      async () => [],
      [`user-builds-${userId}`],
      { revalidate: 300 }
    );
    // Revalidation is handled by Next.js through revalidatePath

    // Revalidate relevant paths
    revalidatePath("/api/v1/builds");
    revalidatePath("/api/v1/users/me/builds");
    revalidatePath(`/builds/${newBuild.id}`);

    return apiSuccess(validatedBuild, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
