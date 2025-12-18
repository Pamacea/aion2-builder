import { IconButton } from "../../_utils/iconButton";

type MinusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const MinusButton = ({ onClick, disabled = false }: MinusButtonProps) => (
  <IconButton
    icon="/icons/IC_Feature_Minus.webp"
    alt="Minus Icon"
    onClick={onClick}
    disabled={disabled}
    className="h-full bg-destructive/50 border-y-2 border-secondary hover:border-primary hover:bg-destructive/80 disabled:opacity-50"
    iconSize={20}
  />
);