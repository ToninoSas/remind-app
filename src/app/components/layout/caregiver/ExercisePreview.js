"use client";
import { useState, useEffect, useMemo } from "react";

export default function ExercisePreview({ esercizio, onClose }) {
  if (!esercizio) return null;

  const contenuto = useMemo(() => {
    try {
      return typeof esercizio.Contenuto_Json === 'string' 
        ? JSON.parse(esercizio.Contenuto_Json) 
        : esercizio.Contenuto_Json;
    } catch (e) { return { items: [] }; }
  }, [esercizio]);

  // --- LOGICA MEMORY ---
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Indici delle carte girate (max 2)
  const [matched, setMatched] = useState([]); // Indici delle carte accoppiate con successo

  useEffect(() => {
    if (esercizio.Tipo === 'memoria') {
      // Raddoppiamo le tessere e mescoliamo
      const pairCards = [...contenuto.items, ...contenuto.items]
        .map((c, i) => ({ ...c, uniqueId: i }))
        .sort(() => Math.random() - 0.5);
      setCards(pairCards);
    }
  }, [contenuto, esercizio.Tipo]);

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="p-10 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-100 px-4 py-1.5 rounded-xl">
              Anteprima {esercizio.Tipo}
            </span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{esercizio.Titolo}</h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
        </div>

        {/* Area di Gioco */}
        <div className="p-10 flex-1 overflow-y-auto">
          {esercizio.Tipo === 'memoria' ? (
            /* VISUALIZZAZIONE MEMORY */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {cards.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(idx);
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleCardClick(idx)}
                    className="relative aspect-square cursor-pointer group"
                    style={{ perspective: '1000px' }}
                  >
                    <div className={`relative w-full h-full transition-all duration-500 shadow-xl rounded-[2rem] transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Dorso (Dietro) */}
                      <div className="absolute inset-0 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black backface-hidden shadow-inner">
                        ?
                      </div>
                      {/* Fronte (Davanti) */}
                      <div className="absolute inset-0 bg-white border-4 border-blue-50 rounded-[2rem] flex flex-col items-center justify-center rotate-y-180 backface-hidden overflow-hidden p-4">
                         {card.media?.url ? (
                           <img src={card.media.url} className="w-full h-full object-cover rounded-2xl" />
                         ) : (
                           <span className="text-blue-600 font-black text-center text-sm">{card.testo}</span>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VISUALIZZAZIONE QUIZ / CALCOLO (Vedi codice precedente) */
            <div className="space-y-8">
               {contenuto.items.map((q, idx) => (
                 <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h4 className="font-bold text-lg mb-4">{q.testo}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.opzioni.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-4 rounded-xl border-2 font-bold ${opt.isCorretta ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                          {opt.testo} {opt.isCorretta && '✓'}
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t flex justify-center">
           <button onClick={onClose} className="px-12 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">
             Esci dall'anteprima
           </button>
        </div>
      </div>
    </div>
  );
}