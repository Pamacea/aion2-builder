import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiResponse, ApiResponseError, ApiResponseSuccess } from "@/types/api.schema";

// ========================================
// API Response Helpers
// ========================================

export function apiSuccess<T>(data: T, status: number = 200, count?: number): NextResponse<ApiResponseSuccess<T>> {
  const response: ApiResponseSuccess<T> = {
    success: true,
    data,
  };

  if (count !== undefined) {
    response.count = count;
  }

  return NextResponse.json(response, { status });
}

export function apiError(error: string, status: number = 400): NextResponse<ApiResponseError> {
  const response: ApiResponseError = {
    success: false,
    error,
  };

  return NextResponse.json(response, { status });
}

// ========================================
// Error Handling Utilities
// ========================================

export function handleApiError(error: unknown): NextResponse<ApiResponseError> {
  console.error("API Error:", error);

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("authorization") || error.message.includes("authorized")) {
      return apiError("Unauthorized", 403);
    }
    if (error.message.includes("not found")) {
      return apiError("Resource not found", 404);
    }
    if (error.message.includes("Unauthorized") || error.message.includes("connecté")) {
      return apiError("You must be authenticated", 401);
    }
    return apiError(error.message, 400);
  }

  return apiError("An unexpected error occurred", 500);
}

// ========================================
// Validation Utilities
// ========================================

export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: NextResponse<ApiResponseError> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return {
      success: false,
      error: apiError(`Validation error: ${errors}`, 400),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

// ========================================
// Auth Utilities
// ========================================

import { auth } from "@/auth";
import { isAdmin } from "@/utils/buildUtils";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be authenticated");
  }

  return session;
}

export async function requireBuildOwnership(buildId: number): Promise<{ userId: string; isAdmin: boolean }> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be authenticated");
  }

  const { prisma } = await import("@/lib/prisma");

  const build = await prisma.build.findUnique({
    where: { id: buildId },
    select: { userId: true },
  });

  if (!build) {
    throw new Error("Build not found");
  }

  const userIsAdmin = isAdmin(session.user.id);
  const isOwner = build.userId === session.user.id;

  if (build.userId && !isOwner && !userIsAdmin) {
    throw new Error("You don't have permission to modify this build");
  }

  return {
    userId: session.user.id,
    isAdmin: userIsAdmin,
  };
}
