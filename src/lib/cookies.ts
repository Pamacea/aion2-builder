"use client";

/**
 * Utilitaire pour gérer les cookies côté client
 * Permet de stocker les préférences utilisateur pour améliorer les performances
 */

type CookieOptions = {
  expires?: number; // en jours
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

/**
 * Définir un cookie
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === "undefined") return;

  const {
    expires = 365, // Par défaut, expire dans 1 an
    path = "/",
    secure = process.env.NODE_ENV === "production",
    sameSite = "lax",
  } = options;

  const date = new Date();
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);

  const expiresStr = `expires=${date.toUTCString()}`;
  const pathStr = `path=${path}`;
  const secureStr = secure ? "secure" : "";
  const sameSiteStr = `SameSite=${sameSite}`;

  document.cookie = `${name}=${value}; ${expiresStr}; ${pathStr}; ${secureStr}; ${sameSiteStr}`;
}

/**
 * Récupérer un cookie
 */
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

/**
 * Supprimer un cookie
 */
export function deleteCookie(name: string, path: string = "/"): void {
  if (typeof window === "undefined") return;
  setCookie(name, "", { expires: -1, path });
}

/**
 * Cookies pour les préférences utilisateur
 */
export const USER_PREFS = {
  // Préférences d'affichage
  THEME: "user_theme", // "light" | "dark" | "system"
  ANIMATIONS_ENABLED: "animations_enabled", // "true" | "false"
  
  // Préférences de performance
  IMAGE_QUALITY: "image_quality", // "low" | "medium" | "high"
  PREFETCH_ENABLED: "prefetch_enabled", // "true" | "false"
  
  // Préférences de contenu
  DEFAULT_SORT: "default_sort", // "likes" | "newest" | "oldest"
  DEFAULT_FILTER: "default_filter", // class name ou null
} as const;

/**
 * Hook-like functions pour les préférences utilisateur
 */
export const userPrefs = {
  getTheme: (): string => getCookie(USER_PREFS.THEME) || "system",
  setTheme: (theme: string): void => setCookie(USER_PREFS.THEME, theme),
  
  getAnimationsEnabled: (): boolean => getCookie(USER_PREFS.ANIMATIONS_ENABLED) !== "false",
  setAnimationsEnabled: (enabled: boolean): void => setCookie(USER_PREFS.ANIMATIONS_ENABLED, enabled.toString()),
  
  getImageQuality: (): string => getCookie(USER_PREFS.IMAGE_QUALITY) || "high",
  setImageQuality: (quality: string): void => setCookie(USER_PREFS.IMAGE_QUALITY, quality),
  
  getPrefetchEnabled: (): boolean => getCookie(USER_PREFS.PREFETCH_ENABLED) !== "false",
  setPrefetchEnabled: (enabled: boolean): void => setCookie(USER_PREFS.PREFETCH_ENABLED, enabled.toString()),
  
  getDefaultSort: (): string => getCookie(USER_PREFS.DEFAULT_SORT) || "newest",
  setDefaultSort: (sort: string): void => setCookie(USER_PREFS.DEFAULT_SORT, sort),
  
  getDefaultFilter: (): string | null => getCookie(USER_PREFS.DEFAULT_FILTER) || null,
  setDefaultFilter: (filter: string | null): void => {
    if (filter) {
      setCookie(USER_PREFS.DEFAULT_FILTER, filter);
    } else {
      deleteCookie(USER_PREFS.DEFAULT_FILTER);
    }
  },
};
