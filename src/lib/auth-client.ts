"use client";

// Client-safe functions for NextAuth v5
// These functions call the NextAuth API routes directly instead of importing from @/auth
// This avoids bundling server-only code (prisma) in client components

export const signIn = async (provider?: string) => {
  const providerToUse = provider || "discord";
  // In NextAuth v5, redirect directly to the provider signin endpoint
  // The catch-all route [...nextauth] will handle this
  window.location.href = `/api/auth/signin/${providerToUse}`;
};

export const signOut = async () => {
  // In NextAuth v5, redirect to the signout endpoint
  // NextAuth will handle the signout and redirect automatically
  window.location.href = "/api/auth/signout";
};
