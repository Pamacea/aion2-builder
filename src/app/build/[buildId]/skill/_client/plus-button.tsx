import { Button } from "@/components/ui/button";
import Image from "next/image";

type PlusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const PlusButton = ({ onClick, disabled = false }: PlusButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      className="h-full w-2/4 bg-green-600/50 border-y-2 border-foreground/50 hover:border-foreground disabled:opacity-50"
    >
      <Image 
        src="/icons/plus-logo.webp" 
        alt="Plus Icon" 
        width={28} 
        height={28}
        className="object-contain"
      />
    </Button>
  );
};