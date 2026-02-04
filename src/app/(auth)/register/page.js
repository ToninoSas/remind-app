"use client";
import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.target);
    const result = await registerAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Inizia ora</h1>
        <p className="text-slate-500 mb-8">Crea il tuo profilo Caregiver</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome Completo</label>
            <input name="nome" type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all" placeholder="Esempio: Mario Rossi" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input name="email" type="email" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all" placeholder="nome@email.it" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input name="password" type="password" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all" placeholder="Minimo 8 caratteri" />
          </div>
          
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
          
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
            Crea account
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-600">
          Hai già un account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Accedi</Link>
        </p>
      </div>
    </div>
  );
}