"use client";

import { DaevanionPath, DaevanionRune } from "@/types/daevanion.type";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface RuneGridProps {
  path: DaevanionPath;
  activeRunes: number[]; // Array de slotIds
  onToggleRune: (slotId: number) => void;
}

// Charger les données de runes depuis les fichiers de données
const getRunesForPath = async (path: DaevanionPath): Promise<(DaevanionRune | null)[]> => {
  // Pour l'instant, on a seulement Nezekan
  if (path === "nezekan") {
    // Dynamic import pour éviter les problèmes de bundle
    const { nezekanRunes } = await import("@/data/daevanion/nezekan");
    return nezekanRunes; // Peut contenir des null pour les slots vides
  }
  
  // Pour les autres chemins, générer des données de test temporaires
  // TODO: Créer les fichiers de données pour les autres chemins
  const runes: (DaevanionRune | null)[] = [];
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const slotId = i + 1;
    runes.push({
      id: slotId,
      slotId,
      path,
      rarity: "common",
      name: `${path} Rune ${slotId}`,
      description: `Rune ${slotId} du chemin ${path}`,
      stats: {
        mp: 50,
        maxHP: 100,
        criticalHit: 10,
        defense: 50,
        criticalHitResist: 5,
        attack: 5,
      },
      position: { x: col, y: row },
    });
  }
  return runes;
};

const getRuneImage = (rune: DaevanionRune, isActive: boolean): string => {
  // Vérifier si c'est le nœud central (Start)
  const isStartNode = rune.slotId === 61 && rune.path === "nezekan"; // Slot 61 = centre (5,5) en 11x11
  
  if (isStartNode) {
    return `/runes/RU_Daevanion_Node_Start.webp`;
  }
  
  if (isActive) {
    // Note: Le fichier Rare a une double extension .webp.webp, on gère ça
    if (rune.rarity === "rare") {
      return `/runes/RU_Daevanion_Node_Rare_Sprite.webp.webp`;
    }
    // Pour Legend, utiliser le fichier Legend
    if (rune.rarity === "legend") {
      return `/runes/RU_Daevanion_Node_Legend_Sprite.webp`;
    }
    const rarityCapitalized = rune.rarity.charAt(0).toUpperCase() + rune.rarity.slice(1);
    return `/runes/RU_Daevanion_Node_${rarityCapitalized}_Sprite.webp`;
  }
  // Images désactivées
  if (rune.rarity === "rare") {
    return `/runes/RU_Daevanion_Node_Rare_Disabled.webp`;
  }
  if (rune.rarity === "legend") {
    return `/runes/RU_Daevanion_Node_Legend_Desactivatedwebp.webp`;
  }
  const rarityCapitalized = rune.rarity.charAt(0).toUpperCase() + rune.rarity.slice(1);
  return `/runes/RU_Daevanion_Node_${rarityCapitalized}_Disabled.webp`;
};

export function RuneGrid({ path, activeRunes, onToggleRune }: RuneGridProps) {
  const [runes, setRunes] = useState<(DaevanionRune | null)[]>([]);
  
  useEffect(() => {
    getRunesForPath(path).then(setRunes);
  }, [path]);

  const canActivate = (rune: DaevanionRune): boolean => {
    if (activeRunes.includes(rune.slotId)) return true; // Déjà activée
    
    // Si pas de prérequis, peut être activée
    if (!rune.prerequisites || rune.prerequisites.length === 0) return true;
    
    // Vérifier qu'au moins UNE rune adjacente (prérequis) est activée
    // Cela permet d'activer les runes adjacentes à celles déjà activées
    return rune.prerequisites.some((prereq) => activeRunes.includes(prereq));
  };

  const handleRuneClick = async (rune: DaevanionRune) => {
    // Le start node (slotId 61) ne peut pas être désactivé
    const isStartNode = rune.slotId === 61 && rune.path === "nezekan";
    if (isStartNode) {
      return; // Ne peut pas cliquer sur le start node
    }
    if (!canActivate(rune) && !activeRunes.includes(rune.slotId)) {
      return; // Ne peut pas activer
    }
    await onToggleRune(rune.slotId);
  };

  // Organiser les runes en grille basée sur leurs positions (11x11 pour Nezekan)
  const gridRunes = useMemo(() => {
    const grid: (DaevanionRune | null)[][] = [];
    // Grille 11x11 pour Nezekan, 8x8 pour les autres chemins (à ajuster plus tard)
    const gridSize = path === "nezekan" ? 11 : 8;

    // Initialiser la grille
    for (let y = 0; y < gridSize; y++) {
      grid[y] = [];
      for (let x = 0; x < gridSize; x++) {
        grid[y][x] = null;
      }
    }

    // Placer les runes dans la grille selon leur position
    // Les runes peuvent être null (slots vides)
    runes.forEach((rune) => {
      if (rune && rune.position) {
        const x = rune.position.x;
        const y = rune.position.y;
        // Vérifier que la position est dans les limites
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
          grid[y][x] = rune;
        }
      }
    });

    return grid;
  }, [runes, path]);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="inline-block">
        {gridRunes.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((rune, colIndex) => {
              if (!rune) {
                return <div key={`${rowIndex}-${colIndex}`} className="w-16 h-16" />;
              }

              const isActive = activeRunes.includes(rune.slotId);
              const canActivateRune = canActivate(rune);
              const isStartNode = rune.slotId === 61 && rune.path === "nezekan";

              // Styles conditionnels
              let opacityClass = "opacity-100";
              let borderClass = "";
              
              if (isStartNode) {
                // Start node toujours visible et avec bordure bleue si actif
                opacityClass = "opacity-100";
                borderClass = isActive ? "border-2 border-blue-500" : "";
              } else if (isActive) {
                // Rune active : bordure bleue
                opacityClass = "opacity-100";
                borderClass = "border-2 border-blue-500";
              } else if (canActivateRune) {
                // Rune activable mais pas active : bordure grise
                opacityClass = "opacity-100";
                borderClass = "border-2 border-gray-400";
              } else {
                // Rune non activable : opacité réduite
                opacityClass = "opacity-40";
                borderClass = "";
              }

              return (
                <button
                  key={rune.slotId}
                  onClick={() => handleRuneClick(rune)}
                  disabled={!canActivateRune && !isActive}
                  className={`
                    relative w-16 h-16 transition-all
                    ${opacityClass}
                    ${canActivateRune || isActive ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                    ${borderClass}
                  `}
                  title={rune.name}
                >
                  <Image
                    src={getRuneImage(rune, isActive)}
                    alt={rune.name}
                    width={64}
                    height={64}
                    className="w-full h-full"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
