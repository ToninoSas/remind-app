"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MemoryBoxList from "@/components/caregiver/gestioneRicordi/MemoryBoxList";
import AddMemoryBoxModal from "@/components/caregiver/gestioneRicordi/AddMemoryBoxModal";
import PatientContextBanner from "@/components/caregiver/gestioneRicordi/PatientContextBanner";

export default function MemoryManager({ initialBoxes, paziente, pazienteId, caregiverId }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    setShowModal(false);
    // router.refresh() ricarica i dati del Server Component senza perdere lo stato client
    router.refresh(); 
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Banner con info paziente (Dati passati dal server) */}
      <PatientContextBanner paziente={paziente} />

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-950 italic tracking-tight">
          Scatola dei Ricordi
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition-all active:scale-95"
        >
          + NUOVO BOX
        </button>
      </div>

      {/* Lista dei Box (Riceve i dati iniziali dal server) */}
      <MemoryBoxList boxes={initialBoxes} pazienteId={pazienteId} />

      {/* Modale di creazione */}
      {showModal && (
        <AddMemoryBoxModal
          pazienteId={pazienteId}
          caregiverId={caregiverId} // Ora arriva dal server via props
          onClose={() => setShowModal(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}