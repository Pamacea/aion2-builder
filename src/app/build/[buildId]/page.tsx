import { BuildType } from "@/types/schema";
import { getBuildById } from "actions/buildActions";
import { redirect } from "next/navigation";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

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
