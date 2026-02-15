"use server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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