"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getPatientsAction } from "@/actions/patients";
import AddPatientForm from "@/components/layout/caregiver/AddPatientForm";
import Link from "next/link";

export default function PazientiPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [pazienti, setPazienti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const currentId = user?.ID || user?.id;
      if (currentId) {
        const data = await getPatientsAction(currentId);
        setPazienti(data);
        setLoading(false);
      }
    }
    loadData();
  }, [user, showForm]);

  if (loading)
    return (
      <p className="p-10 text-center font-black text-slate-800">
        Caricamento pazienti...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header: Testo quasi nero per massimo contrasto */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-950 italic">
            I tuoi Pazienti
          </h1>
          <p className="text-slate-800 font-medium">
            Gestione e monitoraggio attività.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-800 transition-all"
          >
            + NUOVO PAZIENTE
          </button>
        )}
      </div>

      {showForm ? (
        <AddPatientForm onCancel={() => setShowForm(false)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pazienti.length > 0 ? (
            pazienti.map((p) => (
              /* Card con bordo rinforzato */
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
            /* Stato Vuoto: Bordi tratteggiati più visibili */
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-200">
              <p className="text-slate-800 font-black text-2xl mb-2">
                Nessun paziente in lista
              </p>
              <p className="text-slate-600 font-medium italic">
                Aggiungi il primo profilo per iniziare il monitoraggio.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
