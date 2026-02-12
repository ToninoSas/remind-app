"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignExerciseAction(pazienteId, esercizioId) {
  try {
    // Verifichiamo se è già assegnato e non ancora svolto
    const exists = db.prepare(`
      SELECT id FROM Assegnazioni 
      WHERE paziente_id = ? AND esercizio_id = ? AND stato = 'da_svolgere'
    `).get(pazienteId, esercizioId);

    if (exists) {
      return { error: "Questo esercizio è già stato assegnato al paziente." };
    }

    db.prepare(`
      INSERT INTO Assegnazioni (paziente_id, esercizio_id)
      VALUES (?, ?)
    `).run(pazienteId, esercizioId);

    revalidatePath(`/caregiver/pazienti/${pazienteId}`);
    return { success: true };
  } catch (error) {
    console.error("Errore assegnazione:", error);
    return { error: "Impossibile assegnare l'esercizio." };
  }
}

export async function unassignExerciseAction(assignmentId, patientId) {
  try {
    // Eliminiamo il record specifico dell'assegnazione
    db.prepare("DELETE FROM Assegnazioni WHERE id = ?").run(assignmentId);

    // Aggiorniamo la cache della pagina del paziente
    revalidatePath(`/caregiver/pazienti/${patientId}`);
    return { success: true };
  } catch (error) {
    console.error("Errore durante la rimozione dell'assegnazione:", error);
    return { error: "Impossibile rimuovere l'esercizio assegnato." };
  }
}