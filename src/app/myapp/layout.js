import Sidebar from "@/components/layout/Sidebar";

export default async function PazienteLayout({ children }) {
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