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
        INSERT INTO User (First_Name, Last_Name, Email, Password_Hash, Role)
        VALUES (?, ?, ?, ?, 'caregiver')
      `,
      )
      .run(nome, cognome, email, hashedPassword);

    const utenteId = userRes.lastInsertRowid;

    // 2. Creazione Profilo Caregivet
    const caregiverRes = db
      .prepare(
        `
        INSERT INTO Caregiver (Type, User_Id)
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
export async function loginAction(Email, password) {
  const user = db
    .prepare(`SELECT * FROM User WHERE Email = ?`)
    .get(Email);

  if (!user) {
    return { error: "Utente non trovato." };
  }

  // 2. Compariamo la password (occhio alla 'h' minuscola di Password_hash)
  const isMatch = await bcrypt.compare(password, user.Password_Hash);

  if (!isMatch) {
    return { error: "Credenziali non valide." };
  }

  let profileId = null;
  if (user.Role === "caregiver") {
    const caregiver = db
      .prepare(`SELECT Id FROM Caregiver WHERE User_Id = ?`)
      .get(user.Id);
    profileId = caregiver?.Id || null;
  } else if (user.Role === "paziente") {
    const paziente = db
      .prepare(`SELECT Id FROM Patient WHERE User_Id = ?`)
      .get(user.Id);
    profileId = paziente?.Id || null;
  }

  // 3. Prepariamo i Cookie
  const cookieStore = await cookies();
  const token = `session-${user.ID}-${Date.now()}`;
  const cookieOptions = {
    httpOnly: true, // Impedisce l'accesso ai cookie tramite JavaScript nel browser (Protezione XSS)
    secure: process.env.NODE_ENV === "production", // Il cookie viene inviato solo su connessioni HTTPS in produzione
    path: "/", // Il cookie è valido per tutte le pagine del sito
  };

  cookieStore.set("auth-token", token, cookieOptions);

  // Usiamo il valore della colonna 'Ruolo' del tuo schema
  cookieStore.set("user-role", user.Role, cookieOptions);

  // salvo il profileId per i server components:
  cookieStore.set("profile-id", profileId.toString(), cookieOptions);

  // 3. Restituiamo l'utente senza la password_hash per sicurezza
  // const { password_hash, ...userSafe } = user;
  // restituisco i dati dell'utente insieme all'id del suo profilo specifico (caregiver o paziente)
  // return { ...userSafe, profileId };
  return {
    AuthID: user.Id,
    Nome: user.First_Name,
    Cognome: user.Last_Name,
    Email: user.Email,
    Ruolo: user.Role,
    ProfileID: profileId,
    Data_Creazione: user.Created_At,
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  // Rimuoviamo entrambi i cookie che abbiamo creato
  cookieStore.delete("auth-token");
  cookieStore.delete("user-role");
  cookieStore.delete("profile-id");

  // Reindirizziamo l'utente alla home o al login
  // redirect("/login");
}
