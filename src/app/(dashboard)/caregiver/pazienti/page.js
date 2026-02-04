"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getPatientsAction } from "@/app/actions/patients";
import AddPatientForm from "@/app/components/layout/caregiver/AddPatientForm";
import Link from "next/link";

export default function PazientiPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [pazienti, setPazienti] = useState([]);
  const [loading, setLoading] = useState(true);

  // Caricamento dati
  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const data = await getPatientsAction(user.id);
        setPazienti(data);
        setLoading(false);
      }
    }
    loadData();
  }, [user, showForm]); // Ricarica se user cambia o se chiudiamo il form

  if (loading) return <p className="p-10 text-center font-bold">Caricamento pazienti...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 italic">I tuoi Pazienti</h1>
          <p className="text-slate-500">Gestione e monitoraggio attività.</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all"
          >
            + Nuovo Paziente
          </button>
        )}
      </div>

      {showForm ? (
        <AddPatientForm onCancel={() => setShowForm(false)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pazienti.length > 0 ?
            (
              pazienti.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                      {p.nome_completo?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold">{p.nome_completo}</h3>
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">
                        {p.patologia}
                      </span>
                    </div>
                  </div>

                  {/* DESCRIZIONE: Mostriamo solo un'anteprima */}
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 italic">
                    "{p.descrizione || "Nessuna nota presente"}"
                  </p>

                  {/* LINK ALLA CARTELLA CLINICA */}
                  <Link
                    href={`/caregiver/pazienti/${p.id}`}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-center hover:bg-blue-600 transition-colors mt-auto"
                  >
                    Apri Cartella
                  </Link>
                </div>
              ))) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xl text-balance">
                  Non ci sono ancora pazienti. <br /> Clicca su "Nuovo Paziente" per iniziare.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}