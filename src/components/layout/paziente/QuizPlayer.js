"use client";
import { useState } from "react";

export default function QuizPlayer({ items, onStepComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const item = items[currentIdx];

  const handleChoice = (isCorretta) => {
    // Comunica il risultato al componente genitore
    onStepComplete(isCorretta);

    // Passa alla domanda successiva se esiste
    if (currentIdx < items.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  if (!item) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* --- AREA DELLA DOMANDA (MEDIA + TESTO) --- */}
      <div className="bg-white rounded-[3.5rem] border-4 border-slate-200 shadow-2xl overflow-hidden">
        {/* Gestione Media (Immagine, Video o Audio) */}
        {item.media && item.media.url && (
          <div className="w-full bg-slate-100 border-b-4 border-slate-200">
            {/* Caso: IMMAGINE */}
            {item.media.tipo === "image" && (
              <img
                src={item.media.url}
                alt="Illustrazione domanda"
                className="w-full h-auto max-h-[450px] object-contain mx-auto"
              />
            )}

            {/* Caso: VIDEO */}
            {item.media.tipo === "video" && (
              <video
                src={item.media.url}
                controls
                className="w-full max-h-[450px]"
              />
            )}

            {/* Caso: AUDIO */}
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

        {/* Testo della Domanda */}
        <div className="p-12">
          <h2 className="text-5xl font-black text-slate-950 text-center leading-tight tracking-tight">
            {item.testo}
          </h2>
        </div>
      </div>

      {/* --- AREA DELLE RISPOSTE (BOTTONI GIGANTI) --- */}
      <div className="flex flex-col gap-6">
        {item.opzioni.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(opt.isCorretta)}
            className="w-full p-10 bg-white border-4 border-slate-300 rounded-[3rem] text-4xl font-black text-slate-950 shadow-xl active:bg-blue-700 active:text-white active:scale-95 transition-all text-center"
          >
            {opt.testo}
          </button>
        ))}
      </div>

      {/* Indicatore di progresso discreto in basso */}
      <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
        Domanda {currentIdx + 1} di {items.length}
      </p>
    </div>
  );
}
