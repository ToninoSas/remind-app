"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createPatientAction } from "@/lib/actions/patients";
import { useRouter } from "next/navigation";

export default function AddPatientForm() {

  const router = useRouter();
  const onCancel = () => router.push("/pazienti");

  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    patologia: "Alzheimer",
    descrizione: "",
    emailAccesso: "",
    passwordAccesso: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailAccesso || !formData.passwordAccesso) {
      alert("Inserisci email e password per il paziente.");
      return;
    }
    setLoading(true);
    const result = await createPatientAction(formData, user.ProfileID);

    if (result.success) {
      onCancel();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-2xl mx-auto border border-slate-200">
      {/* Stepper Header: Colori rinforzati per visibilità */}
      <div className="flex items-center justify-between mb-10 px-6">
        <div
          className={`flex flex-col items-center ${
            step >= 1 ? "text-blue-700" : "text-slate-600"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
              step >= 1
                ? "border-blue-700 bg-blue-50"
                : "border-slate-300 bg-white"
            }`}
          >
            1
          </div>
          <span className="text-[10px] mt-2 font-black uppercase tracking-widest">
            Dati Clinici
          </span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-slate-200 mb-4 rounded-full overflow-hidden">
          <div
            className={`h-full bg-blue-700 transition-all duration-500 ${
              step === 2 ? "w-full" : "w-0"
            }`}
          ></div>
        </div>
        <div
          className={`flex flex-col items-center ${
            step === 2 ? "text-blue-700" : "text-slate-600"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${
              step === 2
                ? "border-blue-700 bg-blue-50"
                : "border-slate-300 bg-white"
            }`}
          >
            2
          </div>
          <span className="text-[10px] mt-2 font-black uppercase tracking-widest">
            Credenziali
          </span>
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: ANAGRAFICA */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="nome"
              placeholder="Nome"
              onChange={handleChange}
              className="p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-500"
            />
            <input
              name="cognome"
              placeholder="Cognome"
              onChange={handleChange}
              className="p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-500"
            />
          </div>
          <select
            name="patologia"
            onChange={handleChange}
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-black outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>Alzheimer</option>
            <option>Demenza Vascolare</option>
            <option>MCI (Lieve)</option>
            <option>Altro</option>
          </select>
          <textarea
            name="descrizione"
            placeholder="Note cliniche..."
            rows="4"
            onChange={handleChange}
            className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-medium italic outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder:text-slate-500"
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 p-4 text-slate-800 font-black uppercase text-xs tracking-widest"
            >
              Annulla
            </button>
            <button
              disabled={!formData.nome || !formData.cognome}
              onClick={() => setStep(2)}
              className="flex-1 p-4 bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50"
            >
              Continua
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: ACCOUNT */
        <form
          onSubmit={handleFinalSubmit}
          className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center"
        >
          <div className="bg-blue-100 p-6 rounded-[2rem] mb-6 border border-blue-200">
            <h2 className="text-xl font-black text-blue-900 mb-1">
              Accesso Paziente
            </h2>
            <p className="text-sm text-blue-800 font-medium">
              Crea le credenziali che il paziente userà per entrare nell'app.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 ml-2 mb-1 block">
                Email / Username
              </label>
              <input
                name="emailAccesso"
                type="email"
                required
                onChange={handleChange}
                placeholder="paziente@mail.it"
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-800 ml-2 mb-1 block">
                Password di accesso
              </label>
              <input
                name="passwordAccesso"
                type="password"
                required
                minLength={6}
                onChange={handleChange}
                placeholder="******"
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-950 font-bold outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full p-5 bg-green-700 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-green-100 hover:bg-green-800 transition-all uppercase tracking-tighter"
            >
              {loading ? "SALVATAGGIO..." : "SALVA PAZIENTE E ACCOUNT"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-800 font-black uppercase text-xs tracking-widest py-2"
            >
              Indietro
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
