import { DiscoverClass } from "@/components/client/discover-class";
import { DiscoverHead } from "@/components/client/discover-head";

// Force dynamic rendering since we need database access
// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
export const revalidate = 300; // Revalidate toutes les 5 minutes

export default function Home() {
  return (
    <>
    <DiscoverHead />
    <DiscoverClass />
    </>
  );
}
