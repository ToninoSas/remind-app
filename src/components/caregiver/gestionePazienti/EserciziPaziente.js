import { useState } from "react";
import { assignExerciseAction, unassignExerciseAction, } from "@/actions/assignments";

export default function EserciziPaziente({ data, patientId }) {

    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleAssign = async (esercizioId) => {
        const res = await assignExerciseAction(patientId, esercizioId);
        if (res.success) {
            setShowAssignModal(false);
            router.refresh();
        } else {
            alert(res.error)
        }
    };

    const handleUnassign = async (esercizioId) => {
        if (!confirm("Vuoi davvero rimuovere questo esercizio assegnato?")) return;
        const res = await unassignExerciseAction(patientId, esercizioId);
        if (res.success) {
            setShowAssignModal(false);
            router.refresh();
        } else {
            alert(res.error)
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-950 tracking-tight italic">
                    Piano di Riabilitazione
                </h3>
                <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl hover:bg-blue-800 transition-all"
                >
                    + ASSEGNA NUOVO
                </button>
            </div>

            <div className="grid gap-4">
                {data.esercizi && data.esercizi.length > 0 ? (
                    data.esercizi.map((ex, i) => (
                        <div
                            key={i}
                            className="group flex justify-between items-center p-6 bg-white rounded-[2.5rem] border border-slate-300 shadow-sm hover:border-blue-400 transition-all"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    {ex.Tipo === "quiz"
                                        ? "🧩"
                                        : ex.Tipo === "calcolo"
                                            ? "🔢"
                                            : "🧠"}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-950 text-lg leading-tight">
                                        {ex.Titolo}
                                    </h4>
                                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.1em] mt-1">
                                        {ex.Tipo} —{" "}
                                        {new Date(ex.Data_Assegnazione).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {ex.Stato === "da_svolgere" && (
                                    <button
                                        onClick={() => handleUnassign(ex.assegnazione_id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-red-700 hover:text-red-900 uppercase tracking-widest px-4"
                                    >
                                        Annulla
                                    </button>
                                )}
                                <span
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ex.Stato === "completato"
                                        ? "bg-green-100 text-green-900 border-green-200"
                                        : "bg-orange-100 text-orange-900 border-orange-200"
                                        }`}
                                >
                                    {ex.Stato.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-300">
                        <p className="text-slate-800 font-black">
                            Nessun esercizio attivo per questo paziente.
                        </p>
                    </div>
                )}
            </div>
            {showAssignModal && (
                <AssignModal
                    onAssign={handleAssign}
                    onClose={() => setShowAssignModal(false)}
                />
            )}
        </div>);
}