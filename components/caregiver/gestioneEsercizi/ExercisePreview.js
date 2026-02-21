"use client";
import { useState, useEffect, useMemo } from "react";

// Icone prefissate per il Memory (Massimo contrasto e riconoscibilità)
const ICONE_MEMORY = ["🍎", "🐶", "🚗", "⚽", "🏠", "🍕", "🚲", "☀️"];
const ICONA_BACK = "🧠"; // Icona uguale per tutti sul dorso

export default function ExercisePreview({ esercizio, onClose }) {
  if (!esercizio) return null;

  // --- 1. PARSING E PREPARAZIONE DATI ---
  const contenuto = useMemo(() => {
    try {
      return typeof esercizio.Content_Json === "string"
        ? JSON.parse(esercizio.Content_Json)
        : esercizio.Content_Json;
    } catch (e) {
      return { items: [], numeroCoppie: 2 };
    }
  }, [esercizio]);

  // --- 2. LOGICA GIOCO MEMORY ---
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Indici delle carte girate nel turno attuale
  const [matched, setMatched] = useState([]); // ID univoci delle carte già indovinate

  useEffect(() => {
    if (esercizio.Type === "memoria") {
      const num = contenuto.numeroCoppie || 2;
      // Selezioniamo le icone e creiamo le coppie
      const selectedIcons = ICONE_MEMORY.slice(0, num);
      const deck = [...selectedIcons, ...selectedIcons]
        .map((icon, i) => ({
          id: icon,
          uniqueKey: i, // Chiave necessaria per distinguere le due carte della stessa coppia
        }))
        .sort(() => Math.random() - 0.5); // Mescolamento

      setCards(deck);
      setFlipped([]);
      setMatched([]);
    }
  }, [contenuto, esercizio.Type]);

  const handleCardClick = (idx) => {
    // Impedisci click se: 2 carte già girate, carta già girata, o carta già indovinata
    if (
      flipped.length === 2 ||
      flipped.includes(idx) ||
      matched.includes(cards[idx].uniqueKey)
    )
      return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].id === cards[secondIdx].id) {
        // Coppia trovata!
        setMatched((prev) => [
          ...prev,
          cards[firstIdx].uniqueKey,
          cards[secondIdx].uniqueKey,
        ]);
        setFlipped([]);
      } else {
        // Non corrispondono: rigira dopo 1 secondo
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        {/* --- HEADER (ALTO CONTRASTO) --- */}
        <div className="p-10 border-b border-slate-300 flex justify-between items-center bg-slate-50">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 bg-blue-100 px-4 py-1.5 rounded-xl border border-blue-200">
              Anteprima {esercizio.Type}
            </span>
            <h2 className="text-4xl font-black text-slate-950 mt-2 tracking-tight italic">
              {esercizio.Title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 bg-white border border-slate-300 rounded-2xl shadow-sm flex items-center justify-center text-xl font-black text-slate-950 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            ✕
          </button>
        </div>

        {/* --- AREA CONTENUTO SCROLLABILE --- */}
        <div className="p-10 flex-1 overflow-y-auto">
          {esercizio.Type === "memoria" ? (
            /* --- VISTA MEMORY SEMPLIFICATO --- */
            <div className="flex flex-col items-center justify-center h-full py-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-2xl">
                {cards.map((card, idx) => {
                  const isFlipped =
                    flipped.includes(idx) || matched.includes(card.uniqueKey);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCardClick(idx)}
                      className="relative aspect-square cursor-pointer"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className={`relative w-full h-full transition-all duration-500 shadow-xl rounded-[2.5rem] ${
                          isFlipped ? "[transform:rotateY(180deg)]" : ""
                        }`}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* DORSO DELLA CARTA (Blu scuro per distacco dal bianco) */}
                        <div
                          className="absolute inset-0 bg-blue-700 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black border-4 border-white shadow-inner"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          {ICONA_BACK}
                        </div>

                        {/* FRONTE DELLA CARTA (Bianco puro con icona gigante) */}
                        <div
                          className="absolute inset-0 bg-white border-4 border-blue-100 rounded-[2.5rem] flex items-center justify-center text-7xl [transform:rotateY(180deg)] shadow-md"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          {card.Id}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-10 text-slate-600 font-black uppercase text-xs tracking-widest italic">
                {matched.length / 2} di {contenuto.numeroCoppie} coppie trovate
              </p>
            </div>
          ) : (
            /* --- VISTA QUIZ / CALCOLO --- */
            <div className="space-y-12">
              {contenuto.items?.map((q, idx) => (
                <div key={idx} className="space-y-6 animate-in fade-in">
                  {/* Titolo Quesito */}
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 shrink-0 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </span>
                    <h4 className="font-black text-2xl text-slate-950 tracking-tight">
                      {q.testo}
                    </h4>
                  </div>

                  {/* Scenario (Solo per Calcolo) */}
                  {q.scenario && (
                    <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg border border-blue-400">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                        Contesto del problema
                      </p>
                      <p className="font-bold text-xl leading-relaxed">
                        {q.scenario}
                      </p>
                    </div>
                  )}

                  {/* Media Supporto */}
                  {q.media?.url && (
                    <div className="rounded-[2.5rem] border border-slate-300 bg-white p-6 flex justify-center shadow-inner">
                      {q.media.Type === "image" && (
                        <img
                          src={q.media.url}
                          className="max-h-72 rounded-2xl shadow-md border-4 border-slate-50"
                        />
                      )}
                      {q.media.Type === "audio" && (
                        <audio
                          controls
                          src={q.media.url}
                          className="w-full max-w-md"
                        />
                      )}
                      {q.media.Type === "video" && (
                        <video
                          controls
                          src={q.media.url}
                          className="max-h-72 rounded-2xl"
                        />
                      )}
                    </div>
                  )}

                  {/* Opzioni di risposta (Evidenziata la corretta) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 sm:ml-14">
                    {q.opzioni?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          opt.isCorretta
                            ? "bg-green-50 border-green-600 text-green-900 shadow-sm"
                            : "bg-white border-slate-300 text-slate-950 opacity-50"
                        }`}
                      >
                        <span className="font-black text-base">
                          {opt.text}
                        </span>
                        {opt.isCorretta && <span className="text-xl">✅</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-8 bg-slate-50 border-t border-slate-300 flex justify-center">
          <button
            onClick={onClose}
            className="px-16 py-4 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-700 transition-all"
          >
            Chiudi Anteprima
          </button>
        </div>
      </div>
    </div>
  );
}
