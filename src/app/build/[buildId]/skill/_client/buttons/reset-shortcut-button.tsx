import { IconButton } from "../../_utils/iconButton";

type ResetShortcutButtonProps = {
  onClick?: () => void;
  className?: string;
};

export const ResetShortcutButton = ({
  onClick,
  className = "",
}: ResetShortcutButtonProps) => (
  <IconButton
    icon="/icons/reset-logo.webp"
    alt="Reset Icon"
    onClick={onClick}
    className={`w-14 h-13 bg-background/80 border-y-2 border-foreground/50 hover:border-foreground ${className}`}
    iconSize={24}
    title="Reset all shortcuts"
  />
);