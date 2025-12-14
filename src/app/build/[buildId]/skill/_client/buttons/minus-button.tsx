import { IconButton } from "../../_utils/iconButton";

type MinusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const MinusButton = ({ onClick, disabled = false }: MinusButtonProps) => (
  <IconButton
    icon="/icons/minus-logo.webp"
    alt="Minus Icon"
    onClick={onClick}
    disabled={disabled}
    className="h-full bg-destructive/50 border-y-2 border-foreground/50 hover:border-foreground disabled:opacity-50"
  />
);