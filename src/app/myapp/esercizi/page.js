"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getAssignedExercisesAction } from "@/actions/assignments";

export default function ListaEserciziPaziente() {
  const { user } = useAuth();
  const [esercizi, setEsercizi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log("user", user);
      if (user?.ProfileID) {
        // Recuperiamo solo le assegnazioni con stato 'da_svolgere'
        const data = await getAssignedExercisesAction(user.ProfileID, "da_svolgere");
        console.log("Esercizi assegnati da svolgere:", data);
        setEsercizi(data);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header di Navigazione Semplificato */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link
          href="/myapp"
          className="text-2xl font-black text-slate-500 hover:text-slate-950"
        >
          ← TORNA INDIETRO
        </Link>
        <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">
          I tuoi compiti
        </h1>
        <div className="w-20"></div> {/* Spacer */}
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-3xl font-bold animate-pulse text-slate-400">
            Caricamento...
          </p>
        ) : esercizi.length > 0 ? (
          esercizi.map((ex) => (
            <Link
              key={ex.ID}
              href={`/myapp/esercizi/${ex.ID}`}
              className="flex items-center justify-between p-10 bg-white border-8 border-slate-100 rounded-[3.5rem] shadow-xl hover:border-blue-600 transition-all group"
            >
              <div className="flex items-center gap-8">
                <span className="text-8xl group-hover:scale-110 transition-transform">
                  {ex.Tipo === "quiz"
                    ? "🧩"
                    : ex.Tipo === "calcolo"
                      ? "🔢"
                      : "🧠"}
                </span>
                <div>
                  <h2 className="text-4xl font-black text-slate-950">
                    {ex.Titolo}
                  </h2>
                  <p className="text-xl font-bold text-slate-500 uppercase mt-2">
                    {ex.Tipo}
                  </p>
                </div>
              </div>
              <span className="text-4xl text-blue-600 font-black">
                INIZIA →
              </span>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <p className="text-3xl font-black text-slate-400 italic">
              Bravo! Hai completato <br /> tutti gli esercizi di oggi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
