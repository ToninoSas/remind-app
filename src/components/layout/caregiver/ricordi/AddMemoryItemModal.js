"use client";
import { useState } from "react";
import { addMemoryItemAction } from "@/actions/memory";
import { uploadMediaAction } from "@/actions/upload";

// MODALE PER LA CREAZIONE DI UN NUOVO RICORDO ALL'INTERNO DI UN BOX
// SI TROVA ALL'INTERNO DELLA PAGINA DI DETTAGLIO DI OGNI BOX
export default function AddMemoryItemModal({ boxId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "foto",
    url: "",
    titolo: "",
    testo: "",
    luogo: "",
    datazione: "",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const upData = new FormData();
    upData.append("file", file);
    // Carichiamo il file e otteniamo l'URL
    const res = await uploadMediaAction(upData);

    // Aggiorniamo lo stato con l'URL restituito e il tipo (foto, video, ecc.)
    if (res.success) {
      setFormData({
        ...formData,
        url: res.url,
        tipo:
          file.type.split("/")[0] === "image"
            ? "foto"
            : file.type.split("/")[0],
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url) return alert("Carica un file prima di salvare!");

    setLoading(true);
    const res = await addMemoryItemAction(boxId, formData);
    if (res.success) {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-300 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b bg-slate-50 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-slate-950 italic">
            Crea un Ricordo
          </h2>
          <button
            onClick={onClose}
            className="text-slate-950 font-black text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* Upload */}
          <div className="p-8 border-4 border-dashed border-slate-200 rounded-[2rem] text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="text-xs font-black text-slate-950"
            />
            {formData.url && (
              <p className="mt-4 text-green-600 font-black">
                ✓ File caricato con successo
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Titolo (es: In barca)"
              value={formData.titolo}
              onChange={(e) =>
                setFormData({ ...formData, titolo: e.target.value })
              }
              className="p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold placeholder:text-slate-500"
            />
            <input
              placeholder="Data (es: Estate '82)"
              value={formData.datazione}
              onChange={(e) =>
                setFormData({ ...formData, datazione: e.target.value })
              }
              className="p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold placeholder:text-slate-500"
            />
          </div>

          <input
            placeholder="Luogo (es: Manfredonia)"
            value={formData.luogo}
            onChange={(e) =>
              setFormData({ ...formData, luogo: e.target.value })
            }
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold placeholder:text-slate-500"
          />

          <textarea
            required
            placeholder="Racconta la storia di questa foto..."
            value={formData.testo}
            onChange={(e) =>
              setFormData({ ...formData, testo: e.target.value })
            }
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl h-32 resize-none font-medium text-slate-950 placeholder:text-slate-500 italic"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-black text-slate-700 uppercase text-xs"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50"
            >
              {loading ? "Salvataggio..." : "Salva Ricordo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
