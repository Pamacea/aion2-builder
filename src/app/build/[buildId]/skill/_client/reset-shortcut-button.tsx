import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ResetShortcutButton = () => {
  return (
    <Button className="w-10 h-10 bg-background/80 border-2 border-foreground/20 hover:border-foreground">
      <Image src="/icons/reset-logo.webp" alt="Reset Icon" width={24} height={24} />
    </Button>
  );
};