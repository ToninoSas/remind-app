"use server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // Livello di sicurezza standard

// REGISTRAZIONE con Hashing
export async function registerAction(formData) {
  const nome = formData.get("nome");
  const email = formData.get("email");
  const password = formData.get("password");
  const ruolo = "caregiver";

  try {
    // 1. Generiamo l'hash della password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 2. Salviamo l'hash nel DB, mai la password in chiaro
    const insert = db.prepare(`
      INSERT INTO Utenti (nome, email, password_hash, ruolo)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = insert.run(nome, email, hashedPassword, ruolo);
    
    return { success: true, userId: result.lastInsertRowid };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return { error: "Questa email è già registrata." };
    }
    return { error: "Errore durante la registrazione." };
  }
}

// LOGIN con Comparazione Hash
export async function loginAction(email, password) {
  // 1. Cerchiamo l'utente per email
  const user = db.prepare(`
    SELECT * FROM Utenti WHERE email = ?
  `).get(email);

  if (!user) {
    throw new Error("Credenziali non valide.");
  }

  // 2. Compariamo la password inserita con l'hash salvato
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Credenziali non valide.");
  }

  // 3. Restituiamo l'utente senza la password_hash per sicurezza
  const { password_hash, ...userSafe } = user;
  return userSafe;
}