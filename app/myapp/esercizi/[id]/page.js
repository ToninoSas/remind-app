"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getExerciseByIdAction } from "@/lib/actions/excercises";
import { saveSvolgimentoAction } from "@/lib/actions/paziente";

// Importiamo i player specifici che abbiamo creato
import QuizPlayer from "@/components/paziente/QuizPlayer";
import CalcoloPlayer from "@/components/paziente/CalcoloPlayer";
import MemoryPlayer from "@/components/paziente/MemoryPlayer";
import EmotionalFeedback from "@/components/paziente/EmotionalFeedback";

export default function EsecuzioneEsercizio({ params }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const exerciseId = resolvedParams.id;

  const [esercizio, setEsercizio] = useState(null);
  const [step, setStep] = useState("caricamento"); // caricamento, gioco, emozione, fine
  const [stats, setStats] = useState({ totali: 0, corrette: 0, sbagliate: 0 });

  useEffect(() => {
    async function load() {
      const data = await getExerciseByIdAction(exerciseId);
      if (data) {
        setEsercizio(data);
        setStep("gioco");
      }
    }
    load();
  }, [exerciseId]);

  // Funzione chiamata ad ogni risposta data nel Quiz o Calcolo
  const handleStepComplete = (isCorretta) => {
    setStats((prev) => ({
      totali: prev.totali + 1,
      corrette: isCorretta ? prev.corrette + 1 : prev.corrette,
      sbagliate: isCorretta ? prev.sbagliate : prev.sbagliate + 1,
    }));
  };

  // Funzione chiamata alla fine dell'esercizio (dopo il feedback emotivo)
  const handleFinalSave = async (statoEmotivo) => {
    setStep("caricamento");
    await saveSvolgimentoAction({
      pazienteId: user.ProfileID,
      esercizioId: exerciseId,
      totali: stats.totali,
      corrette: stats.corrette,
      sbagliate: stats.sbagliate,
      completato: true,
      statoEmotivo: statoEmotivo,
    });
    setStep("fine");
  };

  if (step === "caricamento")
    return (
      <div className="min-h-screen flex items-center justify-center text-4xl font-black animate-pulse">
        Attendi...
      </div>
    );

  if (step === "fine")
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center space-y-10">
        <span className="text-9xl animate-bounce">🎊</span>
        <h1 className="text-6xl font-black text-slate-950">Bravissimo!</h1>
        <p className="text-3xl font-bold text-slate-600">
          Hai finito l'attività di oggi.
        </p>
        <Link
          href="/myapp/esercizi"
          className="px-20 py-8 bg-blue-700 text-white rounded-[3rem] text-3xl font-black uppercase shadow-2xl active:scale-95 transition-all"
        >
          Torna alla lista
        </Link>
      </div>
    );

  if (step === "emozione")
    return <EmotionalFeedback onSelect={handleFinalSave} />;

  // Parsing del contenuto JSON per Quiz e Calcolo
  const contenuto = esercizio?.Contenuto_Json
    ? JSON.parse(esercizio.Contenuto_Json)
    : null;

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <button
          onClick={() => history.back()}
          className="text-xl font-black text-slate-400"
        >
          CHIUDI X
        </button>
        <h2 className="text-2xl font-black text-slate-950 uppercase tracking-widest">
          {esercizio?.Titolo}
        </h2>
        <div className="w-20"></div>
      </header>

      <main className="max-w-5xl mx-auto">
        {esercizio?.Tipo === "quiz" && (
          <QuizPlayer
            items={contenuto.items}
            onStepComplete={(isCorr) => {
              handleStepComplete(isCorr);
              // Se è l'ultima domanda, passa a emozione
              if (stats.totali + 1 === contenuto.items.length)
                setStep("emozione");
            }}
          />
        )}

        {esercizio?.Tipo === "calcolo" && (
          <CalcoloPlayer
            items={contenuto.items}
            onStepComplete={(isCorr) => {
              handleStepComplete(isCorr);
              // Se è l'ultima domanda, passa a emozione
              if (stats.totali + 1 === contenuto.items.length)
                setStep("emozione");
            }}
          />
        )}

        {esercizio?.Tipo === "memoria" && (
          <MemoryPlayer
            numeroCoppie={contenuto.numeroCoppie}
            onComplete={(totali, sbagliate) => {
              setStats({ totali, corrette: contenuto.numeroCoppie, sbagliate });
              setStep("emozione");
            }}
          />
        )}
      </main>
    </div>
  );
}
