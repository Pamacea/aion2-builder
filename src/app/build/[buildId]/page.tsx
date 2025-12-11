import { getBuildById } from "@/lib/build";
import { BuildType } from "@/types/schema";

export default async function BuildPage(props: {
  params: { buildId: string };
}) {
  const { buildId } = props.params;
  const numericBuildId = parseInt(buildId, 10);

  if (isNaN(numericBuildId)) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  // 3. Appel à la base de données avec le nombre
  const buildData: BuildType | null = await getBuildById(numericBuildId);

  if (!buildData) {
    return <div>Build non trouvé</div>;
  }

  return (
    <main className="w-full h-full flex flex-col items-center justify-start gap-8 py-8"></main>
  );
}
