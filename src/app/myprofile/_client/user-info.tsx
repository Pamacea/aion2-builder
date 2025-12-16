"use client";

import Image from "next/image";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type UserInfoProps = {
  user: User;
};

export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="w-full flex flex-col gap-6 p-6 bg-background/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden ">
          <Image
            src={user.image || "/icons/bahion.webp"}
            alt={user.name || "User avatar"}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-foreground uppercase">
            {user.name || "Utilisateur"}
          </h2>
          {user.email && (
            <p className="text-sm text-foreground/70">{user.email}</p>
          )}
          <p className="text-xs text-foreground/50">ID: {user.id}</p>
        </div>
      </div>
    </div>
  );
};

