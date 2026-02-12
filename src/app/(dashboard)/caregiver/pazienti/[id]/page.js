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

    // --- 1. FUNZIONE DI CARICAMENTO DATI ---
    const loadPatientData = useCallback(async () => {
        const res = await getDetailedPatientAction(patientId);
        setData(res);
        setEditData({
            nome: res.info.nome,
            email: res.info.email,
            patologia: res.info.patologia,
            descrizione: res.info.descrizione
        });
        setLoading(false);
    }, [patientId]);

    // Caricamento iniziale
    useEffect(() => {
        loadPatientData();
    }, [loadPatientData]);

    // --- 2. LOGICA DI SALVATAGGIO AGGIORNATA ---
    const handleSave = async () => {
        setLoading(true); // Opzionale: mostra un caricamento durante il salvataggio
        const res = await updatePatientAction(patientId, data.info.utente_id, editData);

        if (res.success) {
            // PRIMA ricarichiamo i dati dal DB
            await loadPatientData();
            // POI chiudiamo la modalità modifica
            setIsEditing(false);

            // MOSTRA IL FEEDBACK
            setShowSuccess(true);

            // NASCONDI DOPO 2 SECONDI
            setTimeout(() => setShowSuccess(false), 2000);
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        const res = await softDeletePatientAction(patientId);
        if (res.success) {
            router.push("/caregiver/pazienti"); // Torna alla lista dopo l'eliminazione
        } else {
            alert(res.error);
            setIsDeleting(false);
        }
    };

    const handleAssign = async (esercizioId) => {
        const res = await assignExerciseAction(patientId, esercizioId);
        if (res.success) {
            setShowAssignModal(false);
            loadPatientData(); // Ricarichiamo la scheda per vedere il nuovo esercizio in lista
        } else {
            alert(res.error);
        }
    };

    const handleUnassign = async (assegnazioneId) => {
        if (!confirm("Vuoi davvero rimuovere questo esercizio assegnato?")) return;

        const res = await unassignExerciseAction(assegnazioneId, patientId);
        if (res.success) {
            // Ricarichiamo i dati per aggiornare la lista
            await loadPatientData();
        } else {
            alert(res.error);
        }
    };

    if (loading) return <div className="p-10 text-center">Caricamento cartella...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* PULSANTE TORNA INDIETRO */}
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold ml-2"
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    ←
                </div>
                Torna alla lista
            </button>

            {/* MESSAGGIO DI SUCCESSO (Floating Toast) */}
            {showSuccess && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
                        <span className="text-xl">✅</span>
                        <span className="font-bold">Dati salvati con successo!</span>
                    </div>
                </div>
            )}
            {/* Header con Avatar */}
            <header className="flex items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black">
                    {data.info.nome?.[0] || "P"}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{data.info.nome}</h1>
                    <p className="text-slate-400 font-mono">ID Paziente: #{patientId}</p>
                </div>
            </header>

            {/* Navigazione Tab */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
                {["anagrafica", "esercizi", "statistiche"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Contenuto Tab */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
                {activeTab === "anagrafica" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-xl font-bold text-slate-800">Dati del Paziente</h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-blue-600 font-bold hover:underline">
                                    ✏️ Modifica
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button onClick={() => setIsEditing(false)} className="text-slate-400 font-bold">Annulla</button>
                                    <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">Salva</button>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            // VISTA VISUALIZZAZIONE
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <section className="space-y-4">
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Informazioni Cliniche</p>
                                    <p><strong>Diagnosi:</strong> {data.info.patologia}</p>
                                    <p className="italic text-slate-600">"{data.info.descrizione || 'Nessuna nota'}"</p>
                                </section>
                                <section className="space-y-4">
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Account e Contatti</p>
                                    <p><strong>Nome Completo:</strong> {data.info.nome}</p>
                                    <p><strong>Email Accesso:</strong> {data.info.email}</p>
                                </section>
                            </div>
                        ) : (
                            // VISTA MODIFICA
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-in fade-in duration-300">
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-500">Nome Completo</span>
                                        <input
                                            value={editData.nome}
                                            onChange={e => setEditData({ ...editData, nome: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-500">Diagnosi</span>
                                        <select
                                            value={editData.patologia}
                                            onChange={e => setEditData({ ...editData, patologia: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border rounded-xl mt-1"
                                        >
                                            <option>Alzheimer</option>
                                            <option>Demenza Vascolare</option>
                                            <option>MCI (Lieve)</option>
                                            <option>Parkinson</option>
                                        </select>
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-500">Email di Accesso</span>
                                        <input
                                            value={editData.email}
                                            onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border rounded-xl mt-1"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-slate-500">Note Cliniche</span>
                                        <textarea
                                            value={editData.descrizione}
                                            onChange={e => setEditData({ ...editData, descrizione: e.target.value })}
                                            rows="3"
                                            className="w-full p-3 bg-slate-50 border rounded-xl mt-1 resize-none"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        <hr className="border-slate-100" />

                        <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                            <h4 className="text-red-800 font-bold mb-2">Zona di Pericolo</h4>
                            <p className="text-red-600/70 text-sm mb-4">
                                L'eliminazione del paziente rimuoverà permanentemente la cartella clinica,
                                l'account di accesso e tutto lo storico degli esercizi.
                            </p>
                            <button
                                onClick={() => setIsDeleting(true)}
                                className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Elimina Paziente
                            </button>
                        </section>

                        {/* MODALE DI CONFERMA ELIMINAZIONE */}
                        {isDeleting && (
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                                <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in duration-200">
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                        ⚠️
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">Sei sicuro?</h3>
                                    <p className="text-slate-500 text-sm mb-8">
                                        Questa azione non è reversibile. Tutti i dati di <strong>{data.info.nome}</strong> andranno perduti.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsDeleting(false)}
                                            className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl"
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200"
                                        >
                                            Sì, Elimina
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "esercizi" && (
                    // per mostrare tutti gli esercizi assegnati 
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">Esercizi Assegnati</h3>
                            {/* pulsante per assegnare un nuovo esercizio */}
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                            >
                                + Assegna Nuovo
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {data.esercizi.length > 0 ? data.esercizi.map((ex, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                                            {ex.tipo === 'quiz' ? '🧩' : ex.tipo === 'calcolo' ? '🔢' : '🧠'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{ex.titolo}</h4>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                Assegnato il: {new Date(ex.data_assegnazione).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Mostriamo il tasto rimuovi solo se l'esercizio non è ancora stato completato */}
                                        {ex.stato === 'da_svolgere' && (
                                            <button
                                                onClick={() => handleUnassign(ex.assegnazione_id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-red-400 hover:text-red-600 px-4 py-2"
                                            >
                                                Rimuovi Errore
                                            </button>
                                        )}

                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ex.stato === 'completato' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {ex.stato.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {/* <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ex.stato === 'completato' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {ex.stato.replace('_', ' ')}
                                        </span>
                                    </div> */}
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed">
                                    Nessun esercizio assegnato al momento.
                                </div>
                            )}
                        </div>

                        {showAssignModal && (
                            <AssignModal
                                onAssign={handleAssign}
                                onClose={() => setShowAssignModal(false)}
                            />
                        )}
                    </div>
                )}

                {activeTab === "statistiche" && (
                    <StatistichePaziente stats={data.stats} />
                )}
            </div>
        </div>
    );
}