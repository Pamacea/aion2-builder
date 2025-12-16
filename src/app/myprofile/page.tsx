import { getBuildsByUserId, getLikedBuildsByUserId } from "@/actions/buildActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MyProfile } from "./_components/MyProfile";

export default async function MyProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const builds = await getBuildsByUserId(session.user.id);
  const likedBuilds = await getLikedBuildsByUserId(session.user.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <MyProfile
        user={{
          id: session.user.id,
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
        }}
        builds={builds}
        likedBuilds={likedBuilds}
      />
    </div>
  );
}

