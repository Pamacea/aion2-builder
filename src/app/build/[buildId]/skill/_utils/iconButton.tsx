import { Button } from "@/components/ui/button";
import Image from "next/image";

type IconButtonProps = {
  icon: string;
  alt: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconSize?: number;
  title?: string;
  ariaLabel?: string;
};

export const IconButton = ({
  icon,
  alt,
  onClick,
  disabled = false,
  className = "",
  iconSize = 28,
  title,
  ariaLabel,
}: IconButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      className={className}
      title={title}
      aria-label={ariaLabel || alt}
    >
      <Image
        src={icon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="object-contain"
        aria-hidden="true"
      />
    </Button>
  );
};

