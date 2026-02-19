"use server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createPatientAction(data, caregiverId) {
  const { nome, cognome, patologia, descrizione, emailAccesso, passwordAccesso } = data;

  if (!emailAccesso || !passwordAccesso) {
    return { error: "Le credenziali di accesso sono obbligatorie." };
  }

  const transaction = db.transaction(() => {
    const hashedPassword = bcrypt.hashSync(passwordAccesso, 10);

    // 1. Inserimento Utente (Nota: Password_hash con 'h' minuscola come da schema)
    const userRes = db.prepare(`
      INSERT INTO Utenti (Nome, Cognome, Email, Password_hash, Ruolo)
      VALUES (?, ?, ?, ?, 'paziente')
    `).run(nome, cognome, emailAccesso, hashedPassword);

    const utenteId = userRes.lastInsertRowid;

    // 2. Inserimento Paziente
    const patientRes = db.prepare(`
      INSERT INTO Pazienti (Patologia, Descrizione, Caregiver_id, Utente_id)
      VALUES (?, ?, ?, ?)
    `).run(patologia || "Non specificata", descrizione || "", caregiverId, utenteId);

    return patientRes.lastInsertRowid;
  });

  try {
    const resultId = transaction();
    revalidatePath("/caregiver/pazienti");
    return { success: true, id: resultId };
  } catch (error) {
    console.error("Errore SQL:", error.message);
    if (error.message.includes("UNIQUE")) return { error: "Email già in uso." };
    return { error: "Errore durante il salvataggio." };
  }
}

export async function getPatientsAction(caregiverId) {
  // Cambiato != NULL con IS NULL per vedere solo i pazienti attivi
  return db.prepare(`
    SELECT 
      p.ID, 
      p.Patologia, 
      p.Descrizione, 
      u.Nome,
      u.Cognome,
      u.Email as email_paziente,
      u.Data_Creazione
    FROM Pazienti p
    LEFT JOIN Utenti u ON p.Utente_id = u.ID
    WHERE p.Caregiver_id = ? AND p.Data_Eliminazione IS NULL
    ORDER BY p.ID DESC
  `).all(caregiverId);
}

export async function updatePatientAction(patientId, utenteId, data) {

  const { nome, cognome, email, patologia, descrizione } = data;


  const transaction = db.transaction(() => {

    // 1. Aggiorna i dati anagrafici nella tabella Utenti

    db.prepare(`
UPDATE Utenti
SET Nome = ?, Cognome = ?, Email = ?
WHERE ID = ?
`).run(nome, cognome, email, utenteId);

    // 2. Aggiorna i dati clinici nella tabella Pazienti

    db.prepare(`
UPDATE Pazienti
SET Patologia = ?, Descrizione = ?
WHERE ID = ?

`).run(patologia, descrizione, patientId);

  });

  try {
    transaction();
    revalidatePath(`/caregiver/pazienti/${patientId}`);
    return { success: true };
  } catch (error) {

    console.error("Errore aggiornamento:", error);
    if (error.message.includes("UNIQUE")) return { error: "Email già in uso." };

    return { error: "Errore durante il salvataggio." };
  }
}

export async function getDetailedPatientAction(patientId) {
  // 1. Dati Anagrafici (Corretto IS NULL)
  const info = db.prepare(`
    SELECT p.*, u.Nome, u.Cognome, u.Email, u.Data_Creazione
    FROM Pazienti p
    LEFT JOIN Utenti u ON p.Utente_id = u.ID
    WHERE p.ID = ? AND p.Data_Eliminazione IS NULL
  `).get(patientId);

  // 2. Esercizi Assegnati (Schema: Esercizio_id, Paziente_id)
  const esercizi = db.prepare(`
    SELECT e.Titolo, e.Tipo, a.Stato, a.Data_Assegnazione, a.Esercizio_id, a.ID
    FROM Assegnazioni a
    JOIN Esercizi e ON a.Esercizio_id = e.ID
    WHERE a.Paziente_id = ?
  `).all(patientId);

  // 3. Statistiche (Svolgimenti)
  const stats = db.prepare(`
    SELECT s.*, e.Tipo as categoria, e.Titolo
    FROM Svolgimenti s
    JOIN Esercizi e ON s.Esercizio_id = e.ID
    WHERE s.Paziente_id = ?
    ORDER BY s.Data_Esecuzione DESC
  `).all(patientId);

  return { info, esercizi, stats };
}

export async function softDeletePatientAction(patientId) {
  try {
    // Il timestamp segna il momento della "morte logica" del record
    db.prepare(`
      UPDATE Pazienti 
      SET Data_Eliminazione = CURRENT_TIMESTAMP 
      WHERE ID = ?
    `).run(patientId);

    revalidatePath("/caregiver/pazienti");
    return { success: true };
  } catch (error) {
    return { error: "Errore durante la disattivazione." };
  }
}