"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- GESTIONE BOX ---

export async function getMemoryBoxesAction(pazienteId) {
  return db
    .prepare(
      `
    SELECT * FROM Memory_Box 
    WHERE Patient_Id = ? AND Deleted_At IS NULL
    ORDER BY Created_At DESC
  `
    )
    .all(pazienteId);
}

export async function getMemoryBoxDetailAction(boxId) {
  try {
    const box = db.prepare("SELECT * FROM Memory_Box WHERE Id = ? AND Deleted_At IS NULL").get(boxId);
    const items = db
      .prepare("SELECT * FROM Memory_Item WHERE Box_Id = ? AND Deleted_At IS NULL")
      .all(boxId);
    return { box, items };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function createMemoryBoxAction(pazienteId, caregiverId, data) {
  const { titolo, descrizione, categoria } = data;
  console.log("Dati ricevuti per nuovo box: ", data);
  console.log("Paziente ID:", pazienteId, "Caregiver ID:", caregiverId);
  try {
    const res = db
      .prepare(
        `
      INSERT INTO Memory_Box (Title, Description, Category, Patient_Id, Caregiver_Id)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(titolo, descrizione, categoria, pazienteId, caregiverId);

    revalidatePath(`/pazienti/${pazienteId}/ricordi`);
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
      UPDATE Memory_Box 
      SET Title = ?, Description = ?, Category = ? 
      WHERE Id = ?
    `,
    ).run(titolo, descrizione, categoria, boxId);

    revalidatePath(`/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    return { error: "Errore nell'aggiornamento del box." };
  }
}

export async function deleteMemoryBoxAction(boxId, pazienteId) {
  try {
    // 1. Eliminiamo logicamente gli item associati al box
    db.prepare("UPDATE Memory_Item SET Deleted_At = CURRENT_TIMESTAMP WHERE Box_Id = ?").run(boxId);
    // 2. Eliminiamo logicamente il box
    db.prepare("UPDATE Memory_Box SET Deleted_At = CURRENT_TIMESTAMP WHERE Id = ?").run(boxId);

    revalidatePath(`/pazienti/${pazienteId}/ricordi`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Impossibile eliminare il box." };
  }
}

// --- GESTIONE ITEMS (RICORDI) ---

export async function getMemoryItemsAction(boxId) {
  return db.prepare(`SELECT * FROM Memory_Item WHERE Box_Id = ?`).all(boxId);
}

export async function addMemoryItemAction(boxId, itemData) {
  const { tipo, url, titolo, testo, luogo, datazione } = itemData;
  console.log("Dati ricevuti per nuovo ricordo: ", itemData, "Box ID:", boxId);
  try {
    db.prepare(
      `
      INSERT INTO Memory_Item (Type, Url, Title, Text, Location, Date, Box_Id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(tipo, url, titolo, testo, luogo, datazione, boxId);

    return { success: true };
  } catch (e) {
    console.log(e)
    return { error: "Errore nel salvataggio del ricordo." };
  }
}

export async function updateMemoryItemAction(itemId, data, boxId, pazienteId) {
  try {
    const { titolo, testo, luogo, datazione, url, tipo } = data;
    db.prepare(
      `
      UPDATE Memory_Item 
      SET Title = ?, Text = ?, Location = ?, Date = ?, Url = ?, Type = ? 
      WHERE Id = ?
    `,
    ).run(titolo, testo, luogo, datazione, url, tipo, itemId);

    revalidatePath(`/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    return { error: "Errore nell'aggiornamento del ricordo." };
  }
}

// --- ELIMINA UN SINGOLO RICORDO ---
export async function deleteMemoryItemAction(itemId, boxId, pazienteId) {
  try {
    db.prepare("UPDATE Memory_Item SET Deleted_At = CURRENT_TIMESTAMP WHERE Id = ?").run(itemId);

    // Ricarichiamo la pagina del box
    revalidatePath(`/pazienti/${pazienteId}/ricordi/${boxId}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Impossibile eliminare il ricordo." };
  }
}

