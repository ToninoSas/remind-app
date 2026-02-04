"use client";
import { useMemo } from "react";

export default function StatistichePaziente({ stats }) {
  const metrics = useMemo(() => {
    if (!stats.length) return null;

    const total = stats.reduce((acc, curr) => acc + curr.risposte_totali, 0);
    const correct = stats.reduce((acc, curr) => acc + curr.risposte_corrette, 0);
    const moodAvg = (stats.reduce((acc, curr) => acc + curr.stato_emotivo, 0) / stats.length).toFixed(1);

    return {
      total,
      accuracy: total > 0 ? ((correct / total) * 100).toFixed(1) : 0,
      moodAvg
    };
  }, [stats]);

  if (!metrics) return <p className="text-slate-400">Nessun dato disponibile per le statistiche.</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-3xl text-center">
          <span className="text-4xl block mb-2">📊</span>
          <h4 className="text-slate-500 text-sm font-bold uppercase">Quesiti Totali</h4>
          <p className="text-3xl font-black text-blue-700">{metrics.total}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl text-center">
          <span className="text-4xl block mb-2">🎯</span>
          <h4 className="text-slate-500 text-sm font-bold uppercase">Precisione Media</h4>
          <p className="text-3xl font-black text-green-700">{metrics.accuracy}%</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-3xl text-center">
          <span className="text-4xl block mb-2">🧠</span>
          <h4 className="text-slate-500 text-sm font-bold uppercase">Umore Medio</h4>
          <p className="text-3xl font-black text-orange-700">{metrics.moodAvg}/5</p>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl">
        <h4 className="font-bold mb-4">Andamento Performance</h4>
        <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-1000" 
            style={{ width: `${metrics.accuracy}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}