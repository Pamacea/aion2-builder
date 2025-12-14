import { IconButton } from "../../_utils/iconButton";

type PlusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const PlusButton = ({ onClick, disabled = false }: PlusButtonProps) => (
  <IconButton
    icon="/icons/plus-logo.webp"
    alt="Plus Icon"
    onClick={onClick}
    disabled={disabled}
    className="h-full w-2/4 bg-green-600/50 border-y-2 border-foreground/50 hover:border-foreground disabled:opacity-50"
  />
);