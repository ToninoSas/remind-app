"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Crea un nuovo esercizio partendo dall'ID Utente del creatore
 */
export async function createExerciseAction(payload, caregiverId) {
  const { titolo, tipo, descrizione, difficolta, contenuto } = payload;

  try {
    // 2. Inserimento con nomi colonne corretti
    const res = db
      .prepare(
        `
      INSERT INTO Esercizi (Tipo, Titolo, Descrizione, Livello_Difficolta, Contenuto_Json, Caregiver_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        tipo,
        titolo,
        descrizione,
        parseInt(difficolta),
        JSON.stringify(contenuto),
        caregiverId,
      );

    revalidatePath("/esercizi");
    return { success: true, id: res.lastInsertRowid };
  } catch (error) {
    console.error("ERRORE SQL (Creazione):", error.message);
    return { error: "Errore durante il salvataggio dell'esercizio." };
  }
}

/**
 * Recupera tutti gli esercizi di un determinato Caregiver (tramite Utente_id)
 */
export async function getExercisesAction(caregiverId) {
  try {
    // Usiamo un JOIN per filtrare gli esercizi tramite l'Utente_id del caregiver
    return db
      .prepare(
        `
      SELECT e.* FROM Esercizi e
      JOIN Caregivers c ON e.Caregiver_id = c.ID
      WHERE c.ID = ? AND e.Data_Eliminazione IS NULL
      ORDER BY e.Data_Creazione DESC
    `,
      )
      .all(caregiverId);
  } catch (error) {
    console.error("ERRORE SQL (Recupero):", error.message);
    return [];
  }
}

/**
 * Aggiorna un esercizio esistente
 */
export async function updateExerciseAction(id, data) {
  const { titolo, tipo, descrizione, difficolta, contenuto } = data;

  try {
    db.prepare(
      `
      UPDATE Esercizi 
      SET Tipo = ?, Titolo = ?, Descrizione = ?, Livello_Difficolta = ?, Contenuto_Json = ?
      WHERE ID = ?
    `,
    ).run(
      tipo,
      titolo,
      descrizione,
      parseInt(difficolta),
      JSON.stringify(contenuto),
      id,
    );

    revalidatePath("/esercizi");
    return { success: true };
  } catch (error) {
    console.error("ERRORE SQL (Update):", error.message);
    return { error: "Impossibile aggiornare l'esercizio." };
  }
}

/**
 * Elimina un esercizio logicamente dal database
 */
export async function softDeleteExerciseAction(id) {
  try {
    db.prepare("UPDATE Esercizi SET Data_Eliminazione = CURRENT_TIMESTAMP WHERE ID = ?").run(id);

    revalidatePath("/esercizi");
    return { success: true };
  } catch (error) {
    console.error("ERRORE SQL (Delete):", error.message);
    return { error: "Errore durante l'eliminazione." };
  }
}

export async function getExerciseByIdAction(exerciseId) {
  try {
    // Cerchiamo l'esercizio assicurandoci che non sia stato eliminato logicamente
    const exercise = db
      .prepare(
        `
      SELECT 
        ID, 
        Titolo, 
        Tipo, 
        Contenuto_Json
      FROM Esercizi 
      WHERE ID = ? AND Data_Eliminazione IS NULL
    `,
      )
      .get(exerciseId);

    if (!exercise) {
      console.error(`Esercizio con ID ${exerciseId} non trovato o non attivo.`);
      return null;
    }

    // Restituiamo l'oggetto.
    // Nota: Il parsing di Contenuto_Json lo facciamo solitamente nel componente
    // per gestire meglio eventuali errori di formato, ma è bene sapere che è una stringa.
    return exercise;
  } catch (e) {
    console.error("Errore nel recupero dell'esercizio:", e);
    throw new Error("Impossibile caricare l'esercizio.");
  }
}