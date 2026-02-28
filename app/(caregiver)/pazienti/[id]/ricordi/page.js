import { getMemoryBoxesAction } from "@/lib/actions/memory";
import { getDetailedPatientAction } from "@/lib/actions/patients";
import { cookies } from "next/headers";
import MemoryManager from "@/components/caregiver/gestioneRicordi/MemoryManager";

export default async function RicordiPage({ params }) {
  // 1. Recupero parametri e ID caregiver dai cookie
  //params prende l'id del paziente dall'URL e aspetta fin quando non arrivano
  const { id: pazienteId } = await params;
  //cookies prende l'id del caregiver dall'header della richiesta del client
  const cookieStore = await cookies();
  const caregiverId = cookieStore.get("profile-id")?.value;

  //Mi prendo i dettagli sul paziente e le memory box assegnate al paziente
  //richiesta in parallelo dato che non sono dati che dipendono fra loro
  //infatti il filtro delle memory box assegnate avviene direttamente all'interno della query
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