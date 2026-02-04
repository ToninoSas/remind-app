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
            setError("Email o password non corretti. Riprova.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Bentornato</h1>
                <p className="text-slate-500 mb-8">Accedi per gestire i tuoi pazienti</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input name="email" type="email" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all" placeholder="tua@email.it" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input name="password" type="password" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all" placeholder="••••••••" />
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 p-4 text-white font-bold rounded-xl"
                    >
                        {loading ? "Sto entrando..." : "Entra nell'app"}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600">
                        Non hai ancora un account?
                    </p>
                    <Link href="/register" className="inline-block mt-2 text-blue-600 font-bold text-lg hover:underline">
                        Registrati come Caregiver
                    </Link>
                </div>
            </div>
        </div>
    );
}