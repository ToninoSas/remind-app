import "@/app/globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata = {
  title: "Remind",
  description: "Piattaforma di riabilitazione cognitiva",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="antialiased bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
        <footer className="p-8 text-center text-slate-600 text-sm font-medium">
          © 2026 Remind — Tecnologia al servizio dell'assistenza.
        </footer>
      </body>
    </html>
  );
}