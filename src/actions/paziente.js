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
      INSERT INTO Svolgimenti (
        Paziente_id, 
        Esercizio_id, 
        Risposte_totali, 
        Risposte_corrette, 
        Risposte_sbagliate, 
        Completato, 
        Stato_Emotivo
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
      UPDATE Assegnazioni 
      SET Stato = 'completato' 
      WHERE Paziente_id = ? AND Esercizio_id = ?
    `,
    ).run(pazienteId, esercizioId);

    revalidatePath("/myapp/esercizi");
    return { success: true };
  } catch (e) {
    console.error("Errore salvataggio:", e);
    return { error: "Non sono riuscito a salvare i tuoi progressi." };
  }
}
