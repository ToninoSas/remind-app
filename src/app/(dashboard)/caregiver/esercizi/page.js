"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { getExercisesAction, softDeleteExerciseAction } from "@/app/actions/excercises";
import CreateExerciseForm from "@/app/components/layout/caregiver/CreateExcerciseForm";
import ExercisePreview from "@/app/components/layout/caregiver/ExercisePreview";

export default function EserciziPage() {
  const { user } = useAuth();

  // Stati per la gestione dei dati e della vista
  const [esercizi, setEsercizi] = useState([]);
  const [view, setView] = useState("list"); // "list" | "form"
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tutti");
  const [previewExercise, setPreviewExercise] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Funzione per caricare gli esercizi dal DB
  const loadExercises = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await getExercisesAction(user.id);
    setEsercizi(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Gestione navigazione interna
  const handleOpenCreate = () => {
    setSelectedExercise(null);
    setView("form");
  };

  const handleOpenEdit = (esercizio) => {
    setSelectedExercise(esercizio);
    setView("form");
  };

  const handleCloseForm = () => {
    setView("list");
    loadExercises(); // Rinfresca la lista dopo salvataggio o chiusura
  };

  const handleDelete = async (id) => {
    const res = await softDeleteExerciseAction(id);
    if (res.success) {
      setIsDeletingId(null);
      loadExercises(); // Ricarica la lista
    } else {
      alert(res.error);
    }
  };

  // Logica di filtraggio
  const filteredEsercizi = esercizi.filter(ex =>
    filter === "tutti" || ex.tipo === filter
  );

  // Helper per icone e colori
  const getBadgeStyle = (tipo) => {
    switch (tipo) {
      case 'memoria': return 'bg-purple-100 text-purple-700';
      case 'calcolo': return 'bg-blue-100 text-blue-700';
      case 'quiz': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading && esercizi.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* VISTA: FORM (CREAZIONE O MODIFICA) */}
      {view === "form" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setView("list")}
            className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-colors"
          >
            <span>←</span> Torna alla Libreria
          </button>

          <CreateExerciseForm
            onSave={handleCloseForm}
            initialData={selectedExercise}
            key={selectedExercise?.id || "nuovo-esercizio"}
          />
        </div>
      ) : (

        /* VISTA: LISTA ESERCIZI */
        <div className="animate-in fade-in duration-500">

          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
                Libreria Esercizi
              </h1>
              <p className="text-slate-500 font-medium">
                Sviluppa e personalizza le attività per il supporto cognitivo.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              + Nuovo Esercizio
            </button>
          </div>

          {/* Barra dei Filtri */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {['tutti', 'memoria', 'calcolo', 'quiz'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 rounded-full font-bold text-sm capitalize whitespace-nowrap transition-all ${filter === t
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Griglia Card */}
          {filteredEsercizi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEsercizi.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col h-full"
                  onClick={() => setPreviewExercise(ex)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${getBadgeStyle(ex.tipo)}`}>
                      {ex.tipo}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i < ex.livello_difficolta ? 'bg-orange-400' : 'bg-slate-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {ex.titolo}
                  </h3>

                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {ex.descrizione || "Nessuna descrizione clinica inserita per questo esercizio."}
                  </p>

                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">ID: #{ex.id}</span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOpenEdit(ex)}
                        className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        ✏️ MODIFICA
                      </button>

                      <button
                        onClick={() => setIsDeletingId(ex.id)}
                        className="flex items-center gap-2 text-sm font-black text-red-400 hover:text-red-600 transition-colors"
                      >
                        🗑️ ELIMINA
                      </button>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          ) : (
            /* Stato Vuoto */
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ancora nessun esercizio</h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-8">
                Inizia a popolare la tua libreria creando il primo esercizio personalizzato.
              </p>
              <button
                onClick={handleOpenCreate}
                className="text-blue-600 font-bold hover:underline"
              >
                Clicca qui per iniziare
              </button>
            </div>
          )}
        </div>
      )}
      {previewExercise && (
        <ExercisePreview
          esercizio={previewExercise}
          onClose={() => setPreviewExercise(null)}
        />
      )}

      {isDeletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-2">Eliminare l'esercizio?</h3>
            <p className="text-slate-500 text-sm mb-8">
              Verrà rimosso dalla libreria ma i risultati passati dei pazienti verranno conservati.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
}