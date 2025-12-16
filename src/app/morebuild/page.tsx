import { getAllBuilds } from "@/actions/buildActions";
import { getAllClass } from "@/actions/classActions";
import { MoreBuild } from "./_components/MoreBuild";

// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
export const revalidate = 300; // Revalidate toutes les 5 minutes

export default async function MoreBuildPage() {
  const builds = await getAllBuilds();
  const classes = await getAllClass();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <MoreBuild builds={builds} classes={classes} />
    </div>
  );
}