"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteExerciseAction } from "@/actions/excercises";
import CreateExerciseForm from "@/components/caregiver/gestioneEsercizi/CreateExcerciseForm";
import ExercisePreview from "@/components/caregiver/gestioneEsercizi/ExercisePreview";

export default function LibreriaEsercizi({ initialEsercizi, activeFilter }) {
    const router = useRouter();

    // Stati per la vista e i modali (Interazione pura)
    const [view, setView] = useState("list"); // "list" | "form"
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [previewExercise, setPreviewExercise] = useState(null);
    const [isDeletingId, setIsDeletingId] = useState(null);

    // Logica di filtraggio (veloce, lato client)
    const filteredEsercizi = initialEsercizi.filter(ex =>
        activeFilter === "tutti" || ex.Tipo === activeFilter
    );

    const getBadgeStyle = (tipo) => {
        switch (tipo) {
            case 'memoria': return 'bg-purple-100 text-purple-700';
            case 'calcolo': return 'bg-blue-100 text-blue-700';
            case 'quiz': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleDelete = async (id) => {
        const res = await deleteExerciseAction(id);
        if (res.success) {
            setIsDeletingId(null);
            router.refresh(); // Ricarica i dati dal Server Component
        }
    };

    const handleOpenEdit = (ex) => {
        setSelectedExercise(ex);
        setView("form");
    };

    if (view === "form") {
        return (
            <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4">
                <button onClick={() => setView("list")} className="mb-8 flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">← Torna alla Libreria</button>
                <CreateExerciseForm
                    onSave={() => { setView("list"); router.refresh(); }}
                    initialData={selectedExercise}
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 italic">Libreria Esercizi</h1>
                    <p className="text-slate-700">Gestisci le attività cognitive personalizzate.</p>
                </div>
                <button onClick={() => { setSelectedExercise(null); setView("form"); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
                    + Nuovo Esercizio
                </button>
            </div>

            {/* FILTRI (Ora usano Link per cambiare l'URL) */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
                {['tutti', 'memoria', 'calcolo', 'quiz'].map((t) => (
                    <Link
                        key={t}
                        href={`/esercizi?filter=${t}`}
                        scroll={false}
                        className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeFilter === t ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        {t}
                    </Link>
                ))}
            </div>

            {/* GRIGLIA CARD (Come la tua, ma usa filteredEsercizi) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEsercizi.map((ex) => (
                    //   <div key={ex.ID} onClick={() => setPreviewExercise(ex)} className="...">
                    //     {/* ... Contenuto della Card ... */}
                    //     {/* Nel tasto modifica usa: onClick={(e) => { e.stopPropagation(); handleOpenEdit(ex); }} */}
                    //   </div>
                    <div
                        key={ex.ID}
                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full cursor-pointer"
                        onClick={() => setPreviewExercise(ex)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${getBadgeStyle(ex.Tipo)}`}>
                                {ex.Tipo}
                            </span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full ${i < ex.Livello_Difficolta ? 'bg-orange-400' : 'bg-slate-100'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                            {ex.Titolo}
                        </h3>

                        <p className="text-sm text-slate-700 line-clamp-3 mb-8 flex-grow leading-relaxed italic">
                            "{ex.Descrizione || "Nessuna specifica clinica inserita."}"
                        </p>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">REF: #{ex.ID}</span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleOpenEdit(ex)}
                                    className="text-[10px] font-black text-blue-600 hover:underline tracking-widest"
                                >
                                    MODIFICA
                                </button>

                                <button
                                    onClick={() => setIsDeletingId(ex.ID)}
                                    className="text-[10px] font-black text-red-400 hover:text-red-600 tracking-widest"
                                >
                                    ELIMINA
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODALI (Preview e Delete) */}
            {previewExercise && <ExercisePreview esercizio={previewExercise} onClose={() => setPreviewExercise(null)} />}
            {isDeletingId && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Eliminare?</h3>
                    <p className="text-slate-700 text-sm font-medium mb-10 leading-relaxed italic">
                        L'esercizio verrà rimosso permanentemente dalla libreria.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsDeletingId(null)}
                            className="flex-1 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={() => handleDelete(isDeletingId)}
                            className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-100"
                        >
                            Elimina
                        </button>
                    </div>
                </div>
            </div>)}
        </div>
    );
}