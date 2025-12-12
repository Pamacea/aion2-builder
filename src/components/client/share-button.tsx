import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const ShareButton = () => {
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Button
      onClick={handleShare}
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
    >
      <Image
        src="/icons/share-logo.webp"
        alt="Bahion Logo"
        width={32}
        height={32}
      />
    </Button>
  );
};
