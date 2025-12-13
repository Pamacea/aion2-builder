import { Button } from "@/components/ui/button";
import Image from "next/image";

type MinusButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const MinusButton = ({ onClick, disabled = false }: MinusButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      className="h-full bg-destructive/50 border-y-2 border-foreground/50 hover:border-foreground disabled:opacity-50"
    >
      <Image 
        src="/icons/minus-logo.webp" 
        alt="Minus Icon" 
        width={28} 
        height={28}
        className="object-contain"
      />
    </Button>
  );
};