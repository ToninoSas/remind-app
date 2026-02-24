"use client";

import { useState, useEffect } from "react";
import { registerAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    tipologia: "Familiare",
  });

  // ✅ Schema Zod
  const schema = z.object({
    nome: z.string().min(1, "Il nome è obbligatorio"),
    cognome: z.string().min(1, "Il cognome è obbligatorio"),
    email: z.string().email("Email non valida"),
    password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
    tipologia: z.enum(["Familiare", "Professionista"]),
  });

  // Aggiornamento form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Controllo validità in tempo reale
  useEffect(() => {
    const result = schema.safeParse(formData);
    setIsValid(result.success);
  }, [formData]);

  // Submit con validazione e conversione in FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = schema.safeParse(formData);
    if (!result.success) {
      const firstError = Object.values(result.error.formErrors.fieldErrors)[0][0];
      alert(firstError);
      return;
    }

    setLoading(true);
    try {
      // ✅ converti in FormData come nella versione pre-refactoring
      const fd = new FormData();
      for (const key in result.data) {
        fd.append(key, result.data[key]);
      }

      const res = await registerAction(fd); // ora registerAction funziona come prima
      if (res?.error) throw new Error(res.error);
      router.push("/login");
    } catch (err) {
      alert(err?.message || "Errore durante la registrazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6"
      >
        <h1 className="text-3xl font-black italic text-slate-950 text-center">
          Crea il tuo account
        </h1>
        <p className="text-slate-700 text-center mb-6 font-medium">
          Inserisci i tuoi dati per registrarti
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            name="cognome"
            placeholder="Cognome"
            value={formData.cognome}
            onChange={handleChange}
            className="p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 8 caratteri)"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
        />

        <select
          name="tipologia"
          value={formData.tipologia}
          onChange={handleChange}
          className="w-full p-4 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
        >
          <option value="Familiare">Familiare</option>
          <option value="Professionista">Professionista</option>
        </select>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full p-4 bg-blue-700 text-white rounded-2xl font-black hover:bg-blue-800 transition-all disabled:opacity-50"
        >
          {loading ? "Registrazione..." : "Crea account"}
        </button>

        <p className="text-center text-sm text-slate-700">
          Hai già un account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Accedi qui
          </Link>
        </p>
      </form>
    </div>
  );
}