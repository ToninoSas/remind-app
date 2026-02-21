"use client";
import { useState } from "react";

export default function QuizPlayer({ items, onStepComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null); // Traccia il tasto premuto
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);

  const item = items[currentIdx];

  const handleChoice = (isCorretta, index) => {
    if (isShowingFeedback) return; // Impedisce clic multipli

    setSelectedIdx(index);
    setIsShowingFeedback(true);

    

    // Pausa di 1.5 secondi prima di procedere
    setTimeout(() => {
      setIsShowingFeedback(false);
      setSelectedIdx(null);

      if (currentIdx < items.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }

      // Comunica il risultato al componente genitore per le statistiche
      // e va allo step "Feedback"
      onStepComplete(isCorretta);
    }, 1500);
  };

  if (!item) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* --- AREA DELLA DOMANDA (MEDIA + TESTO) --- */}
      <div className="bg-white rounded-[3.5rem] border-4 border-slate-200 shadow-2xl overflow-hidden">
        {item.media && item.media.url && (
          <div className="w-full bg-slate-100 border-b-4 border-slate-200">
            {item.media.tipo === "image" && (
              <img
                src={item.media.url}
                alt="Illustrazione domanda"
                className="w-full h-auto max-h-[450px] object-contain mx-auto"
              />
            )}

            {item.media.tipo === "video" && (
              <video
                src={item.media.url}
                controls
                className="w-full max-h-[450px]"
              />
            )}

            {item.media.tipo === "audio" && (
              <div className="p-12 flex flex-col items-center space-y-4">
                <span className="text-9xl mb-2">🔊</span>
                <audio src={item.media.url} controls className="w-full" />
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-4">
                  Ascolta con attenzione
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-12">
          <h2 className="text-5xl font-black text-slate-950 text-center leading-tight tracking-tight">
            {item.testo}
          </h2>
        </div>
      </div>

      {/* --- AREA DELLE RISPOSTE (BOTTONI CON FEEDBACK) --- */}
      <div className="flex flex-col gap-6">
        {item.opzioni.map((opt, i) => {
          
          // Logica dinamica dei colori
          let buttonStyle = "bg-white border-slate-300 text-slate-950 shadow-xl";
          
          if (isShowingFeedback) {
            if (opt.isCorretta) {
              // La risposta giusta diventa sempre VERDE
              buttonStyle = "bg-green-600 border-green-700 text-white scale-105 z-10 shadow-2xl";
            } else if (selectedIdx === i) {
              // Se il paziente ha cliccato questa ed è sbagliata, diventa ROSSA
              buttonStyle = "bg-red-600 border-red-700 text-white shadow-none";
            } else {
              // Le altre opzioni diventano quasi trasparenti
              buttonStyle = "opacity-20 border-slate-100 shadow-none";
            }
          }

          return (
            <button
              key={i}
              disabled={isShowingFeedback}
              onClick={() => handleChoice(opt.isCorretta, i)}
              className={`
                w-full p-10 border-4 rounded-[3rem] text-4xl font-black 
                transition-all duration-300 flex items-center justify-center gap-6
                ${buttonStyle}
              `}
            >
              {opt.testo}
              {/* Icone di feedback */}
              {isShowingFeedback && opt.isCorretta && <span className="text-5xl">✅</span>}
              {isShowingFeedback && selectedIdx === i && !opt.isCorretta && <span className="text-5xl">❌</span>}
            </button>
          );
        })}
      </div>

      <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
        Domanda {currentIdx + 1} di {items.length}
      </p>
    </div>
  );
}