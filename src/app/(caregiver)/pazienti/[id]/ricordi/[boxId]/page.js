"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDetailedPatientAction } from "@/actions/patients";
import {
  getMemoryBoxDetailAction,
  deleteMemoryItemAction,
  deleteMemoryBoxAction,
} from "@/actions/memory";
import PatientContextBanner from "@/components/layout/caregiver/ricordi/PatientContextBanner";
import AddMemoryItemModal from "@/components/layout/caregiver/ricordi/AddMemoryItemModal";
import EditMemoryBoxModal from "@/components/layout/caregiver/ricordi/EditMemoryBoxModal"; // Nuovo
import EditMemoryItemModal from "@/components/layout/caregiver/ricordi/EditMemoryItemModal"; // Nuovo

// PAGINA DI DETTAGLIO SINGOLO BOX - MOSTRA TUTTI I RICORDI AL SUO INTERNO, CON AZIONI DI GESTIONE
export default function DettaglioBoxPage({ params }) {
  const router = useRouter();
  const { id, boxId } = React.use(params);

  const [paziente, setPaziente] = useState(null);
  const [boxInfo, setBoxInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stati per i Modali
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditBoxModal, setShowEditBoxModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const patientRes = await getDetailedPatientAction(id);
    const boxData = await getMemoryBoxDetailAction(boxId);
    if (patientRes) setPaziente(patientRes.info);
    if (boxData) {
      setBoxInfo(boxData.box);
      setItems(boxData.items);
    }
    setLoading(false);
  }, [id, boxId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteBox = async () => {
    if (
      !confirm(
        "Sei sicuro? Questo eliminerà il box e tutti i ricordi contenuti.",
      )
    )
      return;
    const res = await deleteMemoryBoxAction(boxId, id);
    if (res.success) router.push(`/pazienti/${id}/ricordi`);
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black text-slate-800">
        Caricamento...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PatientContextBanner paziente={paziente} />

      <div className="max-w-6xl mx-auto px-8">
        {/* Navigazione */}
        <Link
          href={`/pazienti/${id}/ricordi`}
          className="block mb-6 text-[10px] font-black text-slate-700 hover:text-blue-700 uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-xl bg-white shadow-sm transition-all"
        >
          ← Torna alla lista dei box
        </Link>

        {/* --- HEADER BOX (CON AZIONI) --- */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-300 shadow-xl relative mb-10">
          <div className="flex justify-between items-start mb-6">
            <div className="max-w-2xl">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                {boxInfo?.Categoria}
              </span>
              <h1 className="text-5xl font-black text-slate-950 tracking-tighter italic mt-3">
                {boxInfo?.Titolo}
              </h1>
            </div>
            {/* Pulsanti Gestione Box */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditBoxModal(true)}
                className="p-3 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl transition-all border border-slate-200"
              >
                ✏️ Modifica
              </button>
              <button
                onClick={handleDeleteBox}
                className="p-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all border border-red-100"
              >
                🗑️ Elimina
              </button>
            </div>
          </div>
          <p className="text-slate-800 text-lg font-medium italic border-l-4 border-slate-200 pl-6 mb-8">
            {boxInfo?.Descrizione}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-blue-700 transition-all"
          >
            + AGGIUNGI NUOVO RICORDO
          </button>
        </div>

        {/* --- GRIGLIA ITEM --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!items || items.length === 0 ? (
            <div className="col-span-full bg-white rounded-[2.5rem] border border-slate-300 shadow-lg p-8 text-center">
              <h3 className="text-2xl font-black text-slate-950 mb-4">
                Nessun ricordo trovato in questo box
              </h3>
              <p className="text-slate-800 text-sm font-medium italic">
                Aggiungi un nuovo ricordo per iniziare a raccogliere i momenti
                speciali.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.ID}
                className="bg-white rounded-[3rem] border border-slate-300 shadow-lg overflow-hidden group"
              >
                <div className="aspect-video bg-slate-100 border-b border-slate-200 flex items-center justify-center">
                  {item.Tipo === "foto" ? (
                    <img
                      src={item.Url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">
                      {item.Tipo === "audio" ? "🎵" : "🎥"}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-2xl font-black text-slate-950">
                        {item.Titolo}
                      </h4>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">
                        {item.Luogo} • {item.Datazione}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-slate-400 hover:text-blue-600 font-bold"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Eliminare?")) {
                            await deleteMemoryItemAction(item.ID, boxId, id);
                            loadData();
                          }
                        }}
                        className="text-red-300 hover:text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-800 font-medium italic leading-relaxed">
                    "{item.Testo}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODALI */}
      {showAddModal && (
        <AddMemoryItemModal
          boxId={boxId}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadData}
        />
      )}
      {showEditBoxModal && (
        <EditMemoryBoxModal
          box={boxInfo}
          pazienteId={id}
          onClose={() => setShowEditBoxModal(false)}
          onSuccess={loadData}
        />
      )}
      {editingItem && (
        <EditMemoryItemModal
          item={editingItem}
          boxId={boxId}
          pazienteId={id}
          onClose={() => setEditingItem(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
