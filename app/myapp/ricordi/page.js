import { cookies } from "next/headers";
import Link from "next/link";
import { getMemoryBoxesAction } from "@/lib/actions/memory";

export default async function GalleriaRicordiPazientePage() {
  // 1. Recupero dell'identità dal cookie sicuro
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile-id")?.value;

  // 2. Caricamento immediato dei box dal database
  const boxes = profileId 
    ? await getMemoryBoxesAction(profileId) 
    : [];

  return (
    <div className="min-h-screen bg-white p-8 animate-in fade-in duration-1000">
      {/* Header di navigazione ultra-semplice */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <Link
          href="/myapp"
          className="text-2xl font-black text-slate-400 hover:text-slate-950 transition-colors"
        >
          ← TORNA ALL'INIZIO
        </Link>
        <h1 className="text-5xl font-black text-slate-950 italic tracking-tighter">
          I tuoi ricordi
        </h1>
        <div className="w-20"></div> {/* Bilanciamento ottico */}
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {boxes && boxes.length > 0 ? (
          boxes.map((box) => (
            <Link
              key={box.Id}
              href={`/myapp/ricordi/${box.Id}`}
              className="group relative bg-white border-[10px] border-slate-100 rounded-[5rem] overflow-hidden shadow-2xl hover:border-purple-600 hover:scale-[1.02] transition-all aspect-[4/3] flex flex-col"
            >
              {/* Parte Superiore: Icona evocativa */}
              <div className="flex-1 bg-purple-50 flex items-center justify-center relative overflow-hidden">
                <span className="text-[10rem] group-hover:scale-125 transition-transform duration-500 z-10">
                  {box.Category === "Famiglia" ? "👨‍👩‍👧‍👦" : 
                   box.Category === "Viaggi" ? "🌍" : "📸"}
                </span>
                {/* Decorazione di sfondo per rendere il box più "prezioso" */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,purple_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              </div>

              {/* Parte Inferiore: Testo leggibile */}
              <div className="p-10 bg-white border-t-4 border-slate-100 flex flex-col justify-center">
                <p className="text-sm font-black text-purple-700 uppercase tracking-[0.4em] mb-2">
                  {box.Category}
                </p>
                <h2 className="text-4xl font-black text-slate-950 uppercase leading-none">
                  {box.Title}
                </h2>
              </div>
            </Link>
          ))
        ) : (
          /* Stato Vuoto: Messaggio rassicurante */
          <div className="col-span-full text-center py-32 bg-slate-50 rounded-[5rem] border-8 border-dashed border-slate-200">
            <span className="text-8xl block mb-6 opacity-30">📂</span>
            <p className="text-3xl font-black text-slate-400 italic leading-relaxed">
              Non sono presenti al momento ricordi per te
            </p>
          </div>
        )}
      </div>
    </div>
  );
}