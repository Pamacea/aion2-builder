"use client";

/**
 * Utilitaire pour le prefetching intelligent des pages
 * Utilise les cookies pour respecter les préférences utilisateur
 */

import { userPrefs } from "./cookies";

/**
 * Prefetch une route si le prefetch est activé
 */
export function smartPrefetch(url: string): void {
  if (typeof window === "undefined") return;
  
  // Vérifier si le prefetch est activé
  if (!userPrefs.getPrefetchEnabled()) return;
  
  // Ne prefetch que les routes internes
  if (!url.startsWith("/") || url.startsWith("//")) return;
  
  // Utiliser le Link prefetch de Next.js si disponible
  // Sinon, créer un link element avec prefetch
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  link.as = "document";
  document.head.appendChild(link);
}

/**
 * Prefetch une liste de routes communes
 */
export function prefetchCommonRoutes(): void {
  if (typeof window === "undefined") return;
  
  const commonRoutes = [
    "/",
    "/classes",
    "/morebuild",
  ];
  
  commonRoutes.forEach(route => smartPrefetch(route));
}
