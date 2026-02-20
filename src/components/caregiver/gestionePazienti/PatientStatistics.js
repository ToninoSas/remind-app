"use client";
import { useMemo } from "react";

export default function StatistichePaziente({ stats }) {
  const metrics = useMemo(() => {
    // Controllo di sicurezza se stats è nullo o vuoto
    if (!stats || stats.length === 0) return null;

    // ATTENZIONE: Usiamo i nomi esatti delle colonne del DB (Risposte_totali, etc.)
    const total = stats.reduce(
      (acc, curr) => acc + (Number(curr.Risposte_totali) || 0),
      0,
    );
    const correct = stats.reduce(
      (acc, curr) => acc + (Number(curr.Risposte_corrette) || 0),
      0,
    );

    // Calcolo umore medio
    const validMoods = stats.filter((s) => s.Stato_Emotivo !== null);
    const moodSum = validMoods.reduce(
      (acc, curr) => acc + curr.Stato_Emotivo,
      0,
    );
    const moodAvg =
      validMoods.length > 0 ? (moodSum / validMoods.length).toFixed(1) : "N/D";

    return {
      total,
      accuracy: total > 0 ? ((correct / total) * 100).toFixed(1) : 0,
      moodAvg,
    };
  }, [stats]);

  if (!metrics) {
    return (
      <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200">
        <p className="text-slate-500 font-bold italic">
          Nessun dato disponibile per questo paziente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Griglia delle metriche principali */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-8 rounded-[2.5rem] text-center border-4 border-blue-100">
          <span className="text-5xl block mb-3">📊</span>
          <h4 className="text-slate-600 text-xs font-black uppercase tracking-widest">
            Quesiti Totali
          </h4>
          <p className="text-4xl font-black text-blue-700">{metrics.total}</p>
        </div>

        <div className="bg-green-50 p-8 rounded-[2.5rem] text-center border-4 border-green-100">
          <span className="text-5xl block mb-3">🎯</span>
          <h4 className="text-slate-600 text-xs font-black uppercase tracking-widest">
            Precisione Media
          </h4>
          <p className="text-4xl font-black text-green-700">
            {metrics.accuracy}%
          </p>
        </div>

        <div className="bg-orange-50 p-8 rounded-[2.5rem] text-center border-4 border-orange-100">
          <span className="text-5xl block mb-3">🧠</span>
          <h4 className="text-slate-600 text-xs font-black uppercase tracking-widest">
            Umore Medio
          </h4>
          <p className="text-4xl font-black text-orange-700">
            {metrics.moodAvg}
            <span className="text-lg">/5</span>
          </p>
        </div>
      </div>

      {/* Barra andamento visivo */}
      <div className="p-8 bg-slate-50 rounded-[3rem] border-4 border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <h4 className="font-black text-slate-900 uppercase tracking-tight">
            Efficacia Terapeutica
          </h4>
          <span className="text-slate-500 font-bold text-sm">
            {metrics.accuracy}% Corrette
          </span>
        </div>
        <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden p-1 shadow-inner">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-lg"
            style={{ width: `${metrics.accuracy}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
