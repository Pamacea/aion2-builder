"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type ResetShortcutButtonProps = {
  onClick?: () => void;
  className?: string;
};

export const ResetShortcutButton = ({ onClick, className = "" }: ResetShortcutButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`w-14 h-13 bg-background/80 border-y-2 border-foreground/50 hover:border-foreground ${className}`}
      title="Reset all shortcuts"
    >
      <Image src="/icons/reset-logo.webp" alt="Reset Icon" width={24} height={24} className="object-contain" />
    </Button>
  );
};