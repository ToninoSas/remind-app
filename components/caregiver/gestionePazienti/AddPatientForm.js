"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { createPatientAction } from "@/lib/actions/patients";
import { useRouter } from "next/navigation";
import * as z from "zod";

export default function AddPatientForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    patologia: "Alzheimer",
    descrizione: "",
    emailAccesso: "",
    passwordAccesso: "",
  });

  // ✅ Zod schema
  const formSchema = z.object({
    nome: z.string().min(1, "Nome obbligatorio"),
    cognome: z.string().min(1, "Cognome obbligatorio"),
    patologia: z.string(),
    descrizione: z.string().optional(),
    emailAccesso: z.string().email("Email non valida"),
    passwordAccesso: z.string().min(8, "Password minima 8 caratteri"),
  });

  // Aggiornamento dati
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Controllo validità in tempo reale
  useEffect(() => {
    const result = formSchema.safeParse(formData);
    setIsValid(result.success);
  }, [formData]);

  // Submit con Zod
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const firstError = Object.values(
        result.error.formErrors.fieldErrors,
      )[0][0];
      alert(firstError);
      return;
    }

    setLoading(true);

    const response = await createPatientAction(formData, user?.ProfileID);

    if (response?.success) {
      router.push("/pazienti");
    } else {
      alert(response?.error || "Errore durante il salvataggio.");
    }

    setLoading(false);
  };

  return (
  <div className="py-6 px-4 md:px-8">
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 p-6 md:p-8"
    >
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Nuovo Paziente
        </h1>
        <p className="text-slate-600 text-sm">
          Inserisci i dati clinici e crea le credenziali di accesso.
        </p>
      </div>

      {/* GRID PRINCIPALE DESKTOP */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* COLONNA SINISTRA - DATI CLINICI */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-800">
            Dati Clinici
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="nome"
              type="text"
              value={formData.nome}
              placeholder="Nome"
              onChange={handleChange}
              required
              className="p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
            />

            <input
              name="cognome"
              type="text"
              value={formData.cognome}
              placeholder="Cognome"
              onChange={handleChange}
              required
              className="p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <select
            name="patologia"
            value={formData.patologia}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>Alzheimer</option>
            <option>Demenza Vascolare</option>
            <option>MCI (Lieve)</option>
            <option>Altro</option>
          </select>

          <textarea
            name="descrizione"
            value={formData.descrizione}
            onChange={handleChange}
            rows="3"
            placeholder="Note cliniche..."
            className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          />
        </div>

        {/* COLONNA DESTRA - CREDENZIALI */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-green-800">
            Credenziali di Accesso
          </h2>

          <input
            name="emailAccesso"
            type="email"
            value={formData.emailAccesso}
            onChange={handleChange}
            placeholder="Email paziente"
            required
            className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="passwordAccesso"
            type="password"
            value={formData.passwordAccesso}
            onChange={handleChange}
            placeholder="Password (min 8 caratteri)"
            required
            minLength={8}
            className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-green-600"
          />

          {/* AZIONI */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/pazienti")}
              className="flex-1 p-3 text-slate-700 font-bold text-xs uppercase tracking-widest"
            >
              Annulla
            </button>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 p-3 bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-800 transition-all disabled:opacity-50"
            >
              {loading ? "Salvataggio..." : "Salva Paziente"}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
);
}
