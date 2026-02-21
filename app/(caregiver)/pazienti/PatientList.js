// app/caregiver/pazienti/PatientsList.jsx
import { cookies } from "next/headers";
import { getPatientsAction } from "@/lib/actions/patients";
import Link from "next/link";

export default async function PatientsList() {
  const cookieStore = await cookies();
  const caregiverId = cookieStore.get("profile-id")?.value;

  // ⬇️ QUI avviene il delay di 4 secondi
  //   await new Promise(resolve => setTimeout(resolve, 4000)); // <-- ritardo reale
  const pazienti = await getPatientsAction(caregiverId);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pazienti.length > 0 ? (
        pazienti.map((p) => (
          <div
            key={p.Id}
            className="bg-white p-6 rounded-3xl border border-slate-300 shadow-md flex flex-col hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar con contrasto aumentato */}
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black border border-blue-200">
                {p.First_Name?.[0]}
                {p.Last_Name?.[0]}
              </div>

              <div>
                <h3 className="font-black text-slate-950 leading-tight text-lg">
                  {p.First_Name} {p.Last_Name}
                </h3>
                <span className="text-[10px] bg-slate-200 px-2 py-1 rounded text-slate-900 font-black uppercase tracking-wider">
                  {p.Condition}
                </span>
              </div>
            </div>

            {/* Descrizione: Scurita per facilitare la lettura */}
            <p className="text-sm text-slate-800 mb-6 line-clamp-2 italic font-medium leading-relaxed">
              "{p.Description || "Nessuna nota presente"}"
            </p>

            {/* Bottone: Nero pieno per staccare dal bianco della card */}
            <Link
              href={`/pazienti/${p.Id}`}
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
  );
}
