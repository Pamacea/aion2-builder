import { getAllBuilds } from "@/actions/buildActions";
import { getAllClass } from "@/actions/classActions";
import { MoreBuild } from "./_components/MoreBuild";

// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
// Revalidate toutes les minutes pour que les likes soient à jour rapidement
// Le cache sera aussi invalidé manuellement via revalidatePath après un like
export const revalidate = 60; // Revalidate toutes les minutes

export default async function MoreBuildPage() {
  const builds = await getAllBuilds();
  const classes = await getAllClass();

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <MoreBuild builds={builds} classes={classes} />
    </div>
  );
}