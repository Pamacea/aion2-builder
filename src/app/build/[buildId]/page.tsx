import { BuildType } from "@/types/schema";
import { getBuildById } from "actions/buildActions";
import { redirect } from "next/navigation";

// Les builds individuels peuvent être mis en cache - revalidate toutes les minutes
export const revalidate = 60; // 1 minute (les builds peuvent être modifiés)

export default async function BuildPage(props: {
  params: Promise<{ buildId: string }>;
}) {
  const { buildId } = await props.params;
  const numericBuildId = parseInt(buildId, 10);

  if (isNaN(numericBuildId)) {
    redirect("/");
  }

  const buildData: BuildType | null = await getBuildById(numericBuildId);

  if (!buildData) {
    redirect("/");
  }

  redirect(`/build/${buildId}/profile`);
}
