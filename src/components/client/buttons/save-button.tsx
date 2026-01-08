import Image from "next/image";
import { Button } from "../../ui/button";

export const SaveButton = () => {
  return (
    <Button
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
      aria-label="Create new build"
      title="Create new build"
    >
      <Image
        src="/icons/IC_Feature_Create.webp"
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
      />
    </Button>
  );
};
