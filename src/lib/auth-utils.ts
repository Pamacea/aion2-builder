import { auth } from "@/auth";

// ========================================
// Custom Error Class for Auth Errors
// ========================================

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// ========================================
// Authentication Utilities
// ========================================

/**
 * Require authentication for the current request.
 * Throws AuthError if user is not authenticated.
 *
 * @returns The current session with authenticated user
 * @throws {AuthError} If user is not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthError("Authentication required");
  }

  return session;
}

/**
 * Get the current user ID from the session.
 * Returns null if user is not authenticated.
 *
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
