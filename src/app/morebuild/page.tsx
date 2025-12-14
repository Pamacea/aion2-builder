import { getAllBuilds } from "@/actions/buildActions";
import { getAllClass } from "@/actions/classActions";
import { MoreBuild } from "./_components/MoreBuild";

export default async function MoreBuildPage() {
  const builds = await getAllBuilds();
  const classes = await getAllClass();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <MoreBuild builds={builds} classes={classes} />
    </div>
  );
}