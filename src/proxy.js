import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Recuperiamo il token o il ruolo dai cookie (impostati al login)
  const userRole = request.cookies.get("user-role")?.value;
  const isAuthenticated = !!request.cookies.get("auth-token")?.value;

  console.log("Middleware attivo su:", pathname, "| Ruolo:", userRole, "| Autenticato:", isAuthenticated);

  // 1. Se non è loggato e non è in /login, lo mandiamo al login
  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Se è loggato e prova ad andare su /login o /register, lo mandiamo alla sua home
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
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

// Applichiamo il middleware a tutto tranne file statici e API
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
