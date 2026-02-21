// src/app/components/layout/caregiver/ricordi/AddMemoryBoxModal.js
"use client";
import { useState } from "react";
import { createMemoryBoxAction } from "@/lib/actions/memory";

export default function AddMemoryBoxModal({
  pazienteId,
  caregiverId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titolo: "",
    descrizione: "", // Stato per la descrizione
    categoria: "Famiglia",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titolo.trim()) return alert("Inserisci un titolo");

    setLoading(true);
    // Passiamo l'intero oggetto formData che ora include la descrizione
    const res = await createMemoryBoxAction(pazienteId, caregiverId, formData);

    if (res.success) {
      if (onSuccess) await onSuccess(); // Chiamata vitale per aggiornare la lista
      onClose();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-300 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-950 italic">
            Nuovo Box Ricordi
          </h2>
          <button
            onClick={onClose}
            className="text-slate-950 font-black text-2xl hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Titolo del Box
            </label>
            <input
              required
              value={formData.titolo}
              onChange={(e) =>
                setFormData({ ...formData, titolo: e.target.value })
              }
              placeholder="Es: Foto della gioventù"
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Categoria
            </label>
            <select
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-black outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="Famiglia">👨‍👩‍👧‍👦 Famiglia</option>
              <option value="Viaggi">✈️ Viaggi e Luoghi</option>
              <option value="Lavoro">🛠️ Lavoro e Carriera</option>
              <option value="Hobby">🎨 Passioni e Hobby</option>
            </select>
          </div>

          {/* NUOVO CAMPO DESCRIZIONE */}
          <div>
            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2">
              Descrizione / Note
            </label>
            <textarea
              value={formData.descrizione}
              onChange={(e) =>
                setFormData({ ...formData, descrizione: e.target.value })
              }
              placeholder="Aggiungi dettagli su questo gruppo di ricordi..."
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-medium italic h-28 resize-none outline-none focus:ring-4 focus:ring-blue-100 placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-700 font-black uppercase text-xs tracking-widest"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-50"
            >
              {loading ? "SALVATAGGIO..." : "CREA BOX"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
