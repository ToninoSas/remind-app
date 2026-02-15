"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  createExerciseAction,
  updateExerciseAction,
} from "@/actions/excercises";
import { uploadMediaAction } from "@/actions/upload";
import Image from "next/image";

export default function CreateExerciseForm({ onSave, initialData = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- 1. STATI BASE ---
  const [tipo, setTipo] = useState(initialData?.Tipo || "quiz");
  const [titolo, setTitolo] = useState(initialData?.Titolo || "");
  const [descrizione, setDescrizione] = useState(
    initialData?.Descrizione || ""
  );
  const [difficolta, setDifficolta] = useState(
    initialData?.Livello_Difficolta || 1
  );

  // --- 2. STATO PER MEMORY (2-5 coppie) ---
  const [numeroCoppie, setNumeroCoppie] = useState(() => {
    if (initialData?.Tipo === "memoria" && initialData?.Contenuto_Json) {
      const parsed = JSON.parse(initialData.Contenuto_Json);
      return parsed.numeroCoppie || 2;
    }
    return 2;
  });

  // --- 3. STATO PER QUIZ / CALCOLO (Items con domande e opzioni) ---
  const [items, setItems] = useState(() => {
    if (initialData?.Tipo !== "memoria" && initialData?.Contenuto_Json) {
      const parsed = JSON.parse(initialData.Contenuto_Json);
      return parsed.items || [];
    }
    return [
      {
        id: Date.now(),
        testo: "",
        scenario: "",
        media: null,
        opzioni: [
          { testo: "", isCorretta: false },
          { testo: "", isCorretta: false },
        ],
      },
    ];
  });

  // --- LOGICA GESTIONE ITEMS (QUIZ/CALCOLO) ---
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        testo: "",
        scenario: "",
        media: null,
        opzioni: [
          { testo: "", isCorretta: false },
          { testo: "", isCorretta: false },
        ],
      },
    ]);
  };

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const addOpzione = (qIdx) => {
    const ni = [...items];
    ni[qIdx].opzioni.push({ testo: "", isCorretta: false });
    setItems(ni);
  };

  const removeOpzione = (qIdx, oIdx) => {
    const ni = [...items];
    if (ni[qIdx].opzioni.length > 2) {
      ni[qIdx].opzioni.splice(oIdx, 1);
      setItems(ni);
    }
  };

  // --- SALVATAGGIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titolo.trim()) return alert("Inserisci un titolo");

    setLoading(true);
    const payload = {
      titolo,
      tipo,
      descrizione,
      difficolta: parseInt(difficolta),
      contenuto:
        tipo === "memoria"
          ? { tipo, numeroCoppie: parseInt(numeroCoppie) }
          : { tipo, items },
    };

    const res = initialData
      ? await updateExerciseAction(initialData.ID, payload)
      : await createExerciseAction(payload, user.ID);

    if (res.success) onSave();
    else alert(res.error);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-[3rem] shadow-xl max-w-4xl mx-auto border border-slate-300"
    >
      <h2 className="text-3xl font-black text-slate-950 mb-8 italic">
        {initialData ? "Modifica Attività" : "Nuova Configurazione"}
      </h2>

      {/* --- SEZIONE 1: INFO BASE (ALTO CONTRASTO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5 pb-5 border-slate-200">
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Categoria Esercizio
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="quiz">🧩 Quiz Cognitivo</option>
              <option value="calcolo">🔢 Calcolo Situazionale</option>
              <option value="memoria">🧠 Memory Semplificato</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Titolo Attività
            </label>
            <input
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 placeholder:text-slate-500 outline-none"
              placeholder="Es: Spesa al mercato"
            />
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Livello Difficoltà: {difficolta}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficolta}
              onChange={(e) => setDifficolta(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none accent-blue-700 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Note per il Caregiver
            </label>
            <textarea
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl h-[100px] resize-none font-medium text-slate-950 placeholder:text-slate-500"
              placeholder="Quale area cognitiva stiamo allenando?"
            />
          </div>
        </div>
      </div>

      {/* --- SEZIONE 2: LOGICA DINAMICA --- */}

      {tipo === "memoria" ? (
        /* FLUSSO MEMORY */
        <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-blue-300 animate-in zoom-in">
          <h3 className="text-xl font-black text-blue-900 mb-6">
            Configurazione Memory
          </h3>
          <div className="space-y-6">
            <label className="block text-center text-[10px] font-black text-blue-800 uppercase tracking-widest">
              Seleziona numero di coppie:{" "}
              <span className="text-3xl ml-2">{numeroCoppie}</span>
            </label>
            <input
              type="range"
              min="2"
              max="5"
              value={numeroCoppie}
              onChange={(e) => setNumeroCoppie(e.target.value)}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />
            <div className="flex justify-between text-[10px] font-black text-blue-400">
              <span>MIN: 2 COPPIE</span>
              <span>MAX: 5 COPPIE</span>
            </div>
          </div>
        </div>
      ) : (
        /* FLUSSO QUIZ E CALCOLO */
        <div className="space-y-5">
          <h3 className="text-2xl font-black text-slate-950">
            Struttura Quesiti
          </h3>
          {items.map((item, qIdx) => (
            <div
              key={item.id}
              className="p-8 bg-slate-50/50 rounded-[3.5rem] border border-slate-300 relative shadow-sm"
            >
              <button
                type="button"
                onClick={() => removeItem(qIdx)}
                className="absolute top-6 right-8 text-red-700 font-black text-xs uppercase hover:underline"
              >
                Elimina
              </button>

              <div className="space-y-6">
                {/* Scenario (Solo per Calcolo) */}
                {tipo === "calcolo" && (
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                      Scenario (Contesto per il paziente)
                    </label>
                    <textarea
                      value={item.scenario}
                      onChange={(e) => {
                        const ni = [...items];
                        ni[qIdx].scenario = e.target.value;
                        setItems(ni);
                      }}
                      className="w-full p-4 mt-1 bg-white border border-slate-300 rounded-2xl text-slate-950 italic"
                      placeholder="Es: Sei alla cassa e devi pagare 5 euro..."
                    />
                  </div>
                )}

                {/* Media Supporto */}
                <div className="flex items-center gap-6 p-4 bg-white border border-slate-200 rounded-2xl">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-800 uppercase block mb-2">
                      Immagine/Audio Supporto
                    </label>
                    <input
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await uploadMediaAction(formData);
                        if (res.success) {
                          const ni = [...items];
                          ni[qIdx].media = {
                            url: res.url,
                            tipo: file.type.split("/")[0],
                          };
                          setItems(ni);
                        }
                      }}
                      className="text-xs text-slate-950 font-bold"
                    />
                  </div>
                  {item.media && (
                    <Image
                    alt="Media di supporto"
                    width={30}
                    height={30}
                      src={item.media.url}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-slate-300"
                    />
                  )}
                </div>

                {/* Testo Domanda */}
                <div>
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                    Domanda n.{qIdx + 1}
                  </label>
                  <input
                    value={item.testo}
                    onChange={(e) => {
                      const ni = [...items];
                      ni[qIdx].testo = e.target.value;
                      setItems(ni);
                    }}
                    className="w-full p-4 mt-1 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 placeholder:text-slate-500"
                    placeholder="Cosa deve rispondere il paziente?"
                  />
                </div>

                {/* Opzioni di Risposta */}
                <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                    Opzioni e Risposta Corretta
                  </label>
                  {item.opzioni.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const ni = [...items];
                          ni[qIdx].opzioni[oIdx].isCorretta =
                            !ni[qIdx].opzioni[oIdx].isCorretta;
                          setItems(ni);
                        }}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black transition-all ${
                          opt.isCorretta
                            ? "bg-green-600 border-green-700 text-white"
                            : "bg-white border-slate-300 text-slate-200"
                        }`}
                      >
                        {opt.isCorretta ? "✓" : ""}
                      </button>
                      <input
                        value={opt.testo}
                        onChange={(e) => {
                          const ni = [...items];
                          ni[qIdx].opzioni[oIdx].testo = e.target.value;
                          setItems(ni);
                        }}
                        className="flex-1 p-3 bg-white border border-slate-300 rounded-xl text-slate-950 font-bold"
                        placeholder="Opzione di risposta..."
                      />
                      <button
                        type="button"
                        onClick={() => removeOpzione(qIdx, oIdx)}
                        className="text-slate-300 hover:text-red-600 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOpzione(qIdx)}
                    className="text-[10px] font-black text-blue-700 uppercase tracking-widest hover:underline"
                  >
                    + Aggiungi Opzione
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full py-6 border-2 border-dashed border-slate-300 rounded-[2.5rem] font-black text-slate-700 hover:text-blue-700 hover:border-blue-400 transition-all"
          >
            + AGGIUNGI UN ALTRO QUESITO
          </button>
        </div>
      )}

      {/* --- AZIONE FINALE --- */}
      <div className="mt-16">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading
            ? "SALVATAGGIO..."
            : initialData
            ? "AGGIORNA ESERCIZIO"
            : "PUBBLICA NELLA LIBRERIA"}
        </button>
      </div>
    </form>
  );
}
