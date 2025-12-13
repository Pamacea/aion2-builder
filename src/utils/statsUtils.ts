// Base : la valeur de base au niveau 1
// Modifier : la valeur qu'on ajoute à la base à chaque niveau (fixe)
// Modifiers : tableau de modifiers par niveau [modifierNiveau2, modifierNiveau3, ...]
// Level : le niveau de l'élément
export function calculateStat(
  base: number | null | undefined,
  modifier: number | null | undefined,
  level: number,
  modifiers?: number[] | null | undefined
): number {
  const finalBase = base ?? 0;

  if (level <= 1) return finalBase;

  // Si un tableau de modifiers est fourni, utiliser celui-ci
  if (modifiers && modifiers.length > 0) {
    // Le tableau commence à l'index 0 pour le niveau 2
    // Donc pour le niveau N, on utilise l'index (N - 2)
    const modifierIndex = level - 2;
    if (modifierIndex >= 0 && modifierIndex < modifiers.length) {
      // Calculer la somme cumulative des modifiers jusqu'au niveau actuel
      let totalModifier = 0;
      for (let i = 0; i <= modifierIndex; i++) {
        totalModifier += modifiers[i] ?? 0;
      }
      return finalBase + totalModifier;
    }
    // Si le niveau dépasse le tableau, utiliser le dernier modifier pour les niveaux restants
    const lastModifier = modifiers[modifiers.length - 1] ?? 0;
    let totalModifier = modifiers.reduce((sum, mod) => sum + (mod ?? 0), 0);
    totalModifier += lastModifier * (level - 2 - modifiers.length + 1);
    return finalBase + totalModifier;
  }

  // Sinon, utiliser le modifier fixe
  const finalModifier = modifier ?? 0;
  return finalBase + finalModifier * (level - 1);
}
