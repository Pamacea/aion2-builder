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
};

export const IconButton = ({
  icon,
  alt,
  onClick,
  disabled = false,
  className = "",
  iconSize = 28,
  title,
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
    >
      <Image
        src={icon}
        alt={alt}
        width={iconSize}
        height={iconSize}
        className="object-contain"
      />
    </Button>
  );
};

