import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Minimal */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
            R
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">Remind</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          {/* Badge Decorativo */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Supporto Cognitivo Digitale
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Accompagniamo la mente, <br />
            <span className="text-blue-600 italic">giorno dopo giorno.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            La piattaforma dedicata a caregiver e pazienti per la riabilitazione cognitiva personalizzata. Esercizi mirati, monitoraggio dei progressi e semplicità d'uso.
          </p>

          {/* Pulsanti di Azione */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/login"
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all active:scale-95"
            >
              Accedi al Portale
            </Link>
            
            <Link 
              href="/register"
              className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
            >
              Crea un Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="p-8 text-center text-slate-400 text-sm font-medium">
        © 2026 Remind — Tecnologia al servizio dell'assistenza.
      </footer>

      {/* Decorazione di sfondo (opzionale) */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200/50 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}