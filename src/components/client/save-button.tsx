import Image from "next/image";
import { Button } from "../ui/button";

export const SaveButton = () => {
  return (
    <Button
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
    >
      <Image
        src="/icons/save-logo-2.webp"
        alt="Bahion Logo"
        width={24}
        height={24}
      />
    </Button>
  );
};
