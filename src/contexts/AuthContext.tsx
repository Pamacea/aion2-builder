"use client";

import { AuthContextType, AuthProviderProps } from "@/types/auth-context.type";
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  isLoading: true,
  userId: null,
  userName: null,
});

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    initialSession?.user ? true : null
  );
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [userId, setUserId] = useState<string | null>(
    initialSession?.user?.id || null
  );
  const [userName, setUserName] = useState<string | null>(
    initialSession?.user?.name || initialSession?.user?.email || null
  );

  useEffect(() => {
    // Si on a déjà une session initiale, on ne fait pas d'appel
    // isLoading est déjà initialisé à false dans useState(!initialSession)
    if (initialSession) {
      return;
    }

    // Sinon, on récupère la session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data?.user);
        setUserId(data?.user?.id || null);
        setUserName(data?.user?.name || data?.user?.email || null);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserId(null);
        setUserName(null);
        setIsLoading(false);
      });
  }, [initialSession]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userId, userName }}>
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

