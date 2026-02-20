import Link from "next/link";

export default function MemoryBoxList({ boxes, pazienteId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {!boxes || boxes.length === 0 ? (
        <div className="col-span-full bg-white rounded-[2.5rem] border border-slate-300 shadow-lg p-8 text-center">
          <h3 className="text-2xl font-black text-slate-950 mb-4">
            Nessun box di ricordi trovato
          </h3>
          <p className="text-slate-800 text-sm font-medium italic">
            Crea un nuovo box per iniziare a raccogliere i ricordi del paziente.
          </p>
        </div>
      ) : (
        boxes.map((box) => (
          <div
            key={box.ID}
            className="bg-white rounded-[2.5rem] border border-slate-300 shadow-lg overflow-hidden flex flex-col group hover:border-blue-500 transition-all"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-100">
                  {box.Categoria}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-2">
                {box.Titolo}
              </h3>
              <p className="text-slate-800 text-sm font-medium italic line-clamp-2">
                {box.Descrizione || "Nessuna descrizione per questo box."}
              </p>
            </div>

            <div className="mt-auto p-6 bg-slate-50 border-t border-slate-200">
              <Link
                href={`/pazienti/${pazienteId}/ricordi/${box.ID}`}
                className="block w-full py-4 bg-slate-950 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                Gestisci Ricordi
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
