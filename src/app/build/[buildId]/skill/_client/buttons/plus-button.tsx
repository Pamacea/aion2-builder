import { IconButton } from "../../_utils/iconButton";

type PlusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const PlusButton = ({ onClick, disabled = false }: PlusButtonProps) => (
  <IconButton
    icon="/icons/IC_Feature_Plus.webp"
    alt="Plus Icon"
    onClick={onClick}
    disabled={disabled}
    className="h-full lg:w-2/4 bg-green-600/50 border-x-2 border-secondary hover:border-primary hover:bg-green-600/80 disabled:opacity-50"
    iconSize={20}
  />
);