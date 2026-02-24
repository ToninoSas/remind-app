"use client";
import { useState } from "react";

export default function QuizPlayer({ items, onStepComplete }) {
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
    <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-500 px-2 sm:px-0">
      
      {/* --- AREA DELLA DOMANDA (MEDIA + TESTO) --- */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-slate-200 shadow-2xl overflow-hidden">
        {item.media && item.media.url && (
          <div className="w-full bg-slate-100 border-b-4 border-slate-200">
            {item.media.tipo === "image" && (
              <img
                src={item.media.url}
                alt="Illustrazione domanda"
                className="w-full h-auto max-h-[250px] md:max-h-[450px] object-contain mx-auto"
              />
            )}

            {item.media.tipo === "video" && (
              <video
                src={item.media.url}
                controls
                className="w-full max-h-[250px] md:max-h-[450px]"
              />
            )}

            {item.media.tipo === "audio" && (
              <div className="p-6 md:p-12 flex flex-col items-center space-y-4">
                <span className="text-6xl md:text-9xl mb-2">🔊</span>
                <audio src={item.media.url} controls className="w-full" />
                <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-widest mt-2 md:mt-4">
                  Ascolta con attenzione
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-6 md:p-12">
          <h2 className="text-2xl md:text-5xl font-black text-slate-950 text-center leading-tight tracking-tight">
            {item.testo}
          </h2>
        </div>
      </div>

      {/* --- AREA DELLE RISPOSTE (BOTTONI CON FEEDBACK) --- */}
      <div className="flex flex-col gap-4 md:gap-6">
        {item.opzioni.map((opt, i) => {
          let buttonStyle = "bg-white border-slate-300 text-slate-950 shadow-xl";
          
          if (isShowingFeedback) {
            if (opt.isCorretta) {
              buttonStyle = "bg-green-600 border-green-700 text-white scale-[1.02] md:scale-105 z-10 shadow-2xl";
            } else if (selectedIdx === i) {
              buttonStyle = "bg-red-600 border-red-700 text-white shadow-none";
            } else {
              buttonStyle = "opacity-20 border-slate-100 shadow-none";
            }
          }

          return (
            <button
              key={i}
              disabled={isShowingFeedback}
              onClick={() => handleChoice(opt.isCorretta, i)}
              className={`
                w-full p-6 md:p-10 border-4 rounded-[1.5rem] md:rounded-[3rem] 
                text-xl md:text-4xl font-black 
                transition-all duration-300 flex items-center justify-center gap-4 md:gap-6
                active:scale-95 touch-manipulation
                ${buttonStyle}
              `}
            >
              <span className="flex-1">{opt.testo}</span>
              {/* Icone di feedback */}
              {isShowingFeedback && opt.isCorretta && <span className="text-3xl md:text-5xl">✅</span>}
              {isShowingFeedback && selectedIdx === i && !opt.isCorretta && <span className="text-3xl md:text-5xl">❌</span>}
            </button>
          );
        })}
      </div>

      <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm">
        Domanda {currentIdx + 1} di {items.length}
      </p>
    </div>
  );
}