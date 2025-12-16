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

  // Créer la réponse
  let response: NextResponse;
  
  // Si la route est publique, autoriser l'accès
  if (isPublicRoute) {
    response = NextResponse.next();
  } else {
    // Pour les routes protégées, vérifier la présence d'un cookie de session
    const sessionToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");

    // Si pas de cookie de session, rediriger vers la connexion
    if (!sessionToken) {
      const signInUrl = new URL("/api/auth/signin/discord", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Autoriser l'accès si un cookie de session est présent
    response = NextResponse.next();
  }

  // Headers de cache pour les ressources statiques
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Cache pour les pages statiques avec ISR
  else if (pathname === "/" || pathname.startsWith("/classes") || pathname.startsWith("/morebuild")) {
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  }
  // Cache pour les API routes publiques
  else if (pathname.startsWith("/api/auth")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  // Pas de cache pour les pages dynamiques
  else {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  }

  // Compression
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
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

