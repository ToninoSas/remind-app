import Sidebar from "@/components/layout/Sidebar";

export default function PatientLayout({ children }) {
  return (
    // 'h-screen' blocca l'altezza alla finestra del browser
    // 'overflow-hidden' impedisce a tutta la pagina di scrollare
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden bg-white">
      {/* La Sidebar: grazie a h-full nel suo codice, occuperà tutta l'altezza */}
      <Sidebar />

      {/* Area principale: flex-1 prende lo spazio rimasto, 
          overflow-y-auto permette lo scroll solo qui */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}