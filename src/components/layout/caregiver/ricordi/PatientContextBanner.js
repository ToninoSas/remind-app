// src/app/components/layout/caregiver/ricordi/PatientContextBanner.js
"use client";
import { useRouter } from "next/navigation";

export default function PatientContextBanner({ paziente }) {
  const router = useRouter();

  if (!paziente) return null;

  return (
    <div className="bg-white border-b border-slate-300 sticky top-0 z-30 mb-8">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar in miniatura */}
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
            {paziente.Nome[0]}
            {paziente.Cognome[0]}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
              Stai gestendo i ricordi di:
            </p>
            <h2 className="text-lg font-black text-slate-950 leading-tight">
              {paziente.Nome} {paziente.Cognome}
              <span className="ml-3 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {paziente.Patologia}
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={() => router.push(`/pazienti/${paziente.ID}`)}
          className="text-[10px] font-black text-slate-700 hover:text-blue-700 uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-xl bg-white shadow-sm transition-all"
        >
          ← Torna alla cartella
        </button>
      </div>
    </div>
  );
}
