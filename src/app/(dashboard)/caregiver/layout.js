import Sidebar from "@/app/components/layout/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CaregiverLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("user-role")?.value;
  const token = cookieStore.get("auth-token")?.value;

  if (!token){
    return redirect("/login");
  }

  if (role !== "caregiver") {
    return redirect("/paziente");
  }

  return (
    <div className="flex min-h-screen">
      {/* La Sidebar appare solo per le rotte in questo gruppo */}
      <Sidebar />

      <main className="flex-1 p-4 md:p-10 bg-white md:m-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}