"use client";
import { useState, useEffect, useMemo } from "react";

const ICONE_MEMORY = ["🍎", "🐶", "🚗", "⚽", "🏠", "🍕", "🚲", "☀️"];
const ICONA_BACK = "🧠";

export default function ExercisePreview({ esercizio, onClose }) {
  if (!esercizio) return null;

  const contenuto = useMemo(() => {
    try {
      return typeof esercizio.Content_Json === "string"
        ? JSON.parse(esercizio.Content_Json)
        : esercizio.Content_Json;
    } catch (e) {
      return { items: [], numeroCoppie: 2 };
    }
  }, [esercizio]);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    if (esercizio.Type === "memoria") {
      const num = contenuto.numeroCoppie || 2;
      const selectedIcons = ICONE_MEMORY.slice(0, num);
      const deck = [...selectedIcons, ...selectedIcons]
        .map((icon, i) => ({ id: icon, uniqueKey: i }))
        .sort(() => Math.random() - 0.5);
      setCards(deck);
      setFlipped([]);
      setMatched([]);
    }
  }, [contenuto, esercizio.Type]);

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].uniqueKey)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].id === cards[secondIdx].id) {
        setMatched((prev) => [...prev, cards[firstIdx].uniqueKey, cards[secondIdx].uniqueKey]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    // Wrapper: Usiamo items-center per evitare che il contenuto scivoli troppo in alto o in basso
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4">
      
      {/* Container:
          - max-h-[95dvh]: Si adatta dinamicamente all'altezza dello schermo mobile
          - overflow-hidden + flex-col: Forza l'header e il footer a stare fermi mentre il centro scrolla
      */}
      <div className="relative bg-white w-full max-w-4xl max-h-[92dvh] sm:max-h-[90vh] rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        
        {/* --- HEADER (shrink-0 per non sparire) --- */}
        <div className="flex-none p-5 md:p-8 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="max-w-[75%]">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-lg border border-blue-200">
              Anteprima {esercizio.Type}
            </span>
            <h2 className="text-xl md:text-3xl font-black text-slate-950 mt-1 tracking-tight truncate">
              {esercizio.Title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 bg-white border border-slate-300 rounded-xl flex items-center justify-center text-lg font-black hover:bg-red-50 hover:text-red-600 transition-all"
          >
            ✕
          </button>
        </div>

        {/* --- AREA CONTENUTO (flex-1 + overflow-y-auto per lo scroll interno) --- */}
        <div className="flex-1 overflow-y-auto p-5 md:p-10 no-scrollbar">
          {esercizio.Type === "memoria" ? (
            <div className="flex flex-col items-center justify-center min-h-full py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 w-full max-w-xl">
                {cards.map((card, idx) => {
                  const isFlipped = flipped.includes(idx) || matched.includes(card.uniqueKey);
                  return (
                    <div key={idx} onClick={() => handleCardClick(idx)} className="relative aspect-square cursor-pointer" style={{ perspective: "1000px" }}>
                      <div className={`relative w-full h-full transition-all duration-500 shadow-lg rounded-[1.5rem] md:rounded-[2.5rem] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0 bg-blue-700 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-white text-3xl md:text-5xl font-black border-2 md:border-4 border-white shadow-inner" style={{ backfaceVisibility: "hidden" }}>
                          {ICONA_BACK}
                        </div>
                        <div className="absolute inset-0 bg-white border-2 md:border-4 border-blue-100 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl [transform:rotateY(180deg)] shadow-md" style={{ backfaceVisibility: "hidden" }}>
                          {card.id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {contenuto.items?.map((q, idx) => (
                <div key={idx} className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-xs">{idx + 1}</span>
                    <h4 className="font-black text-lg md:text-2xl text-slate-950 tracking-tight leading-tight">{q.testo}</h4>
                  </div>
                  {q.scenario && (
                    <div className="bg-blue-600 p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-white shadow-lg"><p className="font-bold text-base md:text-xl leading-relaxed">{q.scenario}</p></div>
                  )}
                  {q.media?.url && (
                    <div className="rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 bg-slate-50 p-4 flex justify-center overflow-hidden">
                      {q.media.tipo === "image" && <img src={q.media.url} className="max-h-48 md:max-h-64 rounded-xl" alt="Preview" />}
                      {q.media.tipo === "audio" && <audio controls src={q.media.url} className="w-full max-w-xs" />}
                      {q.media.tipo === "video" && <video controls src={q.media.url} className="max-h-48 md:max-h-64 w-full rounded-xl" />}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:ml-11">
                    {q.opzioni?.map((opt, oIdx) => (
                      <div key={oIdx} className={`p-4 rounded-xl border-2 flex items-center justify-between ${opt.isCorretta ? "bg-green-50 border-green-600 text-green-900" : "bg-white border-slate-200 text-slate-400 opacity-60"}`}>
                        <span className="font-black text-sm">{opt.testo}</span>
                        {opt.isCorretta && <span>✅</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- FOOTER (shrink-0) --- */}
        <div className="flex-none p-5 md:p-8 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            Chiudi Anteprima
          </button>
        </div>
      </div>
    </div>
  );
}