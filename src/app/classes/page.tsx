import { VideoPlayer } from "../../components/VideoPlayer";
import { ExploreOthersClasses } from "./[slug]/_components/exploreOtherClasses";

// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
// Revalidate la page toutes les 5 minutes
export const revalidate = 300; // 5 minutes

export default function ClassPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-8">
      <section className="w-1/2 h-1/2 py-4 border-x-2 border-primary">
        <VideoPlayer src="/video/aion-cinematic.mp4" autoPlay={true} loop={true} muted={true} controls={false} />
      </section>
      <ExploreOthersClasses />
    </main>
  );
}
