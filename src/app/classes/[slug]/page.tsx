import { Class } from "./_components/Class";
import { ExploreOthersClasses } from "./_components/exploreOtherClasses";
import { getClassPageData } from "./_utils/getClassPageData";

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
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-8">
      <Class classData={classData} starterbuildId={starterbuildId} />
      <ExploreOthersClasses />
    </main>
  );
}
