"use client";

import { BuildType } from "@/types/schema";
import { useState } from "react";
import { LikedBuilds } from "../_client/liked-builds";
import { UserBuilds } from "../_client/user-builds";
import { UserInfo } from "../_client/user-info";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type MyProfileProps = {
  user: User;
  builds: BuildType[];
  likedBuilds: BuildType[];
};

export const MyProfile = ({ user, builds, likedBuilds }: MyProfileProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "builds" | "liked">("info");

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-foreground uppercase py-8 font-cinzel text-center">MY PROFILE</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b-2 border-background/20 pt-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 font-semibold uppercase transition-colors ${
              activeTab === "info"
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab("builds")}
            className={`px-6 py-3 font-semibold uppercase transition-colors ${
              activeTab === "builds"
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            My builds ({builds.length})
          </button>
          <button
            onClick={() => setActiveTab("liked")}
            className={`px-6 py-3 font-semibold uppercase transition-colors ${
              activeTab === "liked"
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            Liked builds ({likedBuilds.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "info" && <UserInfo user={user} />}
        {activeTab === "builds" && <UserBuilds builds={builds} />}
        {activeTab === "liked" && <LikedBuilds builds={likedBuilds} />}
      </div>
    </div>
  );
};

