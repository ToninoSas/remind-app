"use client";
import { useState, useEffect, use, useCallback } from "react";
import {
  getDetailedPatientAction,
  updatePatientAction,
  softDeletePatientAction,
} from "@/actions/patients";
import {
  assignExerciseAction,
  unassignExerciseAction,
} from "@/actions/assignments";
import StatistichePaziente from "@/components/layout/caregiver/StatistichePaziente";
import AssignModal from "@/components/layout/caregiver/AssignModel";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SchedaPaziente({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState("anagrafica");
  const [data, setData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const loadPatientData = useCallback(async () => {
    const res = await getDetailedPatientAction(patientId);
    if (res) {
      setData(res);
      setEditData({
        nome: res.info.Nome,
        cognome: res.info.Cognome,
        email: res.info.Email,
        patologia: res.info.Patologia,
        descrizione: res.info.Descrizione,
      });
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  const handleSave = async () => {
    setLoading(true);
    const res = await updatePatientAction(
      patientId,
      data.info.Utente_id,
      editData
    );
    if (res.success) {
      await loadPatientData();
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const res = await softDeletePatientAction(patientId);
    if (res.success) {
      router.push("/caregiver/pazienti");
    } else {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  const handleAssign = async (esercizioId) => {
    const res = await assignExerciseAction(patientId, esercizioId);
    if (res.success) {
      setShowAssignModal(false);
      loadPatientData();
    } else {
      alert(res.error);
    }
  };

  const handleUnassign = async (assegnazioneId) => {
    if (!confirm("Vuoi davvero rimuovere questo esercizio assegnato?")) return;
    const res = await unassignExerciseAction(assegnazioneId, patientId);
    if (res.success) {
      await loadPatientData();
    } else {
      alert(res.error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-slate-800 animate-pulse">
        Caricamento cartella clinica...
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center font-bold text-slate-900">
        Paziente non trovato.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Navigazione Back - Testo scurito */}
      <button
        onClick={() => router.push("/caregiver/pazienti")}
        className="group flex items-center gap-2 text-slate-800 hover:text-blue-700 transition-colors font-black ml-2"
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 transition-all">
          ←
        </div>
        Torna alla lista pazienti
      </button>

      {/* Success Toast - Rinforzato */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-950 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <span className="text-blue-400 font-black">✓</span>
            <span className="font-black text-sm uppercase tracking-widest">
              Dati aggiornati
            </span>
          </div>
        </div>
      )}

      {/* Header Profilo - Bordi e Testi rinforzati */}
      <header className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-300">
        <div className="w-20 h-20 rounded-3xl bg-blue-700 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-100">
          {data.info.Nome[0]}
          {data.info.Cognome[0]}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">
            {data.info.Nome} {data.info.Cognome}
          </h1>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded-lg font-black border border-blue-100 uppercase tracking-wider">
              {data.info.Patologia}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-black border border-slate-200">
              ID: #{patientId}
            </span>
          </div>
        </div>
      </header>

      {/* Tabs - Contrasto aumentato */}
      <div className="flex gap-2 p-1.5 bg-slate-200 rounded-[1.5rem] w-fit">
        {["anagrafica", "esercizi", "statistiche"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab
                ? "bg-white text-blue-800 shadow-md"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            {tab}
          </button>
        ))}
        <Link
          href={`/pazienti/${patientId}/ricordi`}
          className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-slate-700 hover:text-slate-950"
        >
          📸 Box Ricordi
        </Link>
      </div>

      {/* Contenuto Dinamico - Bordo Slate 300 */}
      <div className="bg-white p-8 rounded-[3rem] shadow-md border border-slate-300 min-h-[450px]">
        {activeTab === "anagrafica" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Dati della Cartella
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl font-black text-xs hover:bg-blue-50 hover:text-blue-800 transition-all"
                >
                  MODIFICA DATI
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-800 font-black text-xs uppercase px-4"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-700 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg"
                  >
                    SALVA
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">
                      Profilo Clinico
                    </p>
                    <p className="text-slate-950 font-black text-lg mb-1">
                      {data.info.Patologia}
                    </p>
                    <p className="text-slate-800 leading-relaxed italic font-medium">
                      "
                      {data.info.Descrizione ||
                        "Nessuna nota descrittiva presente."}
                      "
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">
                      Dati di Accesso
                    </p>
                    <p className="text-slate-950 font-black text-lg">
                      {data.info.Nome} {data.info.Cognome}
                    </p>
                    <p className="text-slate-800 font-bold">
                      {data.info.Email}
                    </p>
                    <p className="text-[10px] text-slate-700 mt-2 font-black italic">
                      Iscritto il: {data.info.Data_Creazione}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* INPUT MODIFICA - Sfondo bianco e testo nero */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                      Nome
                    </label>
                    <input
                      value={editData.nome}
                      onChange={(e) =>
                        setEditData({ ...editData, nome: e.target.value })
                      }
                      className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                      Cognome
                    </label>
                    <input
                      value={editData.cognome}
                      onChange={(e) =>
                        setEditData({ ...editData, cognome: e.target.value })
                      }
                      className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                      Email Accesso
                    </label>
                    <input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                      Note Cliniche
                    </label>
                    <textarea
                      value={editData.descrizione}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          descrizione: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-medium rounded-2xl mt-1 resize-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-12 mt-12 border-t border-slate-200">
              <div className="bg-red-50 p-8 rounded-[2rem] border border-red-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-red-900 font-black text-lg tracking-tight">
                    Zona Pericolo
                  </h4>
                  <p className="text-red-800 text-xs font-bold leading-relaxed">
                    L'eliminazione del paziente è di tipo logico. I dati
                    rimarranno nel database <br /> ma il paziente non potrà più
                    accedere e non sarà visibile nella lista.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="whitespace-nowrap bg-white text-red-700 border-2 border-red-300 px-8 py-3 rounded-2xl font-black text-xs hover:bg-red-700 hover:text-white transition-all shadow-md"
                >
                  DISATTIVA PAZIENTE
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "esercizi" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-950 tracking-tight italic">
                Piano di Riabilitazione
              </h3>
              <button
                onClick={() => setShowAssignModal(true)}
                className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-blue-800 transition-all"
              >
                + ASSEGNA NUOVO
              </button>
            </div>

            <div className="grid gap-4">
              {data.esercizi && data.esercizi.length > 0 ? (
                data.esercizi.map((ex, i) => (
                  <div
                    key={i}
                    className="group flex justify-between items-center p-6 bg-white rounded-[2.5rem] border border-slate-300 shadow-sm hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {ex.Tipo === "quiz"
                          ? "🧩"
                          : ex.Tipo === "calcolo"
                            ? "🔢"
                            : "🧠"}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-950 text-lg leading-tight">
                          {ex.Titolo}
                        </h4>
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.1em] mt-1">
                          {ex.Tipo} —{" "}
                          {new Date(ex.Data_Assegnazione).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {ex.Stato === "da_svolgere" && (
                        <button
                          onClick={() => handleUnassign(ex.assegnazione_id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-red-700 hover:text-red-900 uppercase tracking-widest px-4"
                        >
                          Annulla
                        </button>
                      )}
                      <span
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          ex.Stato === "completato"
                            ? "bg-green-100 text-green-900 border-green-200"
                            : "bg-orange-100 text-orange-900 border-orange-200"
                        }`}
                      >
                        {ex.Stato.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-300">
                  <p className="text-slate-800 font-black">
                    Nessun esercizio attivo per questo paziente.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "statistiche" && (
          <div className="animate-in fade-in duration-500">
            <StatistichePaziente stats={data.stats} />
          </div>
        )}
      </div>

      {/* Modals - Rinforzati i contrasti dei testi */}
      {showAssignModal && (
        <AssignModal
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300 border border-slate-300">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-red-200">
              ⚠️
            </div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">
              Confermi?
            </h3>
            <p className="text-slate-800 text-sm font-bold mb-10 leading-relaxed italic">
              Il profilo di <strong>{data.info.Nome}</strong> verrà disattivato.
              Potrai recuperarlo contattando l'assistenza database.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-4 font-black text-slate-800 uppercase text-xs tracking-widest hover:bg-slate-100 rounded-2xl"
              >
                Chiudi
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-200"
              >
                Disattiva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
