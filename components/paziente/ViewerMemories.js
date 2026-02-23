"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VisualizzatoreRicordi({ initialItems, boxInfo }) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const currentItem = initialItems[currentIdx];

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in fade-in duration-700">
      {/* Header Semplice */}
      <header className="p-8 flex justify-between items-center border-b-4 border-slate-50">
        <button
          onClick={() => router.back()}
          className="text-2xl font-black text-slate-300 hover:text-red-500 transition-colors"
        >
          CHIUDI X
        </button>
        <h2 className="text-3xl font-black text-purple-800 uppercase tracking-[0.2em]">
          {boxInfo.Title}
        </h2>
        <div className="bg-slate-100 px-6 py-2 rounded-full text-xl font-black text-slate-500">
          {currentIdx + 1} / {initialItems.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Contenitore Media (Uguale a prima, ma senza il check del loading) */}
        <div className="w-full max-w-5xl bg-slate-100 rounded-[5rem] border-[12px] border-slate-100 shadow-2xl overflow-hidden aspect-video relative">
          
          {/* --- FOTO --- */}
          {currentItem.Type === "foto" && (
            <Image
              src={currentItem.Url}
              alt={currentItem.Title}
              fill
              priority // Carica questa immagine subito!
              className="object-cover animate-in zoom-in duration-1000"
            />
          )}

          {/* --- VIDEO --- */}
          {currentItem.Type === "video" && (
            <video src={currentItem.Url} controls className="w-full h-full object-contain bg-black" />
          )}

          {/* --- AUDIO --- */}
          {currentItem.Type === "audio" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-12">
              <span className="text-[10rem] mb-6 animate-pulse">🎵</span>
              <div className="w-full max-w-md bg-white p-8 rounded-[3rem] shadow-xl border-4 border-purple-100">
                <p className="text-center text-purple-900 font-black uppercase mb-4 text-xl">
                  Tocca Play per ascoltare
                </p>
                <audio src={currentItem.Url} controls className="w-full h-20" />
              </div>
            </div>
          )}

          {/* Badge fissi */}
          <div className="absolute bottom-8 left-8 flex gap-4">
            <span className="bg-white/95 backdrop-blur px-8 py-4 rounded-3xl font-black text-slate-950 text-2xl shadow-2xl">
              📍 {currentItem.Location}
            </span>
            <span className="bg-white/95 backdrop-blur px-8 py-4 rounded-3xl font-black text-slate-950 text-2xl shadow-2xl">
              🗓️ {currentItem.Date}
            </span>
          </div>
        </div>

        {/* Title e Testo del ricordo */}
        <div className="max-w-4xl text-center space-y-4">
          <h3 className="text-5xl font-black text-slate-950 tracking-tighter uppercase">
            {currentItem.Title}
          </h3>
          <p className="text-4xl font-medium text-slate-600 italic leading-relaxed">
            "{currentItem.Text}"
          </p>
        </div>

        {/* NAVIGAZIONE GIGANTE (Ottimizzata per il tocco) */}
        <div className="flex gap-16 pt-8">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center text-6xl shadow-xl disabled:opacity-10 active:scale-90 transition-all border-4 border-slate-200"
          >
            ⬅️
          </button>

          <button
            disabled={currentIdx === initialItems.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="w-32 h-32 bg-purple-700 rounded-[3rem] flex items-center justify-center text-6xl shadow-xl disabled:opacity-10 active:scale-90 transition-all border-4 border-purple-200"
          >
            ➡️
          </button>
        </div>
      </main>
    </div>
  );
}