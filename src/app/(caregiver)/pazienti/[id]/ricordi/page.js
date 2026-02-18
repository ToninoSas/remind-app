import { getMemoryBoxesAction } from "@/actions/memory";
import { getDetailedPatientAction } from "@/actions/patients";
import { cookies } from "next/headers";
import MemoryManager from "@/components/caregiver/gestioneRicordi/MemoryManager";

export default async function RicordiPage({ params }) {
  // 1. Recupero parametri e ID caregiver dai cookie
  const { id: pazienteId } = await params;
  const cookieStore = await cookies();
  const caregiverId = cookieStore.get("profile-id")?.value;

  // 2. Caricamento parallelo dei dati sul server
  const [patientRes, boxesData] = await Promise.all([
    getDetailedPatientAction(pazienteId),
    getMemoryBoxesAction(pazienteId)
  ]);

  // 3. Passiamo i dati al "guscio" client per l'interazione
  return (
    <MemoryManager
      initialBoxes={boxesData}
      paziente={patientRes?.info}
      pazienteId={pazienteId}
      caregiverId={caregiverId}
    />
  );
}