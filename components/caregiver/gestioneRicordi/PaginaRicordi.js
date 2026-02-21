"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteMemoryItemAction, deleteMemoryBoxAction } from "@/actions/memory";

import PatientContextBanner from "@/components/caregiver/gestioneRicordi/PatientContextBanner";
import AddMemoryItemModal from "@/components/caregiver/gestioneRicordi/AddMemoryItemModal";
import EditMemoryBoxModal from "@/components/caregiver/gestioneRicordi/EditMemoryBoxModal";
import EditMemoryItemModal from "@/components/caregiver/gestioneRicordi/EditMemoryItemModal";

export default function DettaglioBox({
    paziente,
    initialBoxInfo,
    initialItems,
    pazienteId,
    boxId
}) {
    const router = useRouter();

    // Stati per i Modali
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditBoxModal, setShowEditBoxModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Funzione magica per aggiornare i dati senza caricamenti manuali
    const refreshData = () => {
        router.refresh(); // Chiede al Server Component sopra di ricaricare i dati
        setShowAddModal(false);
        setShowEditBoxModal(false);
        setEditingItem(null);
    };

    const handleDeleteBox = async () => {
        if (!confirm("Sei sicuro? Questo eliminerà il box e tutti i ricordi contenuti.")) return;
        const res = await deleteMemoryBoxAction(boxId, pazienteId);
        if (res.success) router.push(`/pazienti/${pazienteId}/ricordi`);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
            <PatientContextBanner paziente={paziente} />

            <div className="max-w-6xl mx-auto p-8">
                <Link
                    href={`/pazienti/${pazienteId}/ricordi`}
                    className="block mb-6 text-[10px] font-black text-slate-700 hover:text-blue-700 uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-xl bg-white shadow-sm transition-all w-fit"
                >
                    ← Torna alla lista dei box
                </Link>

                {/* --- HEADER BOX --- */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-300 shadow-xl mb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="max-w-2xl">
                            <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                                {initialBoxInfo?.Category}
                            </span>
                            <h1 className="text-5xl font-black text-slate-950 tracking-tighter italic mt-3">
                                {initialBoxInfo?.Title}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowEditBoxModal(true)} className="p-3 bg-slate-100 rounded-xl border border-slate-200 hover:bg-blue-50">✏️</button>
                            <button onClick={handleDeleteBox} className="p-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white">🗑️</button>
                        </div>
                    </div>
                    <p className="text-slate-800 text-lg font-medium italic border-l-4 border-slate-200 pl-6 mb-8">
                        {initialBoxInfo?.Descrizione}
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-blue-700 transition-all"
                    >
                        + AGGIUNGI NUOVO RICORDO
                    </button>
                </div>

                {/* --- GRIGLIA ITEM --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {initialItems.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-200">
                            <p className="text-slate-500 font-bold italic">Nessun ricordo in questo box.</p>
                        </div>
                    ) : (
                        initialItems.map((item) => (
                            <MemoryItemCard
                                key={item.Id}
                                item={item}
                                onEdit={() => setEditingItem(item)}
                                onDelete={async () => {
                                    if (confirm("Eliminare?")) {
                                        await deleteMemoryItemAction(item.Id, boxId, pazienteId);
                                        router.refresh();
                                    }
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* MODALI (Tutti chiamano refreshData al successo) */}
            {showAddModal && <AddMemoryItemModal boxId={boxId} onClose={() => setShowAddModal(false)} onSuccess={refreshData} />}
            {showEditBoxModal && <EditMemoryBoxModal box={initialBoxInfo} pazienteId={pazienteId} onClose={() => setShowEditBoxModal(false)} onSuccess={refreshData} />}
            {editingItem && <EditMemoryItemModal item={editingItem} boxId={boxId} pazienteId={pazienteId} onClose={() => setEditingItem(null)} onSuccess={refreshData} />}
        </div>
    );
}

// Piccolo componente interno per pulizia
function MemoryItemCard({ item, onEdit, onDelete }) {
    return (
        <div
            key={item.Id}
            className="bg-white rounded-[3rem] border border-slate-300 shadow-lg overflow-hidden group flex flex-col"
        >
            {/* --- PARTE SUPERIORE: MEDIA (Fissa in 16:9) --- */}
            <div className="relative w-full aspect-video bg-slate-100 border-b border-slate-200 flex items-center justify-center overflow-hidden">

                {item.Type === "foto" && (
                    <img
                        src={item.Url == "" ? null : item.Url}
                        alt={item.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}

                {item.Type === "video" && (
                    <video
                        src={item.Url}
                        controls
                        className="w-full h-full object-contain bg-black"
                    />
                )}

                {item.Type === "audio" && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 p-4">
                        {/* Icona ridimensionata per la card */}
                        <span className="text-5xl mb-2">🎵</span>
                        <audio
                            src={item.Url}
                            controls
                            className="w-full max-w-[200px] h-10 scale-90"
                        />
                    </div>
                )}
            </div>

            {/* --- PARTE INFERIORE: DATI E AZIONI --- */}
            <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-2xl font-black text-slate-950 leading-tight">
                                {item.Title}
                            </h4>
                            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">
                                {item.Location} • {item.Date}
                            </p>
                        </div>

                        {/* Pulsanti Azione */}
                        <div className="flex gap-4">
                            <button
                                onClick={onEdit}
                                className="text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors"
                            >
                                Modifica
                            </button>
                            <button
                                onClick={onDelete}
                                className="text-red-200 hover:text-red-600 font-bold transition-colors"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>

                    <p className="text-slate-700 font-medium italic leading-relaxed line-clamp-3">
                        "{item.Text}"
                    </p>
                </div>
            </div>
        </div>
    );
}