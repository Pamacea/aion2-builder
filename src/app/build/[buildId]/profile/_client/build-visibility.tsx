"use client";

import { useBuildStore } from "@/store/useBuildEditor";
import { canEditBuild, isStarterBuild } from "@/utils/buildUtils";
import { Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { StarterBuildMessage } from "../_components/starterBuildMessage";

export const BuildVisibility = memo(() => {
  const { build, currentUserId, setBuild } = useBuildStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Mémoriser les valeurs calculées
  const isStarter = useMemo(() => build ? isStarterBuild(build) : false, [build]);
  const canEdit = useMemo(() => build ? canEditBuild(build, currentUserId) : false, [build, currentUserId]);
  const isDisabled = useMemo(() => isStarter || !canEdit, [isStarter, canEdit]);
  const isPrivate = useMemo(() => build?.private ?? false, [build?.private]);

  // Handler pour toggle la visibilité
  const handleToggleVisibility = useCallback(async () => {
    if (!build || isDisabled || isUpdating) return;

    setIsUpdating(true);
    const newPrivateStatus = !isPrivate;

    try {
      // Mise à jour optimiste
      setBuild({ ...build, private: newPrivateStatus });

      // Appel serveur
      const { updateBuildPrivateStatus } = await import("@/actions/buildActions");
      await updateBuildPrivateStatus(build.id, newPrivateStatus);
    } catch (error) {
      // Restaurer l'état précédent en cas d'erreur
      setBuild({ ...build, private: !newPrivateStatus });
      console.error("Error updating build visibility:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [build, isDisabled, isPrivate, isUpdating, setBuild]);

  if (!build) return null;

  return (
    <section className="w-full md:w-auto flex flex-col items-center md:items-start justify-center gap-3 sm:gap-4">
      <h2 className="uppercase font-bold text-base sm:text-lg md:text-xl text-ring">VISIBILITÉ</h2>
      
      {/* Toggle Switch personnalisé */}
      <div className="relative">
        <button
          onClick={handleToggleVisibility}
          disabled={isDisabled || isUpdating}
          className={`
            relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out
            ${isPrivate 
              ? 'bg-foreground/10 border-2 border-foreground/20 hover:bg-foreground/15' 
              : 'bg-primary/10 border-2 border-primary/30 hover:bg-primary/15'
            }
            ${isDisabled || isUpdating 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:scale-105 active:scale-95'
            }
            min-w-[140px] justify-between
          `}
          aria-label={isPrivate ? "Rendre le build public" : "Rendre le build privé"}
        >
          {/* Icône à gauche */}
          <div className={`
            flex items-center justify-center transition-all duration-300
            ${isPrivate ? 'text-foreground/70' : 'text-primary'}
          `}>
            {isPrivate ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Unlock className="h-5 w-5" />
            )}
          </div>

          {/* Label au centre */}
          <span className={`
            font-semibold text-sm transition-all duration-300
            ${isPrivate ? 'text-foreground' : 'text-primary'}
          `}>
            {isPrivate ? 'Privé' : 'Public'}
          </span>

          {/* Switch toggle à droite */}
          <div className={`
            relative w-11 h-6 rounded-full transition-all duration-300
            ${isPrivate ? 'bg-foreground/30' : 'bg-primary'}
          `}>
            <div className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              transition-all duration-300 ease-in-out shadow-md
              ${isPrivate ? 'translate-x-0' : 'translate-x-5'}
            `}>
              {/* Icône dans le cercle */}
              <div className="flex items-center justify-center h-full">
                {isPrivate ? (
                  <EyeOff className="h-3 w-3 text-foreground/60" />
                ) : (
                  <Eye className="h-3 w-3 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Indicateur de chargement */}
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      {isStarter && <StarterBuildMessage />}
    </section>
  );
});

BuildVisibility.displayName = "BuildVisibility";