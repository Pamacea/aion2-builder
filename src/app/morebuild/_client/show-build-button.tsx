"use client";

import { Button } from "@/components/ui/button";
import { ShowBuildButtonProps } from "@/types/build.type";
import { useRouter } from "next/navigation";

export const ShowBuildButton = ({ buildId }: ShowBuildButtonProps) => {
  const router = useRouter();

  const handleShow = () => {
    router.push(`/build/${buildId}/profile`);
  };

  return (
    <Button
      onClick={handleShow}
      className="w-full bg-background/60 text-foreground border-y-2 border-foreground/50 hover:bg-background/80 hover:border-foreground/70 font-bold uppercase text-xs py-1.5 sm:py-2 transition-colors"
    >
      Show Build
    </Button>
  );
};

