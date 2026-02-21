import { cookies } from "next/headers";
import Link from "next/link";
import { getAssignedExercisesAction } from "@/lib/actions/assignments";

export default async function ListaEserciziPazientePage() {
  // 1. Recuperiamo l'ID del paziente dai cookie (configurato nel login)
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile-id")?.value;

  // 2. Recuperiamo i dati direttamente (il server aspetta qui prima di inviare l'HTML)
  // Nota: usiamo l'azione che hai già scritto
  const esercizi = profileId 
    ? await getAssignedExercisesAction(profileId, "da_svolgere") 
    : [];

  return (
    <div className="min-h-screen bg-white p-8 animate-in fade-in duration-700">
      {/* Header di Navigazione Semplificato */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link
          href="/app"
          className="text-2xl font-black text-slate-500 hover:text-slate-950 transition-colors"
        >
          ← TORNA INDIETRO
        </Link>
        <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">
          I tuoi compiti
        </h1>
        <div className="w-20"></div> {/* Spacer per bilanciare il flex */}
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {esercizi && esercizi.length > 0 ? (
          esercizi.map((ex) => (
            <Link
              key={ex.Id}
              href={`/myapp/esercizi/${ex.Id}`}
              className="flex items-center justify-between p-6 bg-white border-[10px] border-slate-100 rounded-[4rem] shadow-2xl hover:border-blue-600 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center gap-10">
                <span className="text-[7rem] group-hover:rotate-12 transition-transform duration-300">
                  {ex.Type === "quiz"
                    ? "🧩"
                    : ex.Type === "calcolo"
                      ? "🔢"
                      : "🧠"}
                </span>
                <div>
                  <h2 className="text-5xl font-black text-slate-950 leading-none">
                    {ex.Title}
                  </h2>
                  <p className="text-2xl font-bold text-slate-400 uppercase mt-4 tracking-widest">
                    Esercizio di {ex.Type}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-600 text-white px-10 py-6 rounded-[2.5rem] text-3xl font-black shadow-lg group-hover:bg-blue-700">
                INIZIA →
              </div>
            </Link>
          ))
        ) : (
          /* Stato Vuoto: Messaggio di Rinforzo Positivo */
          <div className="text-center py-32 bg-green-50 rounded-[5rem] border-8 border-dashed border-green-200">
            <span className="text-9xl block mb-8">🌟</span>
            <h3 className="text-5xl font-black text-green-900 mb-4">
              OTTIMO LAVORO!
            </h3>
            <p className="text-2xl font-bold text-green-700 italic max-w-md mx-auto leading-relaxed">
              Hai completato tutti gli esercizi <br /> che avevi in programma per oggi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}