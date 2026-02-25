import Sidebar from "@/components/layout/Sidebar";

export default function CaregiverLayout({ children }) {
  return (
    // 'h-screen' blocca l'altezza alla finestra del browser
    // 'overflow-hidden' impedisce a tutta la pagina di scrollare

    <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
      {/* La Sidebar: grazie a h-full nel suo codice, occuperà tutta l'altezza */}
     <Sidebar />

      {/* Area principale: flex-1 prende lo spazio rimasto, 
          overflow-y-auto permette lo scroll solo qui */}
      <main className="flex-1 bg-slate-50 lg:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
