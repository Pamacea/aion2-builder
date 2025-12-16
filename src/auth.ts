import "server-only";

import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// Vérification des variables d'environnement
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
// AUTH_URL n'est pas nécessaire avec trustHost: true - NextAuth auto-détecte depuis les headers HTTP
// Cela permet de supporter plusieurs domaines (aion2builder.vercel.app et bahion.oalacea.fr)

if (!process.env.DISCORD_CLIENT_ID) {
  console.error("❌ DISCORD_CLIENT_ID is missing");
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  console.error("❌ DISCORD_CLIENT_SECRET is missing");
}
if (!AUTH_SECRET) {
  console.error("❌ AUTH_SECRET or NEXTAUTH_SECRET is missing");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: AUTH_SECRET || undefined, // Utiliser undefined si manquant, NextAuth générera un avertissement
  basePath: "/api/auth",
  // Avec trustHost: true, NextAuth auto-détecte l'URL depuis les headers HTTP
  // Cela permet de supporter plusieurs domaines sans définir AUTH_URL
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "database", // important avec Prisma
  },
  trustHost: true, // Permet l'auto-détection de l'URL depuis les headers HTTP
                   // Supporte automatiquement plusieurs domaines (aion2builder.vercel.app et bahion.oalacea.fr)
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn() {
      // Permettre la connexion
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Si l'URL est relative, la convertir en URL absolue
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Si l'URL est sur le même domaine, l'utiliser
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Sinon, rediriger vers la base
      return baseUrl;
    },
  },
});
