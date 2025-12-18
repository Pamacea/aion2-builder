import { DiscoverClass } from "@/components/client/discover-class";
import { DiscoverHead } from "@/components/client/discover-head";
import { VideoPlayer } from "../components/VideoPlayer";

// Force dynamic rendering since we need database access
// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
export const revalidate = 300; // Revalidate toutes les 5 minutes

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-8 px-4 md:px-0">
      {/* VIDEO PLAYER */}
      <section className="w-full md:w-1/2 h-auto md:h-1/2 py-4 border-x-2 border-primary">
        <VideoPlayer src="/video/aion-cinematic.mp4" autoPlay={true} loop={true} muted={true} controls={false} />
      </section>
      {/* DISCOVER YOUR CLASS */}
      <DiscoverHead />
      <DiscoverClass />
    </main>
  );
}
