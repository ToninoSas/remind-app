import { useState } from "react";
import { updatePatientAction, softDeletePatientAction } from "@/actions/patients";

export default function AnagraficaPaziente({ data, patientID }) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    const [editData, setEditData] = useState({
        nome: data.info.Nome,
        cognome: data.info.Cognome,
        email: data.info.Email,
        patologia: data.info.Patologia,
        descrizione: data.info.Descrizione,
    });

    const handleSave = async () => {
        const res = await updatePatientAction(patientId, data.info.Utente_id, editData);
        if (res.success) {
            setIsEditing(false);
            setShowSuccess(true);
            router.refresh(); // Aggiorna i dati nel server component
            setTimeout(() => setShowSuccess(false), 2000);
        } else {
            alert(res.error)
        }
    };

    const handleDelete = async () => {
        const res = await softDeletePatientAction(patientId);
        if (res.success) {
            router.push("/caregiver/pazienti");
        } else {
            alert(res.error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {showSuccess && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-950 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
                        <span className="text-blue-400 font-black">✓</span>
                        <span className="font-black text-sm uppercase tracking-widest">
                            Dati aggiornati
                        </span>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                    Dati della Cartella
                </h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl font-black text-xs hover:bg-blue-50 hover:text-blue-800 transition-all"
                    >
                        MODIFICA DATI
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-slate-800 font-black text-xs uppercase px-4"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-700 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg"
                        >
                            SALVA
                        </button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">
                                Profilo Clinico
                            </p>
                            <p className="text-slate-950 font-black text-lg mb-1">
                                {data.info.Patologia}
                            </p>
                            <p className="text-slate-800 leading-relaxed italic font-medium">
                                "
                                {data.info.Descrizione ||
                                    "Nessuna nota descrittiva presente."}
                                "
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">
                                Dati di Accesso
                            </p>
                            <p className="text-slate-950 font-black text-lg">
                                {data.info.Nome} {data.info.Cognome}
                            </p>
                            <p className="text-slate-800 font-bold">
                                {data.info.Email}
                            </p>
                            <p className="text-[10px] text-slate-700 mt-2 font-black italic">
                                Iscritto il: {data.info.Data_Creazione}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* INPUT MODIFICA - Sfondo bianco e testo nero */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                                Nome
                            </label>
                            <input
                                value={editData.nome}
                                onChange={(e) =>
                                    setEditData({ ...editData, nome: e.target.value })
                                }
                                className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                                Cognome
                            </label>
                            <input
                                value={editData.cognome}
                                onChange={(e) =>
                                    setEditData({ ...editData, cognome: e.target.value })
                                }
                                className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                                Email Accesso
                            </label>
                            <input
                                value={editData.email}
                                onChange={(e) =>
                                    setEditData({ ...editData, email: e.target.value })
                                }
                                className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-bold rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-800 uppercase ml-1">
                                Note Cliniche
                            </label>
                            <textarea
                                value={editData.descrizione}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        descrizione: e.target.value,
                                    })
                                }
                                rows="3"
                                className="w-full p-4 bg-white border border-slate-300 text-slate-950 font-medium rounded-2xl mt-1 resize-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-12 mt-12 border-t border-slate-200">
                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h4 className="text-red-900 font-black text-lg tracking-tight">
                            Zona Pericolo
                        </h4>
                        <p className="text-red-800 text-xs font-bold leading-relaxed">
                            Eliminazione del paziente
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDeleting(true)}
                        className="whitespace-nowrap bg-white text-red-700 border-2 border-red-300 px-8 py-3 rounded-2xl font-black text-xs hover:bg-red-700 hover:text-white transition-all shadow-md"
                    >
                        DISATTIVA PAZIENTE
                    </button>
                </div>
            </div>
            {isDeleting && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300 border border-slate-300">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-red-200">
                            ⚠️
                        </div>
                        <h3 className="text-2xl font-black text-slate-950 mb-2">
                            Confermi?
                        </h3>
                        <p className="text-slate-800 text-sm font-bold mb-10 leading-relaxed italic">
                            Il profilo di <strong>{data.info.Nome}</strong> verrà disattivato.
                            Potrai recuperarlo contattando l'assistenza database.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="flex-1 py-4 font-black text-slate-800 uppercase text-xs tracking-widest hover:bg-slate-100 rounded-2xl"
                            >
                                Chiudi
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-4 bg-red-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-200"
                            >
                                Disattiva
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}