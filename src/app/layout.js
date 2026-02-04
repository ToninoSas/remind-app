import "@/app/globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata = {
  title: "CogniCare - Supporto Demenza",
  description: "Piattaforma di riabilitazione cognitiva",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="antialiased bg-slate-50">
        <AuthProvider>
          {/* Niente Sidebar qui! */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}