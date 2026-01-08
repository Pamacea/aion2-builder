import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../../ui/button";

export const ShareButton = () => {
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié', {
        description: 'Le lien du build a été copié dans le presse-papiers',
        duration: 3000,
        classNames: {
          description: 'text-sm !text-foreground',
          toast: '!bg-background/90 !text-foreground !border-y-2 !border-primary !rounded-none',
        },
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        },
      });
    } catch {
      toast.error('Erreur', {
        description: 'Impossible de copier le lien',
        duration: 3000,
        classNames: {
          description: 'text-sm text-foreground/80',
          toast: '!bg-background !text-foreground',
        },
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        },
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="h-full justify-start items-center flex px-2 sm:px-4 md:px-8 hover:border-b-2 hover:border-b-primary border-b-2 border-b-secondary"
      aria-label="Share build link"
      title="Share build link"
    >
      <Image
        src="/icons/IC_Feature_Share.webp"
        alt=""
        width={32}
        height={32}
        className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
        aria-hidden="true"
      />
    </Button>
  );
};
