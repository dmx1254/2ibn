import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr", "es", "ar"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  // Vérifie si c'est une route protégée (profile)
  const isProtectedProfileRoute = /^\/(en|fr|es|ar)\/profile/.test(
    request.nextUrl.pathname
  );

  if (isProtectedProfileRoute) {
    // Utilise getToken de next-auth pour vérifier l'authentification
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirige vers la page de connexion en préservant la locale
      const locale = request.nextUrl.pathname.split("/")[1] || "en";
      const loginUrl = new URL(`/${locale}/signin`, request.url);
      // Ajoute l'URL de callback pour rediriger après la connexion
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (token && request.nextUrl.pathname.includes("reset-password")) {
      return NextResponse.redirect("/");
    }
  }

  // Applique le middleware i18n pour toutes les routes
  return I18nMiddleware(request);
}

export const config = {
  // Matcher mis à jour pour inclure toutes les routes localisées et protégées
  matcher: [
    // Routes protégées
    "/(en|fr|es)/profile/:path*",
    // Routes i18n (exclut les fichiers statiques et les API)
    "/((?!api|_next|static|.*\\..*|favicon.ico|robots.txt).*)",
  ],
};
