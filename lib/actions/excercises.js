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
      INSERT INTO Exercise (Type, Title, Description, Difficulty_Level, Content_Json, Caregiver_Id)
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
      SELECT e.* FROM Exercise e
      JOIN Caregiver c ON e.Caregiver_Id = c.Id
      WHERE c.Id = ? AND e.Deleted_At IS NULL
      ORDER BY e.Created_At DESC
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
      UPDATE Exercise 
      SET Type = ?, Title = ?, Description = ?, Difficulty_Level = ?, Content_Json = ?
      WHERE Id = ?
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
    db.prepare(
      "UPDATE Exercise SET Deleted_At = CURRENT_TIMESTAMP WHERE ID = ?",
    ).run(id);

    revalidatePath("/esercizi");
    return { success: true };
  } catch (error) {
    return { error: "Errore durante l'eliminazione." };
  }
}

export async function getExerciseByIdAction(exerciseId) {
  try {
    // Cerchiamo l'esercizio assicurandoci che non sia stato eliminato logicamente
    const exercise = db
      .prepare(
        `
        Id, 
        Title, 
        Type, 
        Content_Json,
      FROM Exercise 
      WHERE Id = ? AND Deleted_At IS NULL
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
