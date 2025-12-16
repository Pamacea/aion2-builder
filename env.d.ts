/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AUTH_SECRET?: string;
    AUTH_URL?: string;
    NEXTAUTH_SECRET?: string; // Alias pour compatibilité
    NEXTAUTH_URL?: string; // Alias pour compatibilité
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
  }
}
