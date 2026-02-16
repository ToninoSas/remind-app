// src/app/paziente/dashboard/page.js
"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function PazienteDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <h1 className="text-5xl font-black text-blue-900 text-center">
        Ciao {user?.nome}, <br /> cosa vuoi fare?
      </h1>

      <div className="flex flex-col md:flex-col justify-center items-center gap-8 w-full max-w-2xl">

        <Link href="/myapp/esercizi">
          <button className="bg-orange-500 text-white p-12 rounded-3xl text-4xl font-bold shadow-xl active:scale-95 transition-all">
            🎮 Gioca ora
          </button>
        </Link>

        <Link href="/myapp/ricordi">
          <button className="bg-purple-500 text-white p-12 rounded-3xl text-4xl font-bold shadow-xl active:scale-95 transition-all">
            🖼️ I miei ricordi
          </button>
        </Link>
      </div>
    </div>
  );
}