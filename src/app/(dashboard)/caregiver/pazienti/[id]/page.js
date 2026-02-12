"use client";
import { useState, useEffect, use, useCallback } from "react";
import { getDetailedPatientAction, updatePatientAction, softDeletePatientAction } from "@/app/actions/patients";
import { assignExerciseAction, unassignExerciseAction } from "@/app/actions/assignments";
import StatistichePaziente from "@/app/components/layout/caregiver/StatistichePaziente";
import AssignModal from "@/app/components/layout/caregiver/AssignModel";

import { useRouter } from "next/navigation";

export default function SchedaPaziente({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const patientId = resolvedParams.id;

    const [activeTab, setActiveTab] = useState("anagrafica");
    const [data, setData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    // --- 1. CARICAMENTO DATI (ALLINEATO AL DB) ---
    const loadPatientData = useCallback(async () => {
        const res = await getDetailedPatientAction(patientId);
        if (res) {
            setData(res);
            // Inizializziamo il form di modifica con i nomi corretti del DB
            setEditData({
                nome: res.info.Nome,
                cognome: res.info.Cognome, // Aggiunto cognome
                email: res.info.Email,
                patologia: res.info.Patologia,
                descrizione: res.info.Descrizione
            });
        }
        setLoading(false);
    }, [patientId]);

    useEffect(() => {
        loadPatientData();
    }, [loadPatientData]);

    // --- 2. LOGICA SALVATAGGIO ---
    const handleSave = async () => {
        setLoading(true);
        // Passiamo Utente_id (maiuscolo come da schema)
        const res = await updatePatientAction(patientId, data.info.Utente_id, editData);

        if (res.success) {
            await loadPatientData();
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } else {
            alert(res.error);
        }
        setLoading(false);
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

    const handleAssign = async (esercizioId) => {
        const res = await assignExerciseAction(patientId, esercizioId);
        if (res.success) {
            setShowAssignModal(false);
            loadPatientData();
        } else {
            alert(res.error);
        }
    };

    const handleUnassign = async (assegnazioneId) => {
        if (!confirm("Vuoi davvero rimuovere questo esercizio assegnato?")) return;
        const res = await unassignExerciseAction(assegnazioneId, patientId);
        if (res.success) {
            await loadPatientData();
        } else {
            alert(res.error);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Caricamento cartella clinica...</div>;
    if (!data) return <div className="p-10 text-center">Paziente non trovato.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Navigazione Back */}
            <button
                onClick={() => router.push("/caregiver/pazienti")}
                className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold ml-2"
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    ←
                </div>
                Torna alla lista pazienti
            </button>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
                        <span className="text-blue-400 font-black">✓</span>
                        <span className="font-bold text-sm uppercase tracking-widest">Dati aggiornati</span>
                    </div>
                </div>
            )}

            {/* Header Profilo */}
            <header className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-100">
                    {data.info.Nome[0]}{data.info.Cognome[0]}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        {data.info.Nome} {data.info.Cognome}
                    </h1>
                    <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-black uppercase tracking-wider">
                            {data.info.Patologia}
                        </span>
                        <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded-lg font-bold">
                            ID: #{patientId}
                        </span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] w-fit">
                {["anagrafica", "esercizi", "statistiche"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Contenuto Dinamico */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 min-h-[450px]">
                
                {/* --- TAB ANAGRAFICA --- */}
                {activeTab === "anagrafica" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight text-balance">Dati della Cartella</h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    MODIFICA DATI
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setIsEditing(false)} className="text-slate-400 font-bold text-xs uppercase px-4">Annulla</button>
                                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-blue-100">SALVA</button>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Profilo Clinico</p>
                                        <p className="text-slate-800 font-bold text-lg mb-1">{data.info.Patologia}</p>
                                        <p className="text-slate-500 leading-relaxed italic">"{data.info.Descrizione || 'Nessuna nota descrittiva presente.'}"</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Dati di Accesso</p>
                                        <p className="text-slate-800 font-bold">{data.info.Nome} {data.info.Cognome}</p>
                                        <p className="text-slate-500 font-medium">{data.info.Email}</p>
                                        <p className="text-[10px] text-slate-300 mt-2 font-bold italic">Iscritto il: {new Date(data.info.Data_Creazione).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nome</label>
                                        <input value={editData.nome} onChange={e => setEditData({...editData, nome: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Cognome</label>
                                        <input value={editData.cognome} onChange={e => setEditData({...editData, cognome: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Accesso</label>
                                        <input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Note Cliniche</label>
                                        <textarea value={editData.descrizione} onChange={e => setEditData({...editData, descrizione: e.target.value})} rows="3" className="w-full p-4 bg-slate-50 border rounded-2xl mt-1 resize-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-12 mt-12 border-t border-slate-50">
                            <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h4 className="text-red-800 font-black text-lg tracking-tight">Zona Pericolo</h4>
                                    <p className="text-red-600/60 text-xs font-bold leading-relaxed">
                                        L'eliminazione del paziente è di tipo logico. I dati rimarranno nel database <br/> ma il paziente non potrà più accedere e non sarà visibile nella lista.
                                    </p>
                                </div>
                                <button onClick={() => setIsDeleting(true)} className="whitespace-nowrap bg-white text-red-600 border-2 border-red-100 px-8 py-3 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    DISATTIVA PAZIENTE
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB ESERCIZI --- */}
                {activeTab === "esercizi" && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight text-balance italic">Piano di Riabilitazione</h3>
                            <button onClick={() => setShowAssignModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:scale-105 transition-all">
                                + ASSEGNA NUOVO
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {data.esercizi && data.esercizi.length > 0 ? data.esercizi.map((ex, i) => (
                                <div key={i} className="group flex justify-between items-center p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            {ex.Tipo === 'quiz' ? '🧩' : ex.Tipo === 'calcolo' ? '🔢' : '🧠'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg leading-tight">{ex.Titolo}</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mt-1">
                                                {ex.Tipo} — {new Date(ex.Data_Assegnazione).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {ex.Stato === 'da_svolgere' && (
                                            <button onClick={() => handleUnassign(ex.assegnazione_id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest px-4">
                                                Annulla
                                            </button>
                                        )}
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            ex.Stato === 'completato' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {ex.Stato.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-100">
                                    <p className="text-slate-400 font-bold">Nessun esercizio attivo per questo paziente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB STATISTICHE --- */}
                {activeTab === "statistiche" && (
                    <div className="animate-in fade-in duration-500">
                        <StatistichePaziente stats={data.stats} />
                    </div>
                )}
            </div>

            {/* Modal Assegnazione */}
            {showAssignModal && (
                <AssignModal onAssign={handleAssign} onClose={() => setShowAssignModal(false)} />
            )}

            {/* Modal Conferma Eliminazione */}
            {isDeleting && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">⚠️</div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Confermi?</h3>
                        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed italic">
                            Il profilo di <strong>{data.info.Nome}</strong> verrà disattivato. Potrai recuperarlo contattando l'assistenza database.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleting(false)} className="flex-1 py-4 font-black text-slate-300 uppercase text-xs tracking-widest">Chiudi</button>
                            <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-100">Disattiva</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}