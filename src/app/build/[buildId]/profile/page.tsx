import { getBuildById } from "@/lib/build";
import { BuildType } from "@/types/schema";
import { notFound, redirect } from "next/navigation";

export default async function BuildProfilePage(props: {
  params: { buildId: string };
}) {
  // 1. CORRECTION : Retirer 'await' de la déstructuration
  const { buildId } = await props.params;
  
  const numericBuildId = parseInt(buildId, 10);

  // 2. CORRECTION : Utiliser 'redirect' de next/navigation pour la redirection dans l'App Router
  if (isNaN(numericBuildId)) {
    // Redirection vers la page d'accueil (ou notFound si c'est une erreur 404)
    redirect('/'); 
  }

  const buildData: BuildType | null = await getBuildById(numericBuildId);

  // 3. CORRECTION : Utiliser 'notFound' de next/navigation pour le 404
  if (!buildData) {
    notFound(); 
  }

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-4">
      <h1 className="text-2xl font-bold">
        profile
      </h1>
    </main>
  );
}