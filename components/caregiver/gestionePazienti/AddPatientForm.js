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
    passwordAccesso: z.string().min(6, "Password minima 8 caratteri"),
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
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 max-w-4xl mx-auto border border-slate-200 space-y-10"
    >
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Nuovo Paziente
        </h1>
        <p className="text-slate-600 mt-2 text-sm md:text-base">
          Inserisci i dati clinici e crea le credenziali di accesso.
        </p>
      </div>

      {/* DATI CLINICI */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-blue-800">
          Dati Clinici
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nome"
            type="text"
            value={formData.nome}
            placeholder="Nome"
            onChange={handleChange}
            required
            className="p-4 border border-slate-300 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            name="cognome"
            type="text"
            value={formData.cognome}
            placeholder="Cognome"
            onChange={handleChange}
            required
            className="p-4 border border-slate-300 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <select
          name="patologia"
          value={formData.patologia}
          onChange={handleChange}
          className="w-full p-4 border border-slate-300 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-600"
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
          rows="4"
          placeholder="Note cliniche..."
          className="w-full p-4 border border-slate-300 rounded-2xl font-medium italic outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        />
      </div>

      {/* CREDENZIALI */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-green-800">
          Credenziali di Accesso (la password deve essere di almeno 8 caratteri)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="emailAccesso"
            type="email"
            value={formData.emailAccesso}
            onChange={handleChange}
            placeholder="Email paziente"
            required
            className="p-4 border border-slate-300 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-600"
          />
          {/* <label className="text-[10px] font-black uppercase text-slate-800 ml-2 mb-1 block">
            Password di accesso (minimo 8 caratteri)
          </label> */}
          <input
            name="passwordAccesso"
            type="password"
            value={formData.passwordAccesso}
            onChange={handleChange}
            placeholder="Password di accesso"
            required
            minLength={8}
            className="p-4 border border-slate-300 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* AZIONI */}
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.push("/pazienti")}
          className="flex-1 p-4 text-slate-800 font-black uppercase text-xs tracking-widest"
        >
          Annulla
        </button>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="flex-1 p-5 bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-800 transition-all disabled:opacity-50"
        >
          {loading ? "Salvataggio..." : "Salva Paziente"}
        </button>
      </div>
    </form>
  );
}
