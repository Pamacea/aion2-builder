import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ClassSchema } from "@/types/schema";
import { apiSuccess, handleApiError, apiError } from "@/lib/api-utils";

// ========================================
// GET /api/v1/classes/:name
// Get detailed class data by name
// ========================================

/**
 * Get detailed information about a specific class by name.
 * Returns class data with abilities, passives, and stigmas.
 * Cached for 1 hour.
 *
 * @param name - Class name (e.g., 'templar', 'chanter', 'gladiator')
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    // Cache individual class data for 1 hour
    const getCachedClass = unstable_cache(
      async (className: string) => {
        // Find class by name (case-insensitive)
        const classData = await prisma.class.findFirst({
          where: {
            name: {
              equals: className,
              mode: "insensitive",
            },
          },
          include: {
            tags: true,
            abilities: {
              include: {
                spellTag: true,
                specialtyChoices: true,
                parentAbilities: {
                  include: {
                    chainAbility: {
                      include: {
                        class: {
                          include: {
                            tags: true,
                          },
                        },
                        spellTag: true,
                      },
                    },
                  },
                },
              },
            },
            passives: {
              include: {
                spellTag: true,
              },
            },
            stigmas: {
              include: {
                spellTag: true,
                specialtyChoices: true,
                parentStigmas: {
                  include: {
                    chainStigma: {
                      include: {
                        spellTag: true,
                        classes: {
                          include: {
                            tags: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return classData;
      },
      [`class-${name}`],
      { revalidate: 3600 } // 1 hour TTL
    );

    const classData = await getCachedClass(name);

    if (!classData) {
      return apiError(`Class '${name}' not found`, 404);
    }

    // Validate and return class data
    const validatedClass = ClassSchema.parse(classData);

    return apiSuccess(validatedClass, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
