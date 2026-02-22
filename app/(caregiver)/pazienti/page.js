// app/caregiver/pazienti/page.jsx
import { Suspense } from "react";
import PatientList from "@/app/(caregiver)/pazienti/PatientList";
import AddPatientButton from "@/components/caregiver/gestionePazienti/AddPatientButton";
import { CardSkeleton } from "@/app/ui/skeletons";

export default async function ListaPazientiPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 p-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-950">
            I Tuoi Pazienti
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">
            Gestione clinica e monitoraggio
          </p>
        </div>
        <AddPatientButton />
      </header>

      {/* <Suspense fallback={<CardSkeleton />}> */}
        <PatientList />
      {/* </Suspense> */}
    </div>
  );
}
