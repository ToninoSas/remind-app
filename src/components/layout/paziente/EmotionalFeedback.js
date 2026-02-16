"use client";
import React, { useState } from "react";

export default function EmotionalFeedback({ onSelect }) {
  // Mappatura dei 5 stati previsti dal tuo database (1-5)
  const moods = [
    {
      value: 1,
      emoji: "😢",
      label: "Triste",
      color: "border-red-200 bg-red-50 text-red-700",
    },
    {
      value: 2,
      emoji: "😕",
      label: "Così così",
      color: "border-orange-200 bg-orange-50 text-orange-700",
    },
    {
      value: 3,
      emoji: "😐",
      label: "Normale",
      color: "border-slate-200 bg-slate-50 text-slate-700",
    },
    {
      value: 4,
      emoji: "😊",
      label: "Bene",
      color: "border-green-200 bg-green-50 text-green-700",
    },
    {
      value: 5,
      emoji: "🤩",
      label: "Benissimo!",
      color: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
  ];

  const [selected, setSelected] = useState(null);

  const handleConfirm = (val) => {
    setSelected(val);
    // Piccolo delay per far vedere l'animazione della selezione prima di salvare
    setTimeout(() => {
      onSelect(val);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 p-6 animate-in fade-in zoom-in duration-500">
      {/* Domanda diretta e semplice */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Come ti senti <br /> in questo momento?
        </h2>
        <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">
          Scegli la faccina che ti somiglia di più
        </p>
      </div>

      {/* Griglia delle opzioni */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleConfirm(mood.value)}
            disabled={selected !== null}
            className={`
              flex flex-col items-center justify-center 
              w-44 h-56 p-4 rounded-[3.5rem] border-4 shadow-xl 
              transition-all duration-300 active:scale-90
              ${
                selected === mood.value
                  ? "ring-8 ring-blue-600 border-blue-600 scale-110 z-10"
                  : `${mood.color} hover:scale-105 border-slate-200 bg-white`
              }
              ${selected !== null && selected !== mood.value ? "opacity-30 grayscale" : ""}
            `}
          >
            <span className="text-8xl mb-4 drop-shadow-md">{mood.emoji}</span>
            <span className="text-lg font-black uppercase tracking-tighter">
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Messaggio di rassicurazione */}
      {selected && (
        <p className="text-2xl font-black text-blue-700 animate-bounce">
          Grazie per avermelo detto! ❤️
        </p>
      )}
    </div>
  );
}
