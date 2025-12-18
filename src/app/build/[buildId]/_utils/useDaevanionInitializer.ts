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
  const lastDaevanionRef = useRef<{ nezekan: number[]; zikel: number[]; vaizel: number[]; triniel: number[]; ariel: number[]; azphel: number[]; } | null>(null);

  // Charger les données daevanion depuis le build au chargement
  // Recharger aussi quand le build.daevanion change pour réagir aux modifications
  useEffect(() => {
    if (!build) return;
    
    const currentBuildId = build.id;
    const currentDaevanion = build.daevanion;
    
    // Sérialiser les données daevanion pour la comparaison
    const currentDaevanionStr = JSON.stringify(currentDaevanion);
    const lastDaevanionStr = lastDaevanionRef.current ? JSON.stringify(lastDaevanionRef.current) : null;
    
    // Charger si c'est la première fois, si le buildId a changé, ou si les données daevanion ont changé
    const daevanionChanged = 
      !hasLoadedRef.current || 
      lastBuildIdRef.current !== currentBuildId ||
      currentDaevanionStr !== lastDaevanionStr;
    
    if (daevanionChanged) {
      hasLoadedRef.current = true;
      lastBuildIdRef.current = currentBuildId;
      lastDaevanionRef.current = currentDaevanion || null;
      
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
  }, [build, build?.daevanion, loadFromBuild]);
};
