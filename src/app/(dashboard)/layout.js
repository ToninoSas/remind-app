import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({ children }) {
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