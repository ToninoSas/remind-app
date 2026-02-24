"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  createExerciseAction,
  updateExerciseAction,
} from "@/lib/actions/excercises";
import { uploadMediaAction } from "@/lib/actions/upload";
import Image from "next/image";

export default function CreateExerciseForm({ onSave, initialData = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- STATI (Invariati) ---
  const [tipo, setTipo] = useState(initialData?.Type || "quiz");
  const [titolo, setTitolo] = useState(initialData?.Title || "");
  const [descrizione, setDescrizione] = useState(initialData?.Description || "");
  const [difficolta, setDifficolta] = useState(initialData?.Difficulty_Level || 1);

  const [numeroCoppie, setNumeroCoppie] = useState(() => {
    if (initialData?.Type === "memoria" && initialData?.Content_Json) {
      const parsed = JSON.parse(initialData.Content_Json);
      return parsed.numeroCoppie || 2;
    }
    return 2;
  });

  const [items, setItems] = useState(() => {
    if (initialData?.Type !== "memoria" && initialData?.Content_Json) {
      const parsed = JSON.parse(initialData.Content_Json);
      return parsed.items || [];
    }
    return [{
      id: Date.now(),
      testo: "",
      scenario: "",
      media: null,
      opzioni: [{ testo: "", isCorretta: false }, { testo: "", isCorretta: false }],
    }];
  });

  // --- LOGICA GESTIONE (Invariata) ---
  const addItem = () => setItems([...items, { id: Date.now(), testo: "", scenario: "", media: null, opzioni: [{ testo: "", isCorretta: false }, { testo: "", isCorretta: false }] }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const addOpzione = (qIdx) => { const ni = [...items]; ni[qIdx].opzioni.push({ testo: "", isCorretta: false }); setItems(ni); };
  const removeOpzione = (qIdx, oIdx) => { const ni = [...items]; if (ni[qIdx].opzioni.length > 2) { ni[qIdx].opzioni.splice(oIdx, 1); setItems(ni); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titolo.trim()) return alert("Inserisci un titolo");
    setLoading(true);
    const payload = {
      titolo, tipo, descrizione, difficolta: parseInt(difficolta),
      contenuto: tipo === "memoria" ? { tipo, numeroCoppie: parseInt(numeroCoppie) } : { tipo, items },
    };
    const res = initialData ? await updateExerciseAction(initialData.Id, payload) : await createExerciseAction(payload, user.ProfileID);
    if (res.success) onSave();
    else alert(res.error);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl max-w-4xl mx-auto border border-slate-300"
    >
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 mb-8 italic">
        {initialData ? "Modifica Attività" : "Nuova Configurazione"}
      </h2>

      {/* --- SEZIONE 1: INFO BASE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Categoria Esercizio
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 focus:ring-4 focus:ring-blue-100 outline-none"
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
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 placeholder:text-slate-400 outline-none"
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
              type="range" min="1" max="5" value={difficolta}
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
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl h-[100px] resize-none font-medium text-slate-950"
              placeholder="Quale area cognitiva stiamo allenando?"
            />
          </div>
        </div>
      </div>

      {/* --- SEZIONE 2: LOGICA DINAMICA --- */}
      {tipo === "memoria" ? (
        <div className="p-6 md:p-10 bg-blue-50/50 rounded-[2.5rem] md:rounded-[3rem] border border-blue-300 animate-in zoom-in">
          <h3 className="text-xl font-black text-blue-900 mb-6">Configurazione Memory</h3>
          <div className="space-y-6">
            <label className="block text-center text-[10px] font-black text-blue-800 uppercase tracking-widest">
              Numero di coppie: <span className="text-3xl ml-2">{numeroCoppie}</span>
            </label>
            <input
              type="range" min="2" max="5" value={numeroCoppie}
              onChange={(e) => setNumeroCoppie(e.target.value)}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />
            <div className="flex justify-between text-[10px] font-black text-blue-400">
              <span>MIN: 2</span>
              <span>MAX: 5</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-slate-950">Struttura Quesiti</h3>
          {items.map((item, qIdx) => (
            <div
              key={item.id}
              className="p-6 md:p-8 bg-slate-50/50 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-300 relative shadow-sm"
            >
              <button
                type="button"
                onClick={() => removeItem(qIdx)}
                className="absolute top-6 right-8 text-red-600 font-black text-[10px] uppercase hover:underline"
              >
                Elimina
              </button>

              <div className="space-y-6 pt-4">
                {/* Scenario */}
                {tipo === "calcolo" && (
                  <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Scenario / Contesto</label>
                    <textarea
                      value={item.scenario}
                      onChange={(e) => { const ni = [...items]; ni[qIdx].scenario = e.target.value; setItems(ni); }}
                      className="w-full p-4 mt-1 bg-white border border-slate-300 rounded-2xl text-slate-950 italic"
                      placeholder="Es: Sei alla cassa e devi pagare..."
                    />
                  </div>
                )}

                {/* Media Supporto: Da riga a colonna su mobile */}
                <div className="flex flex-col gap-4 p-5 bg-white border border-slate-200 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supporto Multimediale</p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="flex-1 w-full relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-blue-50 transition-all cursor-pointer">
                      <input
                        type="file" accept="image/*,video/*,audio/*" className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0]; if (!file) return;
                          const formData = new FormData(); formData.append("file", file);
                          const res = await uploadMediaAction(formData);
                          if (res.success) {
                            const ni = [...items];
                            ni[qIdx].media = { url: res.url, tipo: file.type.split("/")[0] };
                            setItems(ni);
                          }
                        }}
                      />
                      <span className="text-2xl mb-1">📤</span>
                      <span className="text-[10px] font-black text-slate-950 uppercase">Carica file</span>
                    </label>

                    {item.media && (
                      <div className="shrink-0">
                         {item.media.tipo === 'image' ? (
                            <Image alt="Preview" width={80} height={80} src={item.media.url} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200" />
                         ) : (
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl border-2 border-slate-200">
                               {item.media.tipo === 'video' ? '🎥' : '🎵'}
                            </div>
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Domanda */}
                <div>
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Domanda n.{qIdx + 1}</label>
                  <input
                    value={item.testo}
                    onChange={(e) => { const ni = [...items]; ni[qIdx].testo = e.target.value; setItems(ni); }}
                    className="w-full p-4 mt-1 bg-white border border-slate-300 rounded-2xl font-black text-slate-950"
                    placeholder="Cosa deve rispondere il paziente?"
                  />
                </div>

                {/* Opzioni: Più spazio per il tocco */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Risposte</label>
                  {item.opzioni.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { const ni = [...items]; ni[qIdx].opzioni[oIdx].isCorretta = !ni[qIdx].opzioni[oIdx].isCorretta; setItems(ni); }}
                        className={`w-12 h-12 rounded-xl border-2 shrink-0 flex items-center justify-center font-black transition-all ${opt.isCorretta ? "bg-green-600 border-green-700 text-white" : "bg-white border-slate-300 text-slate-200"}`}
                      >
                        {opt.isCorretta ? "✓" : ""}
                      </button>
                      <input
                        value={opt.testo}
                        onChange={(e) => { const ni = [...items]; ni[qIdx].opzioni[oIdx].testo = e.target.value; setItems(ni); }}
                        className="flex-1 p-3 bg-white border border-slate-300 rounded-xl text-slate-950 font-bold text-sm"
                        placeholder="Opzione..."
                      />
                      <button type="button" onClick={() => removeOpzione(qIdx, oIdx)} className="text-red-300 hover:text-red-600 font-bold p-2">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOpzione(qIdx)} className="text-[10px] font-black text-blue-700 uppercase tracking-widest pl-1">+ Aggiungi Opzione</button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button" onClick={addItem}
            className="w-full py-6 border-2 border-dashed border-slate-300 rounded-[2.5rem] font-black text-slate-600 hover:bg-blue-50 hover:border-blue-300 transition-all text-sm uppercase tracking-widest"
          >
            + Aggiungi Quesito
          </button>
        </div>
      )}

      {/* --- AZIONE FINALE --- */}
      <div className="mt-12">
        <button
          type="submit" disabled={loading}
          className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-lg md:text-xl shadow-2xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "SALVATAGGIO..." : initialData ? "AGGIORNA ATTIVITÀ" : "PUBBLICA ESERCIZIO"}
        </button>
      </div>
    </form>
  );
}