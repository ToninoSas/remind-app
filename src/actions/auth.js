"use server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";

const SALT_ROUNDS = 10; // Livello di sicurezza standard

// REGISTRAZIONE con Hashing
export async function registerAction(formData) {
  const nome = formData.get("nome");
  const cognome = formData.get("cognome");
  const email = formData.get("email");
  const password = formData.get("password");
  const tipologia = formData.get("tipologia");

  const transaction = db.transaction(() => {
    // 1. Creazione Account Utente (Obbligatoria)
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const userRes = db
      .prepare(
        `
        INSERT INTO Utenti (Nome, Cognome, Email, Password_Hash, Ruolo)
        VALUES (?, ?, ?, ?, 'caregiver')
      `,
      )
      .run(nome, cognome, email, hashedPassword);

    const utenteId = userRes.lastInsertRowid;

    // 2. Creazione Profilo Caregivet
    const caregiverRes = db
      .prepare(
        `
        INSERT INTO Caregivers (Tipologia, Utente_id)
        VALUES (?, ?)
      `,
      )
      .run(tipologia, utenteId);

    return caregiverRes.lastInsertRowid;
  });

  // 2. Salviamo l'hash nel DB, mai la password in chiaro
  try {
    const resultId = transaction();

    return { success: true, userId: resultId };
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("UNIQUE constraint failed")) {
      return { error: "Questa email è già registrata." };
    }
    return { error: "Errore durante la registrazione." };
  }
}

// LOGIN con Comparazione Hash
export async function loginAction(email, password) {
  const user = db
    .prepare(`SELECT * FROM Utenti WHERE Email = ?`)
    .get(email);

  if (!user) {
    return { error: "Utente non trovato." };
  }

  // 2. Compariamo la password (occhio alla 'h' minuscola di Password_hash)
  const isMatch = await bcrypt.compare(password, user.Password_Hash);

  if (!isMatch) {
    return { error: "Credenziali non valide." };
  }

  let profileId = null;
  if (user.Ruolo === "caregiver") {
    const caregiver = db
      .prepare(`SELECT ID FROM Caregivers WHERE Utente_id = ?`)
      .get(user.ID);
    profileId = caregiver?.ID || null;
  } else if (user.Ruolo === "paziente") {
    const paziente = db
      .prepare(`SELECT ID FROM Pazienti WHERE Utente_id = ?`)
      .get(user.ID);
    profileId = paziente?.ID || null;
  }

  // 3. Prepariamo i Cookie
  const cookieStore = await cookies();
  const token = `session-${user.ID}-${Date.now()}`;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  cookieStore.set("auth-token", token, cookieOptions);

  // Usiamo il valore della colonna 'Ruolo' del tuo schema
  cookieStore.set("user-role", user.Ruolo, cookieOptions);
  // 3. Restituiamo l'utente senza la password_hash per sicurezza
  // const { password_hash, ...userSafe } = user;
  // restituisco i dati dell'utente insieme all'id del suo profilo specifico (caregiver o paziente)
  // return { ...userSafe, profileId };
  return {
    AuthID: user.ID,
    Nome: user.Nome,
    Cognome: user.Cognome,
    Email: user.Email,
    Ruolo: user.Ruolo,
    ProfileID: profileId,
    Data_Creazione: user.Data_Creazione,
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  // Rimuoviamo entrambi i cookie che abbiamo creato
  cookieStore.delete("auth-token");
  cookieStore.delete("user-role");

  // Reindirizziamo l'utente alla home o al login
  // redirect("/login");
}
