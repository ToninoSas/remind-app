"use client";
import { useState } from "react";
import { updateMemoryItemAction } from "@/actions/memory";
import { uploadMediaAction } from "@/actions/upload";

export default function EditMemoryItemModal({
  item,
  boxId,
  pazienteId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  // Inizializziamo lo stato con i dati esistenti del ricordo
  const [formData, setFormData] = useState({
    tipo: item.Tipo,
    url: item.Url,
    titolo: item.Titolo,
    testo: item.Testo,
    luogo: item.Luogo,
    datazione: item.Datazione,
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const upData = new FormData();
    upData.append("file", file);
    const res = await uploadMediaAction(upData);

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
    setLoading(true);

    const res = await updateMemoryItemAction(
      item.ID,
      formData,
      boxId,
      pazienteId,
    );

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[130] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-300 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header Modale */}
        <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-950 italic">
              Modifica Ricordo
            </h2>
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">
              Stai aggiornando questo elemento
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-950 font-black text-2xl hover:text-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* Visualizzazione Anteprima Corrente / Cambio File */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
              File Multimediale
            </label>
            <div className="p-6 border-2 border-slate-200 rounded-[2rem] bg-slate-50 flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                {formData.tipo === "foto" ? (
                  <img
                    src={formData.url == "" ? null : formData.url}
                    className="w-full h-full object-cover"
                    alt="Anteprima"
                  />
                ) : (
                  <span className="text-3xl">
                    {formData.tipo === "audio" ? "🎵" : "🎥"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-600 mb-2 italic">
                  Vuoi cambiare il file?
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="text-[10px] font-black text-slate-950 file:bg-slate-950 file:text-white file:border-none file:px-3 file:py-1 file:rounded-lg file:mr-3 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dati Testuali */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-800 uppercase ml-1 block mb-1">
                Titolo
              </label>
              <input
                required
                value={formData.titolo}
                onChange={(e) =>
                  setFormData({ ...formData, titolo: e.target.value })
                }
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-800 uppercase ml-1 block mb-1">
                Datazione
              </label>
              <input
                value={formData.datazione}
                onChange={(e) =>
                  setFormData({ ...formData, datazione: e.target.value })
                }
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-800 uppercase ml-1 block mb-1">
              Luogo
            </label>
            <input
              value={formData.luogo}
              onChange={(e) =>
                setFormData({ ...formData, luogo: e.target.value })
              }
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-800 uppercase ml-1 block mb-1">
              La storia di questo ricordo
            </label>
            <textarea
              required
              rows="4"
              value={formData.testo}
              onChange={(e) =>
                setFormData({ ...formData, testo: e.target.value })
              }
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-medium italic resize-none outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Bottoni Azione */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-black text-slate-700 uppercase text-xs tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "SALVATAGGIO..." : "AGGIORNA RICORDO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
