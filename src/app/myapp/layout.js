import Sidebar from "@/components/layout/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PazienteLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("user-role")?.value;
  const token = cookieStore.get("auth-token")?.value;

  // gestire logout e redirect se non autenticato o ruolo errato


  return (
    <div className="flex min-h-screen">
      {/* La Sidebar appare solo per le rotte in questo gruppo */}
      <Sidebar />

      <main className="flex-1 p-4 md:p-10 bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
}