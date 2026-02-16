"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getMemoryBoxesAction } from "@/actions/memory";

export default function GalleriaRicordiPaziente() {
  const { user } = useAuth();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.ProfileID) {
        // Recuperiamo i box attivi del paziente
        const data = await getMemoryBoxesAction(user.ProfileID);
        setBoxes(data);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <Link
          href="/myapp"
          className="text-2xl font-black text-slate-500 hover:text-slate-950"
        >
          ← ESCI
        </Link>
        <h1 className="text-5xl font-black text-slate-950 italic tracking-tighter">
          I tuoi ricordi
        </h1>
        <div className="w-20"></div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {loading ? (
          <p className="col-span-2 text-center text-3xl font-bold text-slate-400 animate-pulse">
            Apro lo scrigno...
          </p>
        ) : boxes.length > 0 ? (
          boxes.map((box) => (
            <Link
              key={box.ID}
              href={`/myapp/ricordi/${box.ID}`}
              className="group relative bg-white border-8 border-slate-100 rounded-[4rem] overflow-hidden shadow-2xl hover:border-purple-600 transition-all aspect-[4/3] flex flex-col"
            >
              {/* Preview - Se il box avesse una copertina, andrebbe qui. Altrimenti usiamo un'icona */}
              <div className="flex-1 bg-purple-50 flex items-center justify-center">
                <span className="text-9xl group-hover:scale-110 transition-transform">
                  📸
                </span>
              </div>
              <div className="p-10 bg-white border-t-4 border-slate-100">
                <p className="text-xs font-black text-purple-700 uppercase tracking-[0.3em] mb-2">
                  {box.Categoria}
                </p>
                <h2 className="text-4xl font-black text-slate-950 uppercase">
                  {box.Titolo}
                </h2>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 text-center py-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <p className="text-3xl font-black text-slate-400 italic">
              Il tuo caregiver non ha ancora <br /> aggiunto dei ricordi per te.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
