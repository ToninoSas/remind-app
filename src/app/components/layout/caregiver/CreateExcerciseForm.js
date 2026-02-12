"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createExerciseAction, updateExerciseAction } from "@/app/actions/excercises";
import { uploadMediaAction } from "@/app/actions/upload";

export default function CreateExerciseForm({ onSave, initialData = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState(initialData?.Tipo || "quiz");
  const [titolo, setTitolo] = useState(initialData?.Titolo || "");
  const [descrizione, setDescrizione] = useState(initialData?.Descrizione || "");
  const [difficolta, setDifficolta] = useState(initialData?.Livello_Difficolta || 1);

  // Stato unico per il contenuto (che siano domande o tessere)
  const [items, setItems] = useState(() => {
    if (initialData?.Contenuto_Json) {
      const parsed = JSON.parse(initialData.Contenuto_Json);
      return parsed.items || [];
    }
    return [{ id: Date.now(), testo: "", media: null, opzioni: [{ testo: "", isCorretta: false }] }];
  });

  const addItem = () => {
    setItems([...items, { id: Date.now(), testo: "", media: null, opzioni: [{ testo: "", isCorretta: false }] }]);
  };

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      titolo, tipo, descrizione, difficolta: parseInt(difficolta),
      contenuto: { tipo, items } // Salviamo tutto sotto 'items' per uniformità
    };

    const res = initialData 
      ? await updateExerciseAction(initialData.ID, payload)
      : await createExerciseAction(payload, user.ID);

    if (res.success) onSave();
    else alert(res.error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-xl max-w-4xl mx-auto border border-slate-100">
      <h2 className="text-3xl font-black text-slate-800 mb-8 italic">
        {initialData ? "Modifica Attività" : "Nuova Configurazione"}
      </h2>

      {/* Info Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold">
            <option value="quiz">🧩 Quiz a risposta multipla</option>
            <option value="calcolo">🔢 Calcolo e Resti</option>
            <option value="memoria">🧠 Memory (Coppie)</option>
          </select>
          <input value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="Titolo Esercizio" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" />
        </div>
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficoltà: {difficolta}</label>
          <input type="range" min="1" max="5" value={difficolta} onChange={e => setDifficolta(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-blue-600" />
          <textarea value={descrizione} onChange={e => setDescrizione(e.target.value)} placeholder="Obiettivo dell'esercizio..." className="w-full p-4 bg-slate-50 border rounded-2xl h-[100px] resize-none" />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800">Struttura {tipo === 'memoria' ? 'Tessere' : 'Quesiti'}</h3>
        
        {items.map((item, idx) => (
          <div key={item.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative">
            <button type="button" onClick={() => removeItem(idx)} className="absolute top-6 right-6 text-red-400 text-xs font-black uppercase">Elimina</button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parte Media (Immagine Tessera o Domanda) */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase">Immagine Supporto</label>
                <input type="file" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await uploadMediaAction(formData);
                  if (res.success) {
                    const ni = [...items];
                    ni[idx].media = { url: res.url, tipo: file.type.split('/')[0] };
                    setItems(ni);
                  }
                }} className="text-xs" />
                {item.media && <img src={item.media.url} className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm" />}
              </div>

              {/* Testo (Tessera o Domanda) */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  {tipo === 'memoria' ? 'Testo della Tessera' : 'Testo della Domanda'}
                </label>
                <input 
                  value={item.testo} 
                  onChange={e => { const ni = [...items]; ni[idx].testo = e.target.value; setItems(ni); }}
                  className="w-full p-4 bg-white border rounded-2xl font-bold" 
                  placeholder={tipo === 'memoria' ? "Es: Mela" : "Es: Di che colore è...?"}
                />
              </div>
            </div>

            {/* Sotto-sezione Risposte (SOLO per Quiz/Calcolo) */}
            {tipo !== 'memoria' && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Opzioni di risposta</label>
                 {item.opzioni.map((opt, oIdx) => (
                   <div key={oIdx} className="flex gap-2">
                     <button 
                       type="button"
                       onClick={() => {
                         const ni = [...items];
                         ni[idx].opzioni[oIdx].isCorretta = !ni[idx].opzioni[oIdx].isCorretta;
                         setItems(ni);
                       }}
                       className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black transition-all ${opt.isCorretta ? 'bg-green-500 border-green-500 text-white' : 'bg-white text-slate-200'}`}
                     >
                       {opt.isCorretta ? '✓' : ''}
                     </button>
                     <input 
                       value={opt.testo}
                       onChange={e => {
                         const ni = [...items];
                         ni[idx].opzioni[oIdx].testo = e.target.value;
                         setItems(ni);
                       }}
                       className="flex-1 p-3 bg-white border rounded-xl"
                       placeholder="Scrivi risposta..."
                     />
                   </div>
                 ))}
                 <button type="button" onClick={() => {
                   const ni = [...items];
                   ni[idx].opzioni.push({ testo: "", isCorretta: false });
                   setItems(ni);
                 }} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">+ Aggiungi Opzione</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <button type="button" onClick={addItem} className="flex-1 py-5 border-2 border-dashed border-slate-200 rounded-[2rem] font-black text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all">
          + AGGIUNGI {tipo === 'memoria' ? 'TESSERA' : 'DOMANDA'}
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-blue-600 transition-all">
          {loading ? "SALVATAGGIO..." : "CONFERMA E SALVA"}
        </button>
      </div>
    </form>
  );
}