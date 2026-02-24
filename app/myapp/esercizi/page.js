import { cookies } from "next/headers";
import Link from "next/link";
import { getAssignedExercisesAction } from "@/lib/actions/assignments";

export default async function ListaEserciziPazientePage() {
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile-id")?.value;

  const esercizi = profileId 
    ? await getAssignedExercisesAction(profileId, "da_svolgere") 
    : [];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 animate-in fade-in duration-700">
      
      {/* Header: Colonna su mobile per dare spazio al titolo */}
      <header className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
        <Link
          href="/app"
          className="text-lg sm:text-2xl font-black text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-tight"
        >
          ← Indietro
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tighter text-center">
          I tuoi compiti
        </h1>
        <div className="hidden sm:block w-24"></div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {esercizi && esercizi.length > 0 ? (
          esercizi.map((ex) => (
            <Link
              key={ex.Id}
              href={`/myapp/esercizi/${ex.Id}`}
              className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-10 bg-white border-[6px] sm:border-[10px] border-slate-100 rounded-[2.5rem] sm:rounded-[4rem] shadow-xl hover:border-blue-600 hover:scale-[1.02] transition-all group gap-6 text-center sm:text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                {/* Icona: Ridotta su mobile ma sempre centrale */}
                <span className="text-[4rem] sm:text-[5rem] group-hover:rotate-12 transition-transform duration-300">
                  {ex.Type === "quiz" ? "🧩" : ex.Type === "calcolo" ? "🔢" : "🧠"}
                </span>
                
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
                    {ex.Title}
                  </h2>
                  <p className="text-sm sm:text-2xl font-bold text-slate-400 uppercase mt-1 sm:mt-4 tracking-widest">
                    Esercizio di {ex.Type}
                  </p>
                </div>
              </div>
              
              {/* Bottone: Larghezza piena su mobile per un tocco facilissimo */}
              <div className="w-full sm:w-auto bg-blue-600 text-white px-8 sm:px-10 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2.5rem] text-xl sm:text-3xl font-black shadow-lg group-hover:bg-blue-700 transition-colors">
                INIZIA →
              </div>
            </Link>
          ))
        ) : (
          /* Stato Vuoto Responsive */
          <div className="text-center py-16 sm:py-32 px-6 bg-green-50 rounded-[3rem] sm:rounded-[5rem] border-4 sm:border-8 border-dashed border-green-200">
            <span className="text-5xl sm:text-7xl block mb-6 sm:mb-8">🌟</span>
            <h3 className="text-2xl sm:text-4xl font-black text-green-900 mb-2 sm:mb-4">
              OTTIMO LAVORO!
            </h3>
            <p className="text-lg sm:text-2xl font-bold text-green-700 italic max-w-md mx-auto leading-relaxed">
              Hai completato tutti gli esercizi <br className="hidden sm:block" /> di oggi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}