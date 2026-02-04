"use client";

export default function ExercisePreview({ esercizio, onClose }) {
    if (!esercizio) return null;

    // Trasformiamo la stringa JSON in oggetto
    const contenuto = JSON.parse(esercizio.contenuto_json);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">

                {/* Header Modale */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {esercizio.tipo}
                        </span>
                        <h2 className="text-3xl font-black text-slate-800 mt-3">{esercizio.titolo}</h2>
                        <p className="text-slate-500 mt-2 text-sm italic">{esercizio.descrizione}</p>
                    </div>
                    <button onClick={onClose} className="bg-white p-3 rounded-full shadow-sm hover:bg-slate-100 transition-colors text-2xl">
                        ✕
                    </button>
                </div>

                {/* Lista Quesiti */}
                <div className="p-8 overflow-y-auto space-y-8 flex-1">
                    {contenuto.domande.map((q, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                                    {idx + 1}
                                </span>
                                <h4 className="font-bold text-lg text-slate-700">{q.testo}</h4>
                            </div>

                            {q.media && (
                                <div className="my-4 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 flex justify-center p-4">
                                    {q.media.tipo === 'image' && (
                                        <img src={q.media.url} alt="Supporto visivo" className="max-h-64 rounded-xl shadow-md" />
                                    )}
                                    {q.media.tipo === 'audio' && (
                                        <audio controls className="w-full max-w-md">
                                            <source src={q.media.url} type="audio/mpeg" />
                                        </audio>
                                    )}
                                    {q.media.tipo === 'video' && (
                                        <video controls className="max-h-64 rounded-xl shadow-md">
                                            <source src={q.media.url} type="video/mp4" />
                                        </video>
                                    )}
                                </div>
                            )}

                            {/* Se è un esercizio di calcolo, mostra lo scenario */}
                            {q.scenario && (
                                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-800 text-sm">
                                    <strong>Scenario:</strong> {q.scenario}
                                </div>
                            )}

                            {/* Opzioni di risposta */}
                            <div className="grid grid-cols-1 gap-2 ml-11">
                                {q.opzioni.map((opt, oIdx) => (
                                    <div
                                        key={oIdx}
                                        className={`p-3 rounded-xl border text-sm font-medium ${opt.isCorretta // Ora controlliamo la proprietà booleana
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'bg-slate-50 border-slate-100 text-slate-500'
                                            }`}
                                    >
                                        {opt.testo} {opt.isCorretta && <span className="ml-2">✅</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all"
                    >
                        Chiudi Anteprima
                    </button>
                </div>
            </div>
        </div>
    );
}