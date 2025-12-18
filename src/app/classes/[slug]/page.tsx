import dynamic from "next/dynamic";
import { getClassPageData } from "./_utils/getClassPageData";

// Code splitting : charger les composants de manière lazy
const Class = dynamic(() => import("./_components/Class").then(mod => ({ default: mod.Class })), {
  loading: () => <div>Loading class...</div>,
});

const ExploreOthersClasses = dynamic(() => import("./_components/exploreOtherClasses").then(mod => ({ default: mod.ExploreOthersClasses })), {
  loading: () => <div>Loading...</div>,
});

// Utiliser ISR (Incremental Static Regeneration) pour de meilleures performances
export const revalidate = 300; // Revalidate toutes les 5 minutes

export default async function ClassPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const { classData, starterbuildId } = await getClassPageData(slug);

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 md:gap-16 py-6 md:py-12 px-4 md:px-0">
      <Class classData={classData} starterbuildId={starterbuildId} />
      <ExploreOthersClasses />
    </main>
  );
}
