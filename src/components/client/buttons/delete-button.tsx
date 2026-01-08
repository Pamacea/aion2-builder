"use client";

import { deleteBuildAction } from "@/actions/buildActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type DeleteButtonProps = {
  buildId: number;
  className?: string;
};

export const DeleteButton = ({ buildId, className = "" }: DeleteButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;
    setOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteBuildAction(buildId);
      setOpen(false);
      
      // Si on est sur la page d'un build spécifique, rediriger
      if (pathname?.startsWith(`/build/${buildId}`)) {
        const redirectPath = pathname.includes('/myprofile') ? "/myprofile" : "/morebuild";
        router.push(redirectPath);
      } else {
        // Rafraîchir la page actuelle (morebuild ou myprofile)
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting build:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`flex items-center justify-center p-1.5 sm:p-2 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          title="Supprimer le build"
          aria-label="Delete build"
          aria-busy={isDeleting}
        >
          <X className="size-3 sm:size-4" aria-hidden="true" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()} className="bg-background border-2 border-secondary">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce build ? Cette action est irréversible et le build sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
            aria-busy={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
