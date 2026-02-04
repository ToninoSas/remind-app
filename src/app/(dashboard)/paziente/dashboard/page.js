// src/app/paziente/dashboard/page.js
"use client";
import { useAuth } from "@/context/auth-context";

export default function PazienteDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <h1 className="text-5xl font-black text-blue-900 text-center">
        Ciao {user?.nome}, <br /> cosa vuoi fare?
      </h1>

      <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
        <button className="bg-orange-500 text-white p-12 rounded-3xl text-4xl font-bold shadow-xl active:scale-95 transition-all">
          🎮 Gioca ora
        </button>
        
        <button className="bg-green-500 text-white p-12 rounded-3xl text-4xl font-bold shadow-xl active:scale-95 transition-all">
          🖼️ I miei ricordi
        </button>
      </div>
    </div>
  );
}