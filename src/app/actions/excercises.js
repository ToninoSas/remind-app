// src/app/actions/exercises.js
"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createExerciseAction(formData, creatoreId) {
  const { titolo, tipo, descrizione, difficolta, contenuto } = formData;

  try {
    const res = db.prepare(`
      INSERT INTO Esercizi (tipo, titolo, descrizione, livello_difficolta, contenuto_json, data_creazione, creatore_id)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
    `).run(
      tipo, 
      titolo, 
      descrizione, 
      difficolta, 
      JSON.stringify(contenuto), // Trasformiamo l'oggetto in stringa per il DB
      creatoreId
    );

    revalidatePath("/caregiver/esercizi");
    return { success: true, id: res.lastInsertRowid };
  } catch (error) {
    console.error("Errore creazione esercizio:", error);
    return { error: "Impossibile salvare l'esercizio." };
  }
}

export async function getExercisesAction(creatoreId) {
  try {
    return db.prepare(`
      SELECT * FROM Esercizi 
      WHERE creatore_id = ? AND attivo = 1
      ORDER BY data_creazione DESC
    `).all(creatoreId);
  } catch (error) {
    console.error("Errore recupero esercizi:", error);
    return [];
  }
}

export async function updateExerciseAction(id, data) {
  try {
    db.prepare(`
      UPDATE Esercizi 
      SET tipo = ?, titolo = ?, descrizione = ?, livello_difficolta = ?, contenuto_json = ?
      WHERE id = ?
    `).run(
      data.tipo, 
      data.titolo, 
      data.descrizione, 
      data.difficolta, 
      JSON.stringify(data.contenuto), 
      id
    );

    revalidatePath("/caregiver/esercizi");
    return { success: true };
  } catch (error) {
    console.error("Errore aggiornamento esercizio:", error.message);
    return { error: error.message };
  }
}

export async function softDeleteExerciseAction(id) {
  try {
    db.prepare("UPDATE Esercizi SET attivo = 0 WHERE id = ?").run(id);
    revalidatePath("/caregiver/esercizi");
    return { success: true };
  } catch (error) {
    return { error: "Errore durante l'eliminazione dell'esercizio." };
  }
}