"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Crea un nuovo esercizio partendo dall'ID Utente del creatore
 */
export async function createExerciseAction(payload, utenteId) {
  const { titolo, tipo, descrizione, difficolta, contenuto } = payload;

  try {
    // 1. Dobbiamo trovare il Caregiver_id corrispondente all'utente loggato
    const caregiver = db.prepare("SELECT ID FROM Caregivers WHERE Utente_id = ?").get(utenteId);
    
    if (!caregiver) {
      return { error: "Profilo caregiver non trovato." };
    }

    // 2. Inserimento con nomi colonne corretti
    const res = db.prepare(`
      INSERT INTO Esercizi (Tipo, Titolo, Descrizione, Livello_Difficolta, Contenuto_Json, Caregiver_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      tipo, 
      titolo, 
      descrizione, 
      parseInt(difficolta), 
      JSON.stringify(contenuto), 
      caregiver.ID
    );

    revalidatePath("/caregiver/esercizi");
    return { success: true, id: res.lastInsertRowid };
  } catch (error) {
    console.error("ERRORE SQL (Creazione):", error.message);
    return { error: "Errore durante il salvataggio dell'esercizio." };
  }
}

/**
 * Recupera tutti gli esercizi di un determinato Caregiver (tramite Utente_id)
 */
export async function getExercisesAction(utenteId) {
  try {
    // Usiamo un JOIN per filtrare gli esercizi tramite l'Utente_id del caregiver
    return db.prepare(`
      SELECT e.* FROM Esercizi e
      JOIN Caregivers c ON e.Caregiver_id = c.ID
      WHERE c.Utente_id = ?
      ORDER BY e.Data_Creazione DESC
    `).all(utenteId);
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
    db.prepare(`
      UPDATE Esercizi 
      SET Tipo = ?, Titolo = ?, Descrizione = ?, Livello_Difficolta = ?, Contenuto_Json = ?
      WHERE ID = ?
    `).run(
      tipo, 
      titolo, 
      descrizione, 
      parseInt(difficolta), 
      JSON.stringify(contenuto), 
      id
    );

    revalidatePath("/caregiver/esercizi");
    return { success: true };
  } catch (error) {
    console.error("ERRORE SQL (Update):", error.message);
    return { error: "Impossibile aggiornare l'esercizio." };
  }
}

/**
 * Elimina un esercizio fisicamente dal database
 */
export async function deleteExerciseAction(id) {
  try {
    // Nota: l'eliminazione qui è fisica perché è un elemento della libreria, 
    // non un dato clinico del paziente.
    db.prepare("DELETE FROM Esercizi WHERE ID = ?").run(id);
    
    revalidatePath("/caregiver/esercizi");
    return { success: true };
  } catch (error) {
    console.error("ERRORE SQL (Delete):", error.message);
    return { error: "Errore durante l'eliminazione." };
  }
}