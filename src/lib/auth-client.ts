"use client";

// Client-safe functions for NextAuth v5
// These functions call the NextAuth API routes directly instead of importing from @/auth
// This avoids bundling server-only code (prisma) in client components

export const signIn = async (provider?: string, callbackUrl?: string) => {
  const providerToUse = provider || "discord";
  // In NextAuth v5, redirect directly to the provider signin endpoint
  // The catch-all route [...nextauth] will handle this
  const url = callbackUrl
    ? `/api/auth/signin/${providerToUse}?callbackUrl=${callbackUrl}`
    : `/api/auth/signin/${providerToUse}`;
  window.location.href = url;
};

export const signOut = async (callbackUrl?: string) => {
  // In NextAuth v5, redirect to the signout endpoint
  // NextAuth will handle the signout and redirect automatically
  const url = callbackUrl
    ? `/api/auth/signout?callbackUrl=${callbackUrl}`
    : "/api/auth/signout";
  window.location.href = url;
};
