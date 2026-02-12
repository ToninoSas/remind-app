"use client";
import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Aggiunto per UX
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
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2 italic">Inizia ora</h1>
        <p className="text-slate-500 mb-8 font-medium">Crea il tuo profilo Caregiver</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Griglia per Nome e Cognome */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Nome</label>
              <input name="nome" type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300" placeholder="Mario" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Cognome</label>
              <input name="cognome" type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300" placeholder="Rossi" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Email</label>
            <input name="email" type="email" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="nome@email.it" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Password</label>
            <input name="password" type="password" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all" placeholder="••••••••" />
          </div>

          {/* --- NUOVO CAMPO DROPDOWN --- */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Tipologia Caregiver</label>
            <div className="relative">
              <select 
                name="tipologia" 
                defaultValue="Familiare"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700"
              >
                <option value="Familiare">👨‍👩‍👧‍👦 Familiare</option>
                <option value="Professionista">🩺 Professionista</option>
              </select>
              {/* Icona freccia personalizzata */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in zoom-in">
              ⚠️ {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black text-lg hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? "Creazione in corso..." : "Crea account"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-400 text-sm font-bold">
          Hai già un account? <Link href="/login" className="text-blue-600 hover:underline">Accedi qui</Link>
        </p>
      </div>
    </div>
  );
}