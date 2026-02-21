"use client";
import { useState } from "react";

export default function MemoryItemForm({ boxId, onSave }) {
  const [tipo, setTipo] = useState("foto");
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-300 shadow-2xl space-y-6">
      <h3 className="text-2xl font-black text-slate-950 italic">
        Aggiungi un Ricordo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
            Tipo di Media
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-black text-slate-950 outline-none focus:ring-4 focus:ring-blue-100"
          >
            <option value="foto">🖼️ Fotografia</option>
            <option value="audio">🎵 Registrazione Audio / Musica</option>
            <option value="video">🎥 Filmato</option>
          </select>

          <input
            type="text"
            placeholder="Titolo del ricordo (es: Il matrimonio)"
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-bold text-slate-950 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Luogo (es: Manfredonia, Piazza Duomo)"
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-bold text-slate-950 placeholder:text-slate-500"
          />
          <input
            type="text"
            placeholder="Datazione (es: Estate 1974)"
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl font-bold text-slate-950 placeholder:text-slate-500"
          />
        </div>
      </div>

      <textarea
        placeholder="Racconta la storia di questo ricordo..."
        className="w-full p-4 bg-white border border-slate-300 rounded-2xl h-32 resize-none font-medium text-slate-950 placeholder:text-slate-500"
      />

      <button className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-blue-700 transition-all">
        SALVA NEL BOX
      </button>
    </div>
  );
}
