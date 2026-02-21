import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Recuperiamo il token o il ruolo dai cookie (impostati al login)
  const userRole = request.cookies.get("user-role")?.value;
  const isAuthenticated = !!request.cookies.get("auth-token")?.value;

  console.log("Middleware attivo su:", pathname, "| Ruolo:", userRole, "| Autenticato:", isAuthenticated);

  const isPublicRoute = pathname === "/login" || pathname === "/register" || pathname === "/";

  // 1. Se non è loggato e non è in /login, lo mandiamo al login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Se è loggato e prova ad andare su /login o /register, lo mandiamo alla sua home
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(
      new URL(userRole === "caregiver" ? "/pazienti" : "/myapp", request.url),
    );
  }

  // 3. Protezione Incrociata: Il Paziente non può uscire da /app
  if (userRole === "paziente" && !pathname.startsWith("/myapp")) {
    return NextResponse.redirect(new URL("/myapp", request.url));
  }

  // 4. Protezione Incrociata: Il Caregiver non deve finire in /app
  if (userRole === "caregiver" && pathname.startsWith("/myapp")) {
    return NextResponse.redirect(new URL("/pazienti", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Esclude:
     * 1. api (rotte API)
     * 2. _next/static (file statici generati da Next)
     * 3. _next/image (ottimizzazione immagini di Next)
     * 4. favicon.ico
     * 5. Estensioni file comuni (es. .png, .jpg, .svg, .webp, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|mp4|mp3|wav)$).*)",
  ],
};
