import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/",
    "/api/auth",
    "/classes",
    "/build",
    "/morebuild",
    "/privacypolicy",
    "/termsofservice",
  ];

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Si la route est publique, autoriser l'accès
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    const signInUrl = new URL("/api/auth/signin/discord", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Autoriser l'accès si l'utilisateur est authentifié
  return NextResponse.next();
});

// Configuration du matcher pour spécifier les routes à protéger
// Le middleware s'exécutera sur toutes les routes sauf celles listées dans publicRoutes
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api/auth (routes d'authentification)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico, etc.
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

