import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// Vérification des variables d'environnement
if (!process.env.DISCORD_CLIENT_ID) {
  console.error("❌ DISCORD_CLIENT_ID is missing");
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  console.error("❌ DISCORD_CLIENT_SECRET is missing");
}
if (!process.env.AUTH_SECRET) {
  console.error("❌ AUTH_SECRET is missing");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database", // important avec Prisma
  },
  trustHost: true, // Required for NextAuth v5 in development
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
