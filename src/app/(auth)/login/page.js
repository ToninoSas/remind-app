"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await login(email, password);
    } catch (err) {
      console.log(err);
      setError("Email o password non corretti. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      {/* Card con bordo più marcato per separarsi dallo sfondo */}
      <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200">
        <h1 className="text-4xl font-black text-slate-950 mb-2 italic tracking-tight">
          Bentornato
        </h1>
        <p className="text-slate-800 mb-8 font-medium">
          Accedi per gestire i tuoi pazienti
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-2 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
              placeholder="tua@email.it"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-2 ml-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-bold border border-red-200 animate-in fade-in zoom-in">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 p-5 text-white font-black rounded-[2rem] text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? "STO ENTRANDO..." : "ENTRA NELL'APP"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-800 font-medium">
            Non hai ancora un account?
          </p>
          <Link
            href="/register"
            className="inline-block mt-2 text-blue-700 font-black text-lg hover:underline tracking-tight"
          >
            Registrati come Caregiver
          </Link>
        </div>
      </div>
    </div>
  );
}
