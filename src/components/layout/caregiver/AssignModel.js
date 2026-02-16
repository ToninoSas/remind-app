"use client";
import { useState, useEffect } from "react";
import { getExercisesAction } from "@/actions/excercises";
import { useAuth } from "@/context/auth-context";

export default function AssignModal({ onAssign, onClose }) {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getExercisesAction(user.ProfileID);
      setExercises(data);
      setLoading(false);
    }
    load();
  }, [user.ProfileID]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-8 border-b flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800">Assegna Esercizio</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-600 text-xl">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <p className="text-center py-10">Caricamento libreria...</p>
          ) : exercises.length === 0 ? (
            <p className="text-center py-10 text-slate-600">Nessun esercizio disponibile</p>
          ) : (
            exercises.map(ex => (
              <div 
                key={ex.ID} 
                className="flex justify-between items-center p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-100 transition-colors cursor-pointer group"
                onClick={() => onAssign(ex.ID)}
              >
                <div>
                  <p className="font-bold text-slate-800">{ex.Titolo}</p>
                  <p className="text-xs text-slate-600 uppercase font-black">{ex.Tipo}</p>
                </div>
                <button className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-xl text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                  ASSEGNA +
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}