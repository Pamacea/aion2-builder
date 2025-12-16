"use client";

import { useAuthSession } from "@/hooks/useAuthSession";
import { AuthContextType, AuthProviderProps } from "@/types/auth-context.type";
import { createContext, useContext, useMemo } from "react";

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isLoading: true,
  userId: null,
  userName: null,
});

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  // Utiliser TanStack Query pour la session si pas de session initiale
  const { data: sessionData, isLoading: sessionLoading } = useAuthSession();

  // Utiliser la session initiale si disponible, sinon utiliser TanStack Query
  const session = initialSession || sessionData;
  const isLoading = initialSession ? false : sessionLoading;

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: session?.user ? true : (isLoading ? null : false),
    isLoading,
    userId: session?.user?.id || null,
    userName: session?.user?.name || session?.user?.email || null,
  }), [session, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

