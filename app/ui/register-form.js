"use client";

import { useState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const result = await registerAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-[90vh] py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-200">
        <h1 className="text-3xl font-black text-slate-950 mb-2 italic">
          Inizia ora
        </h1>
        <p className="text-slate-800 mb-8 font-medium">
          Crea il tuo profilo Caregiver
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-700 mb-2 ml-1">
                Nome
              </label>
              <input
                name="nome"
                type="text"
                required
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder:text-slate-500"
                placeholder="Mario"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-700 mb-2 ml-1">
                Cognome
              </label>
              <input
                name="cognome"
                type="text"
                required
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder:text-slate-500"
                placeholder="Rossi"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder:text-slate-500"
              placeholder="nome@email.it"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2 ml-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 mb-2 ml-1">
              Tipologia Caregiver
            </label>
            <div className="relative">
              <select
                name="tipologia"
                defaultValue="Familiare"
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-950"
              >
                <option value="Familiare">👨‍👩‍👧‍👦 Familiare</option>
                <option value="Professionista">🩺 Professionista</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-950">
                ▼
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200 animate-in fade-in zoom-in">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white p-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Creazione in corso..." : "Crea account"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-800 text-sm font-bold">
          Hai già un account?{" "}
          <Link href="/login" className="text-blue-700 hover:underline">
            Accedi qui
          </Link>
        </p>
      </div>
    </div>
  );
}
