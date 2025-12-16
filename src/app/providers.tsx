'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuration optimisée du QueryClient pour de meilleures performances
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // StaleTime: garder les données en cache plus longtemps (5 minutes)
        staleTime: 5 * 60 * 1000, // 5 minutes
        // CacheTime: garder en cache pendant 10 minutes même si inutilisé
        gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime dans v5)
        // RefetchOnWindowFocus: ne pas refetch automatiquement quand on revient sur la fenêtre
        refetchOnWindowFocus: false,
        // Retry: moins de tentatives pour échouer plus vite en cas d'erreur
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: toujours créer un nouveau client
    return makeQueryClient();
  } else {
    // Browser: créer un singleton pour éviter de recréer le client à chaque render
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
