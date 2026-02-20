"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignExerciseAction(pazienteId, esercizioId) {
  try {
    // Verifichiamo se è già assegnato e non ancora svolto
    const exists = db.prepare(`
      SELECT ID FROM Assegnazioni 
      WHERE Paziente_id = ? AND Esercizio_id = ? AND Stato = 'da_svolgere'
    `).get(pazienteId, esercizioId);

    if (exists) {
      return { error: "Questo esercizio è già stato assegnato al paziente." };
    }

    db.prepare(`
      INSERT INTO Assegnazioni (paziente_id, esercizio_id)
      VALUES (?, ?)
    `).run(pazienteId, esercizioId);

    revalidatePath(`/pazienti/${pazienteId}`);
    return { success: true };
  } catch (error) {
    console.error("Errore assegnazione:", error);
    return { error: "Impossibile assegnare l'esercizio." };
  }
}

export async function unassignExerciseAction(assignmentId, patientId) {
  try {
    // Eliminiamo il record specifico dell'assegnazione
    db.prepare("DELETE FROM Assegnazioni WHERE ID = ?").run(assignmentId);

    // Aggiorniamo la cache della pagina del paziente
    revalidatePath(`/pazienti/${patientId}`);
    return { success: true };
  } catch (error) {
    console.error("Errore durante la rimozione dell'assegnazione:", error);
    return { error: "Impossibile rimuovere l'esercizio assegnato." };
  }
}

/** * --- LATO PAZIENTE ---
 */

// Recupera gli esercizi assegnati a un paziente specifico
// Filtra per stato (es. 'da_svolgere') e controlla che l'esercizio sia ancora attivo
export async function getAssignedExercisesAction(pazienteId, stato = 'da_svolgere') {
  try {
    // Facciamo un JOIN con la tabella Esercizi per avere i dettagli (Titolo, Tipo, etc.)
    // Fondamentale il controllo e.is_active = 1
    const assignments = db.prepare(`
      SELECT 
        e.ID, 
        e.Titolo, 
        e.Tipo, 
        e.Contenuto_Json,
        a.Data_Assegnazione,
        a.Stato
      FROM Assegnazioni a
      JOIN Esercizi e ON a.Esercizio_id = e.ID
      WHERE a.Paziente_id = ? 
        AND a.Stato = ? 
      ORDER BY a.Data_Assegnazione DESC
    `).all(pazienteId, stato);

    return assignments;
  } catch (e) {
    console.error("Errore recupero assegnazioni:", e);
    return [];
  }
}

// Aggiorna lo stato di un'assegnazione (es. da 'da_svolgere' a 'completato')
// Nota: Questa viene chiamata solitamente dentro saveSvolgimentoAction
export async function updateAssignmentStatusAction(pazienteId, esercizioId, nuovoStato) {
  try {
    db.prepare(`
      UPDATE Assegnazioni 
      SET Stato = ? 
      WHERE Paziente_id = ? AND Esercizio_id = ?
    `).run(nuovoStato, pazienteId, esercizioId);

    revalidatePath('/myapp/esercizi');
    return { success: true };
  } catch (e) {
    return { error: "Errore aggiornamento stato." };
  }
}