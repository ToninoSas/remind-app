"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function LoginForm() {
  const { login } = useAuth(); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const email = formData.get("email")?.toString().trim();
      const password = formData.get("password")?.toString();

      // Validazione base
      if (!email || !password) {
        throw new Error("Compila tutti i campi.");
      }

      if (!isValidEmail(email)) {
        throw new Error("Inserisci un'email valida.");
      }

      if (password.length < 8) {
        throw new Error("La password deve contenere almeno 8 caratteri.");
      }

      await login(email, password);
    } catch (err) {
      setError(err?.message || "Email o password non corretti. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-slate-200">
        <h1 className="text-4xl font-black text-slate-950 italic tracking-tight">
          Bentornato
        </h1>
        <p className="text-slate-800 mt-2 mb-8 font-medium">
          Accedi per gestire i tuoi pazienti
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-2 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              disabled={loading}
              placeholder="tua@email.it"
              className="w-full p-4 bg-white border border-slate-300 rounded-2xl 
                         focus:ring-4 focus:ring-blue-100 outline-none 
                         text-slate-950 font-semibold 
                         disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-700 mb-2 ml-1">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                disabled={loading}
                placeholder="••••••••"
                className="w-full p-4 pr-16 bg-white border border-slate-300 rounded-2xl
                 focus:ring-4 focus:ring-blue-100 outline-none
                 text-slate-950 font-semibold
                 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute inset-y-0 right-0 flex items-center px-4
                 text-sm font-bold text-slate-600
                 hover:text-blue-700 transition-colors"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 p-5 text-white font-black rounded-2xl text-lg 
                       transition-all hover:bg-blue-700 active:scale-95 
                       disabled:opacity-50 disabled:cursor-not-allowed"
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
