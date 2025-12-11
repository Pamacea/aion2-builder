import { getBuildById } from "@/lib/build";
import { BuildType } from "@/types/schema";
import { redirect } from "next/navigation";

export default async function BuildPage(props: {
  params: { buildId: string };
}) {
  const { buildId } = await props.params;
  const numericBuildId = parseInt(buildId, 10);

  if (isNaN(numericBuildId)) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const buildData: BuildType | null = await getBuildById(numericBuildId);

  if (!buildData) {
    return <div>Build non trouvé</div>;
  }

  redirect(`/build/${buildId}/profile`);

  return null;
}
