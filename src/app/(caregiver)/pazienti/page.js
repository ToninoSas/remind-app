import { cookies } from "next/headers";
import Link from "next/link";
import AddPatientButton from "@/components/caregiver/gestionePazienti/AddPatientButton";
import { getPatientsAction } from "@/actions/patients";

// SERVER COMPONENT
export default async function ListaPazientiPage() {
  // 1. Recuperiamo l'ID del caregiver dai cookie (lato server)
  const cookieStore = await cookies();
  const caregiverId = cookieStore.get("profile-id")?.value;

  // 2. usiamo l'action
  const pazienti = await getPatientsAction(caregiverId);

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 p-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-950">
            I Tuoi Pazienti
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">
            Gestione clinica e monitoraggio
          </p>
        </div>

        {/* Questo pulsante deve essere un Client Component perché ha un onClick */}
        <AddPatientButton />
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pazienti.length > 0 ? (
          pazienti.map((p) => (
            <div
              key={p.ID}
              className="bg-white p-6 rounded-3xl border border-slate-300 shadow-md flex flex-col hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar con contrasto aumentato */}
                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black border border-blue-200">
                  {p.Nome?.[0]}
                  {p.Cognome?.[0]}
                </div>

                <div>
                  <h3 className="font-black text-slate-950 leading-tight text-lg">
                    {p.Nome} {p.Cognome}
                  </h3>
                  <span className="text-[10px] bg-slate-200 px-2 py-1 rounded text-slate-900 font-black uppercase tracking-wider">
                    {p.Patologia}
                  </span>
                </div>
              </div>

              {/* Descrizione: Scurita per facilitare la lettura */}
              <p className="text-sm text-slate-800 mb-6 line-clamp-2 italic font-medium leading-relaxed">
                "{p.Descrizione || "Nessuna nota presente"}"
              </p>

              {/* Bottone: Nero pieno per staccare dal bianco della card */}
              <Link
                href={`/pazienti/${p.ID}`}
                className="w-full py-4 bg-slate-950 text-white rounded-xl font-black text-center hover:bg-blue-700 transition-all mt-auto shadow-sm"
              >
                APRI CARTELLA
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
            <p className="text-2xl font-bold text-slate-400 italic">
              Non hai ancora aggiunto nessun paziente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}