// src/app/components/layout/caregiver/ricordi/PatientContextBanner.js
"use client";
import Link from "next/link";

export default function PatientContextBanner({ paziente }) {
  if (!paziente) return null;

  return (
    /* AGGIUSTAMENTI CHIAVE:
       1. -mx-4 lg:-mx-8: Annulla il padding laterale del main
       2. -mt-4 lg:-mt-8: Annulla il padding superiore del main
       3. w-[calc(100%+2rem)] lg:w-[calc(100%+4rem)]: Forza la larghezza a coprire tutto
       4. shadow-sm: Aggiunge profondità per staccarlo dai contenuti che scorrono sotto
    */
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200 -mx-4 -mt-4 mb-8 lg:-mx-8 lg:-mt-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar in miniatura */}
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex i-center justify-center font-black text-xs shadow-sm shrink-0 flex items-center">
            {paziente.First_Name[0]}
            {paziente.Last_Name[0]}
          </div>
          
          <div className="min-w-0"> {/* min-w-0 evita problemi di overflow del testo */}
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
              Stai gestendo i ricordi di:
            </p>
            <h2 className="text-lg font-black text-slate-950 leading-tight truncate">
              {paziente.First_Name} {paziente.Last_Name}
              <span className="hidden sm:inline-flex ml-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
                {paziente.Condition}
              </span>
            </h2>
          </div>
        </div>

        <Link
          href={`/pazienti/${paziente.Id}`}
          className="shrink-0 text-[10px] font-black text-slate-700 hover:text-blue-700 hover:border-blue-200 uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-xl bg-white shadow-sm transition-all flex items-center gap-2"
        >
          <span className="text-sm">←</span> 
          <span className="hidden sm:inline">Torna alla lista</span>
          <span className="sm:hidden">Indietro</span>
        </Link>
      </div>
    </div>
  );
}