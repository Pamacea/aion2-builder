"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { useEffect, useRef } from "react";
import { useDaevanionStore } from "../sphere/_store/useDaevanionStore";

/**
 * Hook pour initialiser le store Daevanion avec les données du build
 * Charge une seule fois au montage ou quand le buildId change
 */
export const useDaevanionInitializer = () => {
  const build = useBuildStore((state) => state.build);
  const buildId = build?.id;
  const loadFromBuild = useDaevanionStore((state) => state.loadFromBuild);
  const lastBuildIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!buildId || lastBuildIdRef.current === buildId) return;
    
    lastBuildIdRef.current = buildId;
    
    if (build?.daevanion) {
      loadFromBuild({
        nezekan: build.daevanion.nezekan || [],
        zikel: build.daevanion.zikel || [],
        vaizel: build.daevanion.vaizel || [],
        triniel: build.daevanion.triniel || [],
        ariel: build.daevanion.ariel || [],
        azphel: build.daevanion.azphel || [],
      });
    } else {
      loadFromBuild(null);
    }
  }, [buildId, build?.daevanion, loadFromBuild]);
};
