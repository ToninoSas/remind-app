"use client";
import { useState } from "react";

export default function CalcoloPlayer({ items, onStepComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null); // Traccia il tasto premuto
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);

  const item = items[currentIdx];

  const handleChoice = (isCorretta, index) => {
    if (isShowingFeedback) return; // Evita clic multipli durante il feedback

    setSelectedIdx(index);
    setIsShowingFeedback(true);

    // Registra il risultato per le statistiche
    onStepComplete(isCorretta);

    // Pausa di 1.5 secondi per mostrare se è giusto o sbagliato
    setTimeout(() => {
      setIsShowingFeedback(false);
      setSelectedIdx(null);

      if (currentIdx < items.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
    }, 1500);
  };

  if (!item) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* --- BOX SCENARIO (La "Storia") --- */}
      <div className="bg-blue-700 p-10 rounded-[4rem] shadow-2xl border-8 border-blue-100">
        <p className="text-xs font-black text-blue-200 uppercase tracking-[0.3em] mb-4">
          Leggi con attenzione:
        </p>
        <h2 className="text-4xl font-bold text-white leading-relaxed">
          {item.scenario}
        </h2>
      </div>

      {/* --- BOX DOMANDA NUMERICA --- */}
      <div className="bg-white p-10 rounded-[3rem] border-4 border-slate-200 text-center shadow-lg">
        <h3 className="text-6xl font-black text-slate-950 italic tracking-tight">
          {item.testo}
        </h3>
      </div>

      {/* --- GRIGLIA RISPOSTE NUMERICHE --- */}
      <div className="grid grid-cols-2 gap-8">
        {item.opzioni.map((opt, i) => {
          // Logica dinamica dei colori per il feedback
          let buttonStyle =
            "bg-white border-slate-300 text-slate-950 shadow-xl";

          if (isShowingFeedback) {
            if (opt.isCorretta) {
              // La risposta giusta diventa sempre VERDE
              buttonStyle =
                "bg-green-600 border-green-700 text-white scale-105 z-10 shadow-2xl";
            } else if (selectedIdx === i) {
              // Se il paziente ha cliccato questa ed è sbagliata, diventa ROSSA
              buttonStyle = "bg-red-600 border-red-700 text-white shadow-none";
            } else {
              // Le altre risposte spariscono quasi del tutto
              buttonStyle = "opacity-10 border-slate-100 shadow-none";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleChoice(opt.isCorretta, i)}
              className={`
                p-12 border-4 rounded-[3.5rem] text-7xl font-black 
                transition-all duration-300 flex items-center justify-center gap-4
                ${buttonStyle}
              `}
            >
              {opt.testo}
              {/* Icone di feedback */}
              {isShowingFeedback && opt.isCorretta && (
                <span className="text-5xl">✅</span>
              )}
              {isShowingFeedback && selectedIdx === i && !opt.isCorretta && (
                <span className="text-5xl">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progresso */}
      <p className="text-center text-slate-400 font-black uppercase tracking-[0.2em] pt-4">
        Esercizio {currentIdx + 1} di {items.length}
      </p>
    </div>
  );
}
