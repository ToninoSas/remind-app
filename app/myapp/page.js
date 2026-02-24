import { cookies } from "next/headers";
import Link from "next/link";
import { getDetailedPatientAction } from "@/lib/actions/patients";

export default async function PazienteDashboard() {
  // 1. Recuperiamo l'ID del paziente dal cookie sicuro
  const cookieStore = await cookies();
  const userId = cookieStore.get("user-id")?.value;

  // 2. Recuperiamo le info del paziente (per avere il nome)
  // Usiamo l'azione che abbiamo già, passando l'ID dal server
  const patientData = userId ? await getDetailedPatientAction(userId) : null;
  const nome = patientData?.info?.Nome || "caro amico";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-12 py-10 px-6 animate-in fade-in duration-1000">
      {/* Saluto Gigante e Rassicurante */}
      <h1 className="text-6xl font-black text-blue-950 text-center leading-tight tracking-tighter">
        Ciao {nome}, <br />
        <span className="text-slate-400">cosa vogliamo fare?</span>
      </h1>

      <div className="flex flex-col gap-10 w-full max-w-xl">
        {/* BOTTONE ESERCIZI - Arancione per l'energia */}
        <Link href="/myapp/esercizi" className="block w-full">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white p-16 rounded-[4rem] text-3xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all border-[12px] border-orange-200">
            <span className="block mb-2 text-7xl">🎮</span>
            GIOCA ORA
          </button>
        </Link>

        {/* BOTTONE RICORDI - Viola per la calma/memoria */}
        <Link href="/myapp/ricordi" className="block w-full">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-16 rounded-[4rem] text-3xl font-black shadow-2xl hover:scale-[1.03] active:scale-95 transition-all border-[12px] border-purple-200">
            <span className="block mb-2 text-7xl">🖼️</span>I MIEI RICORDI
          </button>
        </Link>
      </div>
    </div>
  );
}
