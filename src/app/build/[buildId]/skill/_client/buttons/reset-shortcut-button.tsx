import { IconButton } from "../../_utils/iconButton";

type ResetShortcutButtonProps = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const ResetShortcutButton = ({
  onClick,
  className = "",
  disabled = false,
}: ResetShortcutButtonProps) => (
  <IconButton
    icon="/icons/IC_Feaure_Reset.webp"
    alt="Reset Icon"
    onClick={onClick}
    disabled={disabled}
    className={`w-14 h-13 bg-secondary/30 border-x-2 border-secondary hover:border-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    iconSize={24}
    title={disabled ? "Vous devez être le propriétaire pour modifier les shortcuts" : "Reset all shortcuts"}
  />
);