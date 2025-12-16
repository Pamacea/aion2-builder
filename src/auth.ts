import "server-only";

import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// Vérification des variables d'environnement
const AUTH_SECRET = process.env.AUTH_SECRET;

// Avec trustHost: true, NextAuth détecte automatiquement le domaine depuis les headers HTTP
// Cela permet de supporter automatiquement :
// - http://localhost:3000 (dev local)
// - https://aion2builder.vercel.app (Vercel production)
// - https://bahion.oalacea.fr (domaine custom)
// 
// AUTH_URL n'est plus nécessaire - trustHost gère tout automatiquement
// On ne définit 'url' que pour le développement local où on veut forcer localhost
const baseUrl = process.env.NODE_ENV === "development" 
  ? "http://localhost:3000" 
  : undefined; // undefined = laisser trustHost faire l'auto-détection

if (!process.env.DISCORD_CLIENT_ID) {
  console.error("❌ DISCORD_CLIENT_ID is missing");
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  console.error("❌ DISCORD_CLIENT_SECRET is missing");
}
if (!AUTH_SECRET) {
  console.error("❌ AUTH_SECRET or NEXTAUTH_SECRET is missing");
}
// Debug: logger la configuration
if (process.env.NODE_ENV === "development") {
  console.log(`✅ NextAuth configured with URL: ${baseUrl} (dev mode - forced localhost)`);
} else {
  console.log(`✅ NextAuth using auto-detection via trustHost (supports multiple domains)`);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: AUTH_SECRET || undefined,
  basePath: "/api/auth",
  // En dev: forcer localhost. En prod: undefined = trustHost détecte automatiquement le domaine
  ...(baseUrl && { url: baseUrl }),
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
      // En développement, forcer l'utilisation de localhost
      const redirectBaseUrl = process.env.NODE_ENV === "development" 
        ? "http://localhost:3000" 
        : baseUrl;
      
      // Si l'URL est relative, la convertir en URL absolue
      if (url.startsWith("/")) {
        return `${redirectBaseUrl}${url}`;
      }
      
      // Si l'URL est sur le même domaine, l'utiliser
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === new URL(redirectBaseUrl).origin) {
          return url;
        }
      } catch {
        // Si l'URL n'est pas valide, continuer
      }
      
      // Sinon, rediriger vers la base
      return redirectBaseUrl;
    },
  },
});
