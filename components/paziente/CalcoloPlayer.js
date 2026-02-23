"use client";
import { useState } from "react";

export default function CalcoloPlayer({ items, onStepComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);

  const item = items[currentIdx];

  const handleChoice = (isCorretta, index) => {
    if (isShowingFeedback) return;

    setSelectedIdx(index);
    setIsShowingFeedback(true);

    setTimeout(() => {
      setIsShowingFeedback(false);
      setSelectedIdx(null);

      if (currentIdx < items.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
      onStepComplete(isCorretta);
    }, 1500);
  };

  if (!item) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">
      
      {/* --- BOX SCENARIO (La "Storia") --- 
          Ridotto il raggio e il bordo su mobile per lasciare spazio al testo
      */}
      <div className="bg-blue-700 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border-[6px] sm:border-8 border-blue-100">
        <p className="text-[10px] sm:text-xs font-black text-blue-200 uppercase tracking-[0.2em] mb-2 sm:mb-4">
          Leggi con attenzione:
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight sm:leading-relaxed">
          {item.scenario}
        </h2>
      </div>

      {/* --- BOX DOMANDA NUMERICA --- 
          Testo scalato: text-4xl su mobile è già molto leggibile
      */}
      <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-4 border-slate-200 text-center shadow-lg">
        <h3 className="text-4xl sm:text-6xl font-black text-slate-950 italic tracking-tight">
          {item.testo}
        </h3>
      </div>

      {/* --- GRIGLIA RISPOSTE NUMERICHE --- 
          Manteniamo le 2 colonne per il confronto visivo, ma riduciamo i padding
      */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {item.opzioni.map((opt, i) => {
          let buttonStyle = "bg-white border-slate-300 text-slate-950 shadow-xl";

          if (isShowingFeedback) {
            if (opt.isCorretta) {
              buttonStyle = "bg-green-600 border-green-700 text-white scale-105 z-10 shadow-2xl";
            } else if (selectedIdx === i) {
              buttonStyle = "bg-red-600 border-red-700 text-white shadow-none";
            } else {
              buttonStyle = "opacity-10 border-slate-100 shadow-none";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleChoice(opt.isCorretta, i)}
              className={`
                p-6 sm:p-12 border-4 rounded-[2rem] sm:rounded-[3.5rem] 
                text-4xl sm:text-7xl font-black 
                transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4
                active:scale-90 touch-none
                ${buttonStyle}
              `}
            >
              {opt.testo}
              
              {/* Icone di feedback scalate per mobile */}
              {isShowingFeedback && opt.isCorretta && (
                <span className="text-3xl sm:text-5xl animate-bounce">✅</span>
              )}
              {isShowingFeedback && selectedIdx === i && !opt.isCorretta && (
                <span className="text-3xl sm:text-5xl">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progresso: Testo più piccolo su mobile */}
      <p className="text-center text-slate-400 font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] pt-2 sm:pt-4">
        Esercizio {currentIdx + 1} di {items.length}
      </p>
    </div>
  );
}