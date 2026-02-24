"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VisualizzatoreRicordi({ initialItems, boxInfo }) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const currentItem = initialItems[currentIdx];

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col animate-in fade-in duration-700">
      
      {/* Header: Più compatto su mobile */}
      <header className="p-4 md:p-8 flex justify-between items-center border-b-2 md:border-b-4 border-slate-50 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-lg md:text-2xl font-black text-slate-400 hover:text-red-500 transition-colors uppercase"
        >
          Chiudi X
        </button>
        <h2 className="text-xl md:text-3xl font-black text-purple-800 uppercase tracking-tight md:tracking-[0.2em] truncate px-4">
          {boxInfo.Title}
        </h2>
        <div className="bg-slate-100 px-4 md:px-6 py-1 md:py-2 rounded-full text-sm md:text-xl font-black text-slate-500 shrink-0">
          {currentIdx + 1} / {initialItems.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto no-scrollbar">
        
        {/* Contenitore Media:
            - Bordi e arrotondamenti ridotti su mobile per massimizzare l'immagine
        */}
        <div className="w-full max-w-5xl bg-slate-100 rounded-[2.5rem] md:rounded-[5rem] border-4 md:border-[12px] border-slate-100 shadow-2xl overflow-hidden aspect-video relative shrink-0">
          
          {/* --- FOTO --- */}
          {currentItem.Type === "foto" && currentItem.Url && (
            <Image
              src={currentItem.Url}
              alt={currentItem.Title}
              fill
              priority
              className="object-cover animate-in zoom-in duration-1000"
            />
          )}

          {/* --- VIDEO --- */}
          {currentItem.Type === "video" && (
            <video src={currentItem.Url} controls className="w-full h-full object-contain bg-black" />
          )}

          {/* --- AUDIO --- */}
          {currentItem.Type === "audio" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-6 md:p-12">
              <span className="text-6xl md:text-[10rem] mb-4 md:mb-6 animate-pulse">🎵</span>
              <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border-2 md:border-4 border-purple-100">
                <p className="text-center text-purple-900 font-black uppercase mb-2 md:mb-4 text-sm md:text-xl">
                  Ascolta con attenzione
                </p>
                <audio src={currentItem.Url} controls className="w-full h-12 md:h-20" />
              </div>
            </div>
          )}

          {/* Badge fissi: Scalati e riposizionati su mobile */}
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex flex-col sm:flex-row gap-2 md:gap-4 pointer-events-none">
            <span className="bg-white/90 backdrop-blur px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-3xl font-black text-slate-950 text-xs md:text-2xl shadow-xl w-fit">
              📍 {currentItem.Location}
            </span>
            <span className="bg-white/90 backdrop-blur px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-3xl font-black text-slate-950 text-xs md:text-2xl shadow-xl w-fit">
              🗓️ {currentItem.Date}
            </span>
          </div>
        </div>

        {/* Testi: Ridimensionamento aggressivo per mobile */}
        <div className="max-w-4xl text-center space-y-2 md:space-y-4 px-2">
          <h3 className="text-2xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-tight">
            {currentItem.Title}
          </h3>
          <p className="text-lg md:text-4xl font-medium text-slate-600 italic leading-snug md:leading-relaxed">
            "{currentItem.Text}"
          </p>
        </div>

        {/* NAVIGAZIONE: 
            - Tasti grandi ma non ingombranti su mobile
        */}
        <div className="flex gap-8 md:gap-16 pt-4 pb-4">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="w-20 h-20 md:w-32 md:h-32 bg-slate-100 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-4xl md:text-6xl shadow-xl disabled:opacity-10 active:scale-90 transition-all border-2 md:border-4 border-slate-200"
          >
            ⬅️
          </button>

          <button
            disabled={currentIdx === initialItems.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="w-24 h-24 md:w-32 md:h-32 bg-purple-700 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-5xl md:text-6xl shadow-xl disabled:opacity-10 active:scale-90 transition-all border-2 md:border-4 border-purple-200 text-white"
          >
            ➡️
          </button>
        </div>
      </main>
    </div>
  );
}