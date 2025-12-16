import { useAuth } from "@/hooks/useAuth";
import { useBuildStore } from "@/store/useBuildEditor";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export const useBuildLoader = () => {
  const params = useParams();
  const buildId = params?.buildId as string;
  const { build, loadBuild, loading, setCurrentUserId } = useBuildStore();
  const { userId } = useAuth();
  const lastBuildIdRef = useRef<string | null>(null);
  const lastUserIdRef = useRef<string | null>(null);

  // Mémoriser le buildId numérique pour éviter les recalculs
  const numericBuildId = useMemo(() => {
    if (!buildId) return null;
    const numId = Number(buildId);
    return !isNaN(numId) ? numId : null;
  }, [buildId]);

  // Mettre à jour currentUserId quand userId change (via useAuth, pas de fetch supplémentaire)
  useEffect(() => {
    if (userId && userId !== lastUserIdRef.current) {
      lastUserIdRef.current = userId;
      setCurrentUserId(userId);
    }
  }, [userId, setCurrentUserId]);

  // Charger le build seulement si le buildId a changé
  useEffect(() => {
    if (numericBuildId && (numericBuildId.toString() !== lastBuildIdRef.current)) {
      lastBuildIdRef.current = numericBuildId.toString();
      // Passer userId pour éviter un fetch séparé dans loadBuild
      loadBuild(numericBuildId, userId || null);
    }
  }, [numericBuildId, loadBuild, userId]);

  return { build, loading };
};

