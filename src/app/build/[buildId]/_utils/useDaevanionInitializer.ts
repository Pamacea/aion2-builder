"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useEffect, useRef } from "react";
import { useDaevanionStore } from "../sphere/_store/useDaevanionStore";

/**
 * Hook pour initialiser le store Daevanion avec les données du build
 * Doit être utilisé dans toutes les pages qui ont besoin du store Daevanion
 */
export const useDaevanionInitializer = () => {
  const { build } = useBuildStore();
  const { loadFromBuild } = useDaevanionStore();
  const hasLoadedRef = useRef(false);
  const lastBuildIdRef = useRef<number | null>(null);

  // Charger les données daevanion depuis le build au chargement
  // Ne charger qu'une seule fois au montage ou si le buildId change
  useEffect(() => {
    if (!build) return;
    
    const currentBuildId = build.id;
    
    // Ne charger que si c'est la première fois ou si le buildId a changé
    if (!hasLoadedRef.current || lastBuildIdRef.current !== currentBuildId) {
      hasLoadedRef.current = true;
      lastBuildIdRef.current = currentBuildId;
      
      if (build.daevanion) {
        loadFromBuild({
          nezekan: build.daevanion.nezekan || [],
          zikel: build.daevanion.zikel || [],
          vaizel: build.daevanion.vaizel || [],
          triniel: build.daevanion.triniel || [],
          ariel: build.daevanion.ariel || [],
          azphel: build.daevanion.azphel || [],
        });
      } else {
        // Si le build n'a pas de daevanion, initialiser avec le start node
        loadFromBuild(null);
      }
    }
  }, [build, loadFromBuild]);
};
