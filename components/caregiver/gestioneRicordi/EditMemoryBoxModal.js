"use client";
import { useState } from "react";
import { updateMemoryBoxAction } from "@/lib/actions/memory";

export default function EditMemoryBoxModal({
  box,
  pazienteId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titolo: box.Title,
    descrizione: box.Description,
    categoria: box.Category,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateMemoryBoxAction(box.Id, formData, pazienteId);
    if (res.success) {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-300 p-10 animate-in zoom-in">
        <h2 className="text-2xl font-black text-slate-950 mb-6 italic">
          Modifica Box
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={formData.titolo}
            onChange={(e) =>
              setFormData({ ...formData, titolo: e.target.value })
            }
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold"
          />
          <select
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-black"
          >
            <option value="Famiglia">Famiglia</option>
            <option value="Viaggi">Viaggi</option>
            <option value="Lavoro">Lavoro</option>
            <option value="Hobby">Hobby</option>
          </select>
          <textarea
            value={formData.descrizione}
            onChange={(e) =>
              setFormData({ ...formData, descrizione: e.target.value })
            }
            rows="4"
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 italic"
          />
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-black text-slate-700 text-xs uppercase"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase shadow-xl"
            >
              {loading ? "Salvataggio..." : "Salva Modifiche"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
