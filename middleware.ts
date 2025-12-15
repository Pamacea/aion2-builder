import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

  // Pour les routes protégées, vérifier la présence d'un cookie de session
  // Note: La vérification complète de l'authentification se fait côté serveur dans les actions
  const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");

  // Si pas de cookie de session, rediriger vers la connexion
  if (!sessionToken) {
    const signInUrl = new URL("/api/auth/signin/discord", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Autoriser l'accès si un cookie de session est présent
  // La vérification réelle de la validité de la session se fait côté serveur
  return NextResponse.next();
}

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

