"use server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// AZIONE PER GESTIRE L'UPLOAD DEI MEDIA (FOTO, VIDEO, AUDIO) ASSOCIATI AI RICORDI
// Riceve un FormData con il file, lo salva nella cartella pubblica e restituisce l'URL di accesso
export async function uploadMediaAction(formData) {
  //cerca dentro l'oggetto e prende il file
  const file = formData.get('file');
  if (!file) return { error: "Nessun file fornito" };
  //mi prendo i byte
  const bytes = await file.arrayBuffer();
  //trasformo i dati in un formato che node può scrivere sul disco
  const buffer = Buffer.from(bytes);

  // Nome unico per evitare sovrascritture
  //il nome del file è settato sulla basse della data di upload e del nome del file rimpiazzando gli spazi in _
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  //process.cwd() individua la cartella principale e salva il file
  const path = join(process.cwd(), 'public/uploads', fileName);

  try {
    //se non esiste la cartella la crea
    await mkdir(join(process.cwd(), 'public/uploads'), { recursive: true });
    //scrive i dati nella cartella
    await writeFile(path, buffer);
    //restituisce url
    return { success: true, url: `/uploads/${fileName}` };
  } catch (error) {
    console.error("Errore upload:", error);
    return { error: "Errore durante il salvataggio." };
  }
}