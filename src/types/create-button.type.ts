export type CreateButtonVariant = "icon" | "text";

export type CreateButtonProps = {
  variant?: CreateButtonVariant;
  buildId?: number;
  starterBuildId?: number | null;
  text?: string;
  hideWhenUnauthenticated?: boolean; // Cache le bouton si non authentifié (par défaut: true pour variant="icon")
  showDiscordWhenUnauthenticated?: boolean; // Affiche le bouton Discord si non authentifié
  className?: string; // Classe CSS personnalisée pour le bouton texte
};