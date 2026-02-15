// src/app/caregiver/pazienti/[id]/ricordi/page.js
"use client";
import { useState, useEffect, use, useCallback } from "react";
import { getMemoryBoxesAction, deleteMemoryBoxAction } from "@/actions/memory";
import { getDetailedPatientAction } from "@/actions/patients";
import MemoryBoxList from "@/components/layout/caregiver/ricordi/MemoryBoxList";
import AddMemoryBoxModal from "@/components/layout/caregiver/ricordi/AddMemoryBoxModal";
import PatientContextBanner from "@/components/layout/caregiver/ricordi/PatientContextBanner";
import { useAuth } from "@/context/auth-context";

export default function RicordiPage({ params }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const pazienteId = resolvedParams.id; 

  const [boxes, setBoxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paziente, setPaziente] = useState(null);
  // Recupero ID paziente dall'URL

  const loadData = useCallback(async () => {
    // Carichiamo sia le info del paziente che i box
    const patientRes = await getDetailedPatientAction(pazienteId);
    const boxesData = await getMemoryBoxesAction(pazienteId);

    if (patientRes) setPaziente(patientRes.info);
    setBoxes(boxesData);
  }, [pazienteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <PatientContextBanner paziente={paziente} />

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-slate-950 italic">
          Scatola dei Ricordi
        </h1>
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition-all"
          >
            + NUOVO BOX
          </button>
          
        </div>
      </div>

      <MemoryBoxList boxes={boxes} pazienteId={pazienteId} />

      {showModal && (
        <AddMemoryBoxModal
          pazienteId={pazienteId}
          caregiverId={user.ID} // Dall'auth context
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
