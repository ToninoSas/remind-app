// app/caregiver/pazienti/page.jsx
import { Suspense } from "react";
import PatientList from "@/app/(caregiver)/pazienti/PatientList";
import AddPatientButton from "@/components/caregiver/gestionePazienti/AddPatientButton";
import { CardSkeleton } from "@/app/ui/skeletons";

export default async function ListaPazientiPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-12">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 py-6 md:py-10">
        
        {/* Gruppo Titolo: Allineato a sinistra su desktop, centrato o a sinistra su mobile */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-slate-950 leading-none">
            I Tuoi Pazienti
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            Gestione clinica e monitoraggio
          </p>
        </div>

        {/* Pulsante: occupa tutta la larghezza su mobile per facilitare il tocco */}
        <div className="w-full md:w-auto">
          <AddPatientButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* <Suspense fallback={<CardSkeleton />}> */}
          <PatientList />
        {/* </Suspense> */}
      </main>
    </div>
  );
}