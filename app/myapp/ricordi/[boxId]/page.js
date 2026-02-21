import { getMemoryBoxDetailAction } from "@/lib/actions/memory";
import VisualizzatoreRicordi from "@/components/paziente/VisualizzatoreRicordi";
import Link from "next/link";

export default async function VisualizzatorePage({ params }) {
  const { boxId } = await params;

  // Recupero dati sul server
  const data = await getMemoryBoxDetailAction(boxId);

  // Se il box non esiste o è vuoto, gestiamo l'errore subito
  if (!data || !data.items || data.items.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-white p-6">
        {/* Pulsante in alto a sinistra */}
        <header className="absolute top-0 left-0 p-8">
          <Link
            href="/myapp/ricordi"
            className="flex items-center text-xl font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            <span className="mr-2">←</span> Indietro
          </Link>
        </header>

        {/* Messaggio centrale */}
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black text-slate-400 italic leading-snug">
            Non ci sono ricordi <br /> al momento per te...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <VisualizzatoreRicordi
      initialItems={data.items}
      boxInfo={data.box}
    />
  );
}