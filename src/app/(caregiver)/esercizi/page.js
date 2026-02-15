"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { getExercisesAction, deleteExerciseAction } from "@/actions/excercises";
import CreateExerciseForm from "@/components/layout/caregiver/CreateExcerciseForm";
import ExercisePreview from "@/components/layout/caregiver/ExercisePreview";

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
  // senza useCallback ogni volta che renderizzo la pagina creo una nuova funziona
  // con useCallback invece non ne crea una nuova e ti restituisce quella che aveva
  const loadExercises = useCallback(async () => {
    if (!user?.ID) return;
    // imposto il caricamento
    setLoading(true); 
    // prendo gli esercizi
    const data = await getExercisesAction(user.ID);
    setEsercizi(data);
    setLoading(false);
    // una volta che ho gli esercizi caricati il caricamento è finito
  }, [user?.ID]);
  /*
  FUNZIONAMENTO useEffect
  ha una lista delle dipendenze
  - se non passo nulla -> viene eseguita a ogni render
  - lista vuota -> viene eseguita solo una volta (quando il componente viene creato)
  - valore -> viene eseguita all'inzio e ogni volta che il valore viene aggiornato
  */
 
  // useEffect vede loadExcercises è la esegue per la prima volta
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
    const res = await deleteExerciseAction(id);
    if (res.success) {
      setIsDeletingId(null);
      loadExercises(); // Ricarica la lista
    } else {
      alert(res.error);
    }
  };

  // Logica di filtraggio
  const filteredEsercizi = esercizi.filter(ex =>
    filter === "tutti" || ex.Tipo === filter
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

  // VIENE RESTITUITO DURANTE IL CARICAMENTO
  if (loading && esercizi.length === 0) {
    return (
       <div className="p-10 text-center">Caricamento cartella...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {view === "form" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setView("list")}
            className="mb-8 flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            <span className="text-lg">←</span> Torna alla Libreria
          </button>

          <CreateExerciseForm
            onSave={handleCloseForm}
            initialData={selectedExercise}
            // Usiamo ex.ID maiuscolo per la chiave
            key={selectedExercise?.ID || "nuovo-esercizio"}
          />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
                Libreria Esercizi
              </h1>
              <p className="text-slate-700 font-medium">
                Gestisci le attività cognitive personalizzate.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
            >
              + Nuovo Esercizio
            </button>
          </div>

          {/* Filtri */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {['tutti', 'memoria', 'calcolo', 'quiz'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${filter === t
                  ? 'bg-slate-800 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Griglia Card */}
          {filteredEsercizi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEsercizi.map((ex) => (
                <div
                  key={ex.ID}
                  className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full cursor-pointer"
                  onClick={() => setPreviewExercise(ex)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${getBadgeStyle(ex.Tipo)}`}>
                      {ex.Tipo}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i < ex.Livello_Difficolta ? 'bg-orange-400' : 'bg-slate-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {ex.Titolo}
                  </h3>

                  <p className="text-sm text-slate-700 line-clamp-3 mb-8 flex-grow leading-relaxed italic">
                    "{ex.Descrizione || "Nessuna specifica clinica inserita."}"
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">REF: #{ex.ID}</span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOpenEdit(ex)}
                        className="text-[10px] font-black text-blue-600 hover:underline tracking-widest"
                      >
                        MODIFICA
                      </button>

                      <button
                        onClick={() => setIsDeletingId(ex.ID)}
                        className="text-[10px] font-black text-red-400 hover:text-red-600 tracking-widest"
                      >
                        ELIMINA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Stato Vuoto */
            <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-6">🧩</div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Libreria Vuota</h3>
              <p className="text-slate-600 max-w-xs mx-auto mb-8 font-medium">
                Non hai ancora creato esercizi. Inizia ora per assegnarli ai tuoi pazienti.
              </p>
              <button
                onClick={handleOpenCreate}
                className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs border border-blue-100 shadow-sm hover:shadow-md transition-all"
              >
                CREA IL PRIMO ESERCIZIO
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modali */}
      {previewExercise && (
        <ExercisePreview
          esercizio={previewExercise}
          onClose={() => setPreviewExercise(null)}
        />
      )}

      {isDeletingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Eliminare?</h3>
            <p className="text-slate-700 text-sm font-medium mb-10 leading-relaxed italic">
              L'esercizio verrà rimosso permanentemente dalla libreria.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeletingId(null)}
                className="flex-1 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest"
              >
                Annulla
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-100"
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