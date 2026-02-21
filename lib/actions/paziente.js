"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveSvolgimentoAction({
  pazienteId,
  esercizioId,
  totali,
  corrette,
  sbagliate,
  completato,
  statoEmotivo,
}) {
  try {
    db.prepare(
      `
      INSERT INTO Attempt (
        Patient_Id, 
        Exercise_Id, 
        Total_Answers, 
        Correct_Answers, 
        Wrong_Answers, 
        Completed, 
        Emotional_State
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      pazienteId,
      esercizioId,
      totali,
      corrette,
      sbagliate,
      completato ? 1 : 0,
      statoEmotivo,
    );

    // Aggiorniamo lo stato dell'assegnazione per non mostrarlo più tra i "nuovi"
    db.prepare(
      `
      UPDATE Assignment
      SET Status = 'completato'
      WHERE Patient_Id = ? AND Exercise_Id = ?
    `,
    ).run(pazienteId, esercizioId);

    revalidatePath("/myapp/esercizi");
    return { success: true };
  } catch (e) {
    console.error("Errore salvataggio:", e);
    return { error: "Non sono riuscito a salvare i tuoi progressi." };
  }
}
