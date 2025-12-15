"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data?.user);
        setUserId(data?.user?.id || null);
        setIsLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserId(null);
        setIsLoading(false);
      });
  }, []);

  return { isAuthenticated, isLoading, userId };
}

