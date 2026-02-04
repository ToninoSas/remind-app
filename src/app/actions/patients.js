"use server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createPatientAction(data, caregiverId) {
  const { nome, cognome, patologia, descrizione, emailAccesso, passwordAccesso } = data;

  // Validazione rapida lato server
  if (!emailAccesso || !passwordAccesso) {
    return { error: "Le credenziali di accesso sono obbligatorie." };
  }

  const transaction = db.transaction(() => {
    // 1. Creazione Account Utente (Obbligatoria)
    const hashedPassword = bcrypt.hashSync(passwordAccesso, 10);
    const userRes = db.prepare(`
      INSERT INTO Utenti (nome, email, password_hash, ruolo)
      VALUES (?, ?, ?, 'paziente')
    `).run(`${nome} ${cognome}`, emailAccesso, hashedPassword);
    
    const utenteId = userRes.lastInsertRowid;

    // 2. Creazione Profilo Paziente collegato all'Utente
    const patientRes = db.prepare(`
      INSERT INTO Pazienti (patologia, descrizione, caregiver_id, utente_id)
      VALUES (?, ?, ?, ?)
    `).run(
      patologia || "Non specificata", 
      descrizione || "", 
      caregiverId, 
      utenteId
    );

    return patientRes.lastInsertRowid;
  });

  try {
    const resultId = transaction();
    revalidatePath("/caregiver/pazienti");
    return { success: true, id: resultId };
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return { error: "Questa email è già associata a un altro utente." };
    }
    return { error: "Errore durante il salvataggio: " + error.message };
  }
}

// src/app/actions/patients.js

export async function getPatientsAction(caregiverId) {
  // Recuperiamo i dati clinici e il nome dall'account (se esiste)
  // Usiamo COALESCE per gestire i casi in cui utente_id è NULL
  return db.prepare(`
    SELECT 
      p.id, 
      p.patologia, 
      p.descrizione, 
      u.nome as nome_completo,
      u.email as email_paziente
    FROM Pazienti p
    LEFT JOIN Utenti u ON p.utente_id = u.id
    WHERE p.caregiver_id = ?
    ORDER BY p.id DESC
  `).all(caregiverId);
}

export async function getDetailedPatientAction(patientId) {
  // 1. Dati Anagrafici e Account
  const info = db.prepare(`
    SELECT p.*, u.nome, u.email, u.data_creazione as data_iscr
    FROM Pazienti p
    LEFT JOIN Utenti u ON p.utente_id = u.id
    WHERE p.id = ?
  `).get(patientId);

  // 2. Esercizi Assegnati
  const esercizi = db.prepare(`
    SELECT e.titolo, e.tipo, a.stato, a.data_assegnazione
    FROM Assegnazioni a
    JOIN Esercizi e ON a.esercizio_id = e.id
    WHERE a.paziente_id = ?
  `).all(patientId);

  // 3. Statistiche (Svolgimenti)
  const stats = db.prepare(`
    SELECT s.*, e.tipo as categoria
    FROM Svolgimenti s
    JOIN Esercizi e ON s.esercizio_id = e.id
    WHERE s.paziente_id = ?
    ORDER BY s.data_esecuzione DESC
  `).all(patientId);

  return { info, esercizi, stats };
}

export async function updatePatientAction(patientId, utenteId, data) {
  const { nome, email, patologia, descrizione } = data;

  const transaction = db.transaction(() => {
    // 1. Aggiorna i dati anagrafici nella tabella Utenti
    db.prepare(`
      UPDATE Utenti 
      SET nome = ?, email = ? 
      WHERE id = ?
    `).run(nome, email, utenteId);

    // 2. Aggiorna i dati clinici nella tabella Pazienti
    db.prepare(`
      UPDATE Pazienti 
      SET patologia = ?, descrizione = ? 
      WHERE id = ?
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