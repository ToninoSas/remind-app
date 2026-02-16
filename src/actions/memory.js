"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- GESTIONE BOX ---

export async function getMemoryBoxesAction(pazienteId) {
  return db
    .prepare(
      `
    SELECT * FROM Memory_boxs 
    WHERE Paziente_id = ? AND Data_Eliminazione IS NULL
    ORDER BY Data_Creazione DESC
  `
    )
    .all(pazienteId);
}

export async function getMemoryBoxDetailAction(boxId) {
  try {
    const box = db.prepare("SELECT * FROM Memory_boxs WHERE ID = ? AND Data_Eliminazione IS NULL").get(boxId);
    const items = db
      .prepare("SELECT * FROM Memory_items WHERE Box_id = ? AND Data_Eliminazione IS NULL")
      .all(boxId);
    return { box, items };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createMemoryBoxAction(pazienteId, caregiverId, data) {
  const { titolo, descrizione, categoria } = data;
  try {
    const res = db
      .prepare(
        `
      INSERT INTO Memory_boxs (Titolo, Descrizione, Categoria, Paziente_id, Caregiver_id)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(titolo, descrizione, categoria, pazienteId, caregiverId);

    revalidatePath(`/caregiver/pazienti/${pazienteId}/ricordi`);
    return { success: true, id: res.lastInsertRowid };
  } catch (e) {
    return { error: "Errore nella creazione del box." };
  }
}

export async function updateMemoryBoxAction(boxId, data, pazienteId) {
  try {
    const { titolo, descrizione, categoria } = data;
    db.prepare(
      `
      UPDATE Memory_boxs 
      SET Titolo = ?, Descrizione = ?, Categoria = ? 
      WHERE ID = ?
    `,
    ).run(titolo, descrizione, categoria, boxId);

    revalidatePath(`/caregiver/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    return { error: "Errore nell'aggiornamento del box." };
  }
}

export async function deleteMemoryBoxAction(boxId, pazienteId) {
  try {
    // 1. Eliminiamo logicamente gli item associati al box
    db.prepare("UPDATE Memory_items SET Data_Eliminazione = CURRENT_TIMESTAMP WHERE Box_id = ?").run(boxId);
    // 2. Eliminiamo logicamente il box
    db.prepare("UPDATE Memory_boxs SET Data_Eliminazione = CURRENT_TIMESTAMP WHERE ID = ?").run(boxId);

    revalidatePath(`/caregiver/pazienti/${pazienteId}/ricordi`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Impossibile eliminare il box." };
  }
}

// --- GESTIONE ITEMS (RICORDI) ---

export async function getMemoryItemsAction(boxId) {
  return db.prepare(`SELECT * FROM Memory_items WHERE Box_id = ?`).all(boxId);
}

export async function addMemoryItemAction(boxId, itemData) {
  const { tipo, url, titolo, testo, luogo, datazione } = itemData;
  try {
    db.prepare(
      `
      INSERT INTO Memory_items (Tipo, Url, Titolo, Testo, Luogo, Datazione, Box_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(tipo, url, titolo, testo, luogo, datazione, boxId);

    return { success: true };
  } catch (e) {
    return { error: "Errore nel salvataggio del ricordo." };
  }
}

export async function updateMemoryItemAction(itemId, data, boxId, pazienteId) {
  try {
    const { titolo, testo, luogo, datazione, url, tipo } = data;
    db.prepare(
      `
      UPDATE Memory_items 
      SET Titolo = ?, Testo = ?, Luogo = ?, Datazione = ?, Url = ?, Tipo = ? 
      WHERE ID = ?
    `,
    ).run(titolo, testo, luogo, datazione, url, tipo, itemId);

    revalidatePath(`/caregiver/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    return { error: "Errore nell'aggiornamento del ricordo." };
  }
}

// --- ELIMINA UN SINGOLO RICORDO ---
export async function deleteMemoryItemAction(itemId, boxId, pazienteId) {
  try {
    db.prepare("UPDATE Memory_items SET Data_Eliminazione = CURRENT_TIMESTAMP WHERE ID = ?").run(itemId);
    
    // Ricarichiamo la pagina del box
    revalidatePath(`/caregiver/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Impossibile eliminare il ricordo." };
  }
}

