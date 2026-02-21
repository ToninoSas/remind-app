"use server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// AZIONE PER GESTIRE L'UPLOAD DEI MEDIA (FOTO, VIDEO, AUDIO) ASSOCIATI AI RICORDI
// Riceve un FormData con il file, lo salva nella cartella pubblica e restituisce l'URL di accesso
export async function uploadMediaAction(formData) {
  const file = formData.get('file');
  if (!file) return { error: "Nessun file fornito" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Nome unico per evitare sovrascritture
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const path = join(process.cwd(), 'public/uploads', fileName);

  try {
    await mkdir(join(process.cwd(), 'public/uploads'), { recursive: true });
    await writeFile(path, buffer);
    return { success: true, url: `/uploads/${fileName}` };
  } catch (error) {
    console.error("Errore upload:", error);
    return { error: "Errore durante il salvataggio." };
  }
}