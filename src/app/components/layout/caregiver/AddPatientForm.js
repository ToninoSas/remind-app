"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createPatientAction } from "@/app/actions/patients";

export default function AddPatientForm({ onCancel }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "", cognome: "", patologia: "Alzheimer", 
    descrizione: "", emailAccesso: "", passwordAccesso: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailAccesso || !formData.passwordAccesso) {
      alert("Inserisci email e password per il paziente.");
      return;
    }
    setLoading(true);
    const result = await createPatientAction(formData, user.id);
    
    if (result.success) {
      onCancel(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border border-slate-100">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-10 px-10">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>1</div>
          <span className="text-[10px] mt-2 font-black uppercase">Dati Clinici</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-slate-100 mb-4">
          <div className={`h-full bg-blue-600 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${step === 2 ? 'text-blue-600' : 'text-slate-300'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step === 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>2</div>
          <span className="text-[10px] mt-2 font-black uppercase">Credenziali</span>
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: ANAGRAFICA */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <input name="nome" placeholder="Nome" onChange={handleChange} className="p-4 bg-slate-50 border rounded-xl" />
            <input name="cognome" placeholder="Cognome" onChange={handleChange} className="p-4 bg-slate-50 border rounded-xl" />
          </div>
          <select name="patologia" onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-xl">
            <option>Alzheimer</option>
            <option>Demenza Vascolare</option>
            <option>MCI (Lieve)</option>
            <option>Altro</option>
          </select>
          <textarea name="descrizione" placeholder="Note cliniche..." rows="4" onChange={handleChange} className="w-full p-4 bg-slate-50 border rounded-xl resize-none" />
          
          <div className="flex gap-4 pt-4">
            <button onClick={onCancel} className="flex-1 p-4 text-slate-400 font-bold">Annulla</button>
            <button 
              disabled={!formData.nome || !formData.cognome}
              onClick={() => setStep(2)} 
              className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
            >
              Continua
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: ACCOUNT (ORA OBBLIGATORIO) */
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
          <div className="bg-blue-50 p-6 rounded-2xl mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-1">Accesso Paziente</h2>
            <p className="text-sm text-blue-600">Crea le credenziali che il paziente userà per entrare nell'app.</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-2">Email / Username</label>
              <input name="emailAccesso" type="email" required onChange={handleChange} placeholder="paziente@mail.it" className="w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-2">Password di accesso</label>
              <input name="passwordAccesso" type="password" required minLength={6} onChange={handleChange} placeholder="******" className="w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button type="submit" disabled={loading} className="w-full p-5 bg-green-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-green-700 transition-all">
              {loading ? "Salvataggio..." : "Salva Paziente e Account"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-slate-400 font-bold">Indietro</button>
          </div>
        </form>
      )}
    </div>
  );
}