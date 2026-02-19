import StatistichePaziente from "@/components/caregiver/gestionePazienti/PatientStatistics";
import Link from "next/link";
import EserciziPaziente from "./PatientExercises";
import AnagraficaPaziente from "./PatientRegistry";

export default function PaginaPaziente({ data, patientId, activeTab }) {

    // ... (Tutte le altre funzioni handle rimangono simili)

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <Link
                href={`/pazienti`}
                className="block mb-6 text-[10px] font-black text-slate-700 hover:text-blue-700 uppercase tracking-widest border border-slate-300 px-4 py-2 rounded-xl bg-white shadow-sm transition-all"
            >
                ← Torna alla lista dei pazienti
            </Link>

            {/* Success Toast - Rinforzato */}
            

            {/* Header Profilo - Bordi e Testi rinforzati */}
            <header className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-300">
                <div className="w-20 h-20 rounded-3xl bg-blue-700 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-100">
                    {data.info.Name[0]}
                    {data.info.Surname[0]}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                        {data.info.Name} {data.info.Surname}
                    </h1>
                    <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded-lg font-black border border-blue-100 uppercase tracking-wider">
                            {data.info.Patologia}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-black border border-slate-200">
                            ID: #{patientId}
                        </span>
                    </div>
                </div>
            </header>

            {/* Tabs - Contrasto aumentato */}
            <div className="flex gap-2 p-1.5 bg-slate-200 rounded-[1.5rem] w-fit">
                {["anagrafica", "esercizi", "statistiche"].map((tab) => (
                    //   <button
                    //     key={tab}
                    //     onClick={() => setActiveTab(tab)}
                    //     className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    //       activeTab === tab
                    //         ? "bg-white text-blue-800 shadow-md"
                    //         : "text-slate-700 hover:text-slate-950"
                    //     }`}
                    //   >
                    //     {tab}
                    //   </button>
                    <Link
                        key={tab}
                        href={`/pazienti/${patientId}?tab=${tab}`}
                        scroll={false} // Evita lo scatto della pagina verso l'alto
                        className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab
                                ? "bg-white text-blue-800 shadow-md"
                                : "text-slate-700 hover:text-slate-950"
                            }`}
                    >
                        {tab}
                    </Link>
                ))}
                <Link
                    href={`/pazienti/${patientId}/ricordi`}
                    className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-slate-700 hover:text-slate-950"
                >
                    Box Ricordi
                </Link>
            </div>

            {/* Contenuto Dinamico - Bordo Slate 300 */}
            <div className="bg-white p-8 rounded-[3rem] shadow-md border border-slate-300 min-h-[450px]">
                {activeTab === "anagrafica" && (<AnagraficaPaziente data={data} patientId={patientId} />)
                }

                {activeTab === "esercizi" && (
                    <EserciziPaziente data={data} patientId={patientId} />
                )}

                {activeTab === "statistiche" && (
                    <div className="animate-in fade-in duration-500">
                        <StatistichePaziente stats={data.stats} />
                    </div>
                )}
            </div>

            {/* Modals - Rinforzati i contrasti dei testi */}
            

            
        </div>
    );
}