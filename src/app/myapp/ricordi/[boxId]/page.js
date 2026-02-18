"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { getMemoryBoxDetailAction } from "@/actions/memory";

export default function VisualizzatoreRicordi({ params }) {
  const { boxId } = use(params);
  const [items, setItems] = useState([]);
  const [boxInfo, setBoxInfo] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getMemoryBoxDetailAction(boxId);
      if (data) {
        setBoxInfo(data.box);
        setItems(data.items);
      }
      setLoading(false);
    }
    load();
  }, [boxId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-black">
        Caricamento...
      </div>
    );
  if (!items.length)
    return (
      <div className="p-20 text-center text-2xl font-bold">
        Nessun ricordo in questo box.
      </div>
    );

  const currentItem = items[currentIdx];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Semplice */}
      <header className="p-8 flex justify-between items-center border-b border-slate-100">
        <button
          onClick={() => history.back()}
          className="text-2xl font-black text-slate-400"
        >
          CHIUDI X
        </button>
        <h2 className="text-3xl font-black text-purple-800 uppercase tracking-widest">
          {boxInfo.Titolo}
        </h2>
        <div className="text-xl font-bold text-slate-400">
          {currentIdx + 1} / {items.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Contenitore Immagine/Media */}
        <div className="w-full max-w-4xl bg-slate-100 rounded-[4rem] border-8 border-slate-100 shadow-2xl overflow-hidden aspect-video relative group">

          {/* --- GESTIONE FOTO --- */}
          {currentItem.Tipo === "foto" && (
            <Image
              src={currentItem.Url}
              alt={currentItem.Titolo}
              fill={true}
              className="object-cover animate-in fade-in duration-700"
            />
          )}

          {/* --- GESTIONE VIDEO --- */}
          {currentItem.Tipo === "video" && (
            <video
              src={currentItem.Url}
              controls
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* --- GESTIONE AUDIO --- */}
          {currentItem.Tipo === "audio" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-12">
              {/* Icona gigante per stimolo visivo */}
              <span className="text-[6rem] mb-6 drop-shadow-sm animate-pulse">🎵</span>

              <div className="w-full max-w-md bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-purple-100">
                <p className="text-center text-purple-900 font-black uppercase tracking-widest mb-4 text-sm">
                  Tocca il tasto "Play" per ascoltare
                </p>
                <audio
                  src={currentItem.Url}
                  controls
                  className="w-full h-16"
                />
              </div>
            </div>
          )}

          {/* Badge Luogo/Data integrato - pointer-events-none per non bloccare i click sui player */}
          <div className="absolute bottom-6 left-6 flex gap-3 pointer-events-none">
            <span className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl font-black text-slate-950 text-xl shadow-lg">
              📍 {currentItem.Luogo}
            </span>
            <span className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl font-black text-slate-950 text-xl shadow-lg">
              🗓️ {currentItem.Datazione}
            </span>
          </div>
        </div>

        {/* Testo del Ricordo (Grande e Leggibile) */}
        <div className="max-w-4xl text-center">
          <h3 className="text-4xl font-black text-slate-950 mb-4 uppercase tracking-tighter">
            {currentItem.Titolo}
          </h3>
          <p className="text-3xl font-medium text-slate-700 italic leading-relaxed px-4">
            "{currentItem.Testo}"
          </p>
        </div>

        {/* NAVIGAZIONE GIGANTE */}
        <div className="flex gap-12 pt-6">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl shadow-xl disabled:opacity-20 active:scale-90 transition-all border-4 border-slate-200"
          >
            ⬅️
          </button>

          <button
            disabled={currentIdx === items.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center text-5xl shadow-xl disabled:opacity-20 active:scale-90 transition-all border-4 border-purple-200"
          >
            ➡️
          </button>
        </div>
      </main>
    </div>
  );
}
