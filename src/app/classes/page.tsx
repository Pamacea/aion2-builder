import { ExploreOthersClasses } from "./[slug]/_components/exploreOtherClasses";
import { VideoPlayer } from "./_components/VideoPlayer";

export default function ClassPage() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-1/2 h-full border-y-2 border-foreground/50">
        <VideoPlayer
          src="/video/aion-cinematic.mp4"
          autoPlay={true}
          loop={true}
          muted={true}
          controls={false}
        />
      </div>
      <ExploreOthersClasses />
    </main>
  );
}
