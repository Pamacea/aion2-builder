import { ClassType } from "@/types/schema";
import { getStarterBuildIdByClassName } from "actions/buildActions";
import { getClassByName } from "actions/classActions";
import { Class } from "./_components/Class";
import { ExploreOthersClasses } from "./_components/ExploreOthersClasses";

export default async function ClassPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const classData: ClassType | null = await getClassByName(slug);
  const starterbuildId = await getStarterBuildIdByClassName(slug);

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
