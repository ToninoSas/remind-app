"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createExerciseAction, updateExerciseAction } from "@/app/actions/excercises";
import { uploadMediaAction } from "@/app/actions/upload";

export default function CreateExerciseForm({ onSave, initialData = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- STATO INIZIALE ---
  const [titolo, setTitolo] = useState(initialData?.titolo || "");
  const [tipo, setTipo] = useState(initialData?.tipo || "quiz");
  const [difficolta, setDifficolta] = useState(initialData?.livello_difficolta || 1);
  const [descrizione, setDescrizione] = useState(initialData?.descrizione || "");

  // Inizializzazione domande (parsing se in modifica, altrimenti struttura base)
  const [domande, setDomande] = useState(() => {
    // se sono in modifica devo caricare gli input con i campi vecchi
    if (initialData?.contenuto_json) {
      try {
        return JSON.parse(initialData.contenuto_json).domande;
      } catch (e) {
        console.error("Errore parsing domande:", e);
      }
    }
    return [{
      id: Date.now(),
      testo: "",
      scenario: "",
      opzioni: [
        { testo: "", isCorretta: false },
        { testo: "", isCorretta: false }
      ]
    }];
  });

  /* 
  Quando aggiorno le domande, creo una copia della lista, 
  perchè se aggiorno la lista corrente il riferimento rimane uguale e l'interfaccia non si aggiorna
  */

  // --- LOGICA GESTIONE DOMANDE ---
  // quando devo aggiungere una nuova domanda, prendo le domande vecchie e ne aggiungo una vuota
  const addDomanda = () => {
    setDomande([...domande, {
      id: Date.now(),
      testo: "",
      scenario: "",
      opzioni: [{ testo: "", isCorretta: false }, { testo: "", isCorretta: false }]
    }]);
  };

  // dato un index, rimuovo la domanda a quell index
  const removeDomanda = (index) => {
    if (domande.length > 1) {
      setDomande(domande.filter((_, i) => i !== index));
    }
  };

  // --- LOGICA GESTIONE OPZIONI ---
  // dato un index, accedo a domande[index] e aggiungo un opzione vuota
  const addOpzione = (qIndex) => {
    const newDomande = [...domande];
    newDomande[qIndex].opzioni.push({ testo: "", isCorretta: false });
    setDomande(newDomande);
  };

  // dato l'indice della domanda e l'indice dell'opzione, 
  const removeOpzione = (qIndex, oIndex) => {
    const newDomande = [...domande];
    if (newDomande[qIndex].opzioni.length > 2) {
      // alla posizione oIndex, rimuovi 1 elemento
      newDomande[qIndex].opzioni.splice(oIndex, 1);
      setDomande(newDomande);
    }
  };

  // dato l'indice della domanda e l'indice dell'opzione
  // inverto lo stato isCorretta
  const toggleCorretta = (qIndex, oIndex) => {
    const newDomande = [...domande];
    newDomande[qIndex].opzioni[oIndex].isCorretta = !newDomande[qIndex].opzioni[oIndex].isCorretta;
    setDomande(newDomande);
  };

  // dato l'indice della domanda e l'indice dell'opzione aggiorna il testo
  const updateOpzioneTesto = (qIndex, oIndex, valore) => {
    const newDomande = [...domande];
    newDomande[qIndex].opzioni[oIndex].testo = valore;
    setDomande(newDomande);
  };

  // --- SALVATAGGIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titolo.trim()) return alert("Inserisci un titolo");

    // Controllo che ogni domanda abbia almeno una risposta corretta
    const isValido = domande.every(q => q.opzioni.some(opt => opt.isCorretta));
    if (!isValido) return alert("Ogni domanda deve avere almeno una risposta corretta!");

    setLoading(true);
    const payload = {
      titolo, tipo, descrizione, difficolta: parseInt(difficolta),
      contenuto: { tipo, domande }
    };

    // se erano presenti dei dati iniziali (quindi ero in modalità modifica) modifico
    // altrimeni creo
    const res = initialData
      ? await updateExerciseAction(initialData.id, payload)
      : await createExerciseAction(payload, user.id);

    if (res.success) {
      onSave();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] shadow-xl max-w-4xl mx-auto border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          {initialData ? "Modifica Esercizio" : "Nuovo Esercizio"}
        </h2>
        <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-bold text-sm">
          {tipo.toUpperCase()}
        </span>
      </div>

      {/* --- SEZIONE INFO GENERALI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Titolo</label>
            <input value={titolo} onChange={e => setTitolo(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Es: Gestione del resto" />
          </div>
          <div>
            {/* selezione tipo esercizio */}
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Categoria</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none">
              <option value="quiz">Quiz Cognitivo</option>
              <option value="calcolo">Calcolo Situazionale</option>
              <option value="memoria">Memoria Visiva</option>
            </select>
          </div>
        </div>
        {/* selettore difficoltà */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Difficoltà: {difficolta}</label>
            <input type="range" min="1" max="5" value={difficolta} onChange={e => setDifficolta(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Obiettivo</label>
            <textarea value={descrizione} onChange={e => setDescrizione(e.target.value)} rows="2" className="w-full p-4 bg-slate-50 border rounded-2xl resize-none" placeholder="Quale funzione cognitiva stiamo allenando?" />
          </div>
        </div>
      </div>

      {/* --- SEZIONE DOMANDE --- */}
      <div className="space-y-10">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🧩</span> Struttura Esercizio
        </h3>

        {domande.map((domanda, qIndex) => (
          <div key={domanda.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 relative animate-in fade-in slide-in-from-bottom-2">
            <button type="button" onClick={() => removeDomanda(qIndex)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500">Elimina Quesito</button>

            <div className="space-y-6">
              {/* Scenario (Solo per Calcolo) */}
              {tipo === "calcolo" && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Scenario Quotidiano</label>
                  <textarea
                    value={domanda.scenario}
                    onChange={e => { const nd = [...domande]; nd[qIndex].scenario = e.target.value; setDomande(nd); }}
                    className="w-full p-4 mt-1 bg-white border rounded-2xl text-sm"
                    placeholder="Descrivi la situazione (es: Sei alla cassa...)"
                  />
                </div>
              )}

              <div className="mt-6 p-6 bg-white border-2 border-dashed border-slate-100 rounded-[2rem]">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">
                  Media di supporto (Opzionale)
                </label>

                <div className="flex flex-wrap items-center gap-6">
                  <input
                    type="file"
                    accept="image/*,audio/*,video/*"
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append('file', file);

                      const res = await uploadMediaAction(formData);
                      if (res.success) {
                        const nd = [...domande];
                        nd[qIndex].media = {
                          url: res.url,
                          tipo: file.type.split('/')[0] // 'image', 'audio', o 'video'
                        };
                        setDomande(nd);
                      }
                    }}
                  />

                  {/* ANTEPRIMA MEDIA CARICATO */}
                  {domanda.media?.url && (
                    <div className="relative group animate-in zoom-in duration-300">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border shadow-sm bg-slate-50 flex items-center justify-center">
                        {domanda.media.tipo === 'image' && <img src={domanda.media.url} className="object-cover w-full h-full" />}
                        {domanda.media.tipo === 'audio' && <span className="text-3xl">🎵</span>}
                        {domanda.media.tipo === 'video' && <span className="text-3xl">🎥</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nd = [...domande];
                          delete nd[qIndex].media;
                          setDomande(nd);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Domanda Principale */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Domanda n.{qIndex + 1}</label>
                <input
                  value={domanda.testo}
                  onChange={e => { const nd = [...domande]; nd[qIndex].testo = e.target.value; setDomande(nd); }}
                  className="w-full p-4 mt-1 bg-white border rounded-2xl font-bold"
                  placeholder="Cosa deve rispondere il paziente?"
                />
              </div>

              {/* Opzioni Dinamiche */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Opzioni e Risposte Corrette</label>
                {domanda.opzioni.map((opt, oIndex) => (
                  <div key={oIndex} className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => toggleCorretta(qIndex, oIndex)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${opt.isCorretta ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-white text-slate-200 border'}`}
                    >
                      {opt.isCorretta ? '✓' : ''}
                    </button>
                    <input
                      value={opt.testo}
                      onChange={e => updateOpzioneTesto(qIndex, oIndex, e.target.value)}
                      className={`flex-1 p-4 rounded-xl border transition-all ${opt.isCorretta ? 'border-green-200 bg-green-50/30' : 'bg-white border-slate-200'}`}
                      placeholder={`Opzione ${oIndex + 1}`}
                    />
                    <button type="button" onClick={() => removeOpzione(qIndex, oIndex)} className="p-2 text-slate-300 hover:text-red-500">✕</button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOpzione(qIndex)}
                  className="text-xs font-bold text-blue-600 mt-2 hover:underline"
                >
                  + Aggiungi opzione
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- AZIONI FINALI --- */}
      <div className="mt-12 flex flex-col md:flex-row gap-4">
        <button type="button" onClick={addDomanda} className="flex-1 py-5 border-2 border-dashed border-slate-200 rounded-3xl font-bold text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all">
          + Aggiungi un altro quesito
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {loading ? "Salvataggio..." : (initialData ? "Aggiorna Esercizio" : "Pubblica Esercizio")}
        </button>
      </div>
    </form>
  );
}