"use server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

export async function createPatientAction(data, caregiverId) {
  const { nome, cognome, patologia, descrizione, emailAccesso, passwordAccesso } = data;

  if (!emailAccesso || !passwordAccesso) {
    return { error: "Le credenziali di accesso sono obbligatorie." };
  }

  const transaction = db.transaction(() => {
    const hashedPassword = bcrypt.hashSync(passwordAccesso, 10);

    // 1. Inserimento Utente (Nota: Password_hash con 'h' minuscola come da schema)
    const userRes = db.prepare(`
      INSERT INTO User (First_Name, Last_Name, Email, Password_hash, Role)
      VALUES (?, ?, ?, ?, 'paziente')
    `).run(nome, cognome, emailAccesso, hashedPassword);

    const utenteId = userRes.lastInsertRowid;

    // 2. Inserimento Paziente
    const patientRes = db.prepare(`
      INSERT INTO Patient (Condition, Description, Caregiver_Id, User_Id)
      VALUES (?, ?, ?, ?)
    `).run(patologia || "Non specificata", descrizione || "", caregiverId, utenteId);

    return patientRes.lastInsertRowid;
  });

  try {
    const resultId = transaction();
    revalidatePath("/pazienti");
    return { success: true, id: resultId };
  } catch (error) {
    console.error("Errore SQL:", error.message);
    if (error.message.includes("UNIQUE")) return { error: "Email già in uso." };
    return { error: "Errore durante il salvataggio." };
  }
}

export async function getPatientsAction(caregiverId) {
  // await new Promise(resolve => setTimeout(resolve, 4000)); // <-- ritardo reale
  // Cambiato != NULL con IS NULL per vedere solo i pazienti attivi
  return db.prepare(`
    SELECT 
      p.Id, 
      p.Condition, 
      p.Description, 
      u.First_Name,
      u.Last_Name,
      u.Email as email_paziente,
      u.Created_At
    FROM Patient p
    LEFT JOIN User u ON p.User_Id = u.Id
    WHERE p.Caregiver_Id = ? AND p.Deleted_At IS NULL
    ORDER BY p.Id DESC
  `).all(caregiverId);
}

export async function updatePatientAction(patientId, utenteId, data) {

  const { nome, cognome, email, patologia, descrizione } = data;


  const transaction = db.transaction(() => {

    // 1. Aggiorna i dati anagrafici nella tabella User

    db.prepare(`
UPDATE User
SET First_Name = ?, Last_Name = ?, Email = ?
WHERE Id = ?
`).run(nome, cognome, email, utenteId);

    // 2. Aggiorna i dati clinici nella tabella Pazienti

    db.prepare(`
UPDATE Patient
SET Condition = ?, Description = ?
WHERE Id = ?

`).run(patologia, descrizione, patientId);


  });

  try {
    transaction();
    revalidatePath(`/pazienti/${patientId}`);
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
    SELECT p.*, u.First_Name, u.Last_Name, u.Email, u.Created_At
    FROM Patient p
    LEFT JOIN User u ON p.User_Id = u.Id
    WHERE p.Id = ? AND p.Deleted_At IS NULL
  `).get(patientId);

  // 2. Esercizi Assegnati (Schema: Esercizio_id, Paziente_id)
  const esercizi = db.prepare(`
    SELECT e.Title, e.Type, a.Status, a.Assigned_At, a.Exercise_Id, a.Id
    FROM Assignment a
    JOIN Exercise e ON a.Exercise_Id = e.Id
    WHERE a.Patient_Id = ?
  `).all(patientId);

  // 3. Statistiche (Svolgimenti)
  const stats = db.prepare(`
    SELECT s.*, e.Type as categoria, e.Title
    FROM Attempt s
    JOIN Exercise e ON s.Exercise_Id = e.Id
    WHERE s.Patient_Id = ?
    ORDER BY s.Executed_At DESC
  `).all(patientId);

  return { info, esercizi, stats };
}

export async function softDeletePatientAction(patientId) {
  try {
    // Il timestamp segna il momento della "morte logica" del record
    db.prepare(`
      UPDATE Patient
      SET Deleted_At = CURRENT_TIMESTAMP
      WHERE Id = ?
    `).run(patientId);

    revalidatePath("/pazienti");
    return { success: true };
  } catch (error) {
    return { error: "Errore durante la disattivazione." };
  }
}