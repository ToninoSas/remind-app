import { getDetailedPatientAction } from "@/actions/patients";
import { getMemoryBoxDetailAction } from "@/actions/memory";
import DettaglioBox from "@/components/caregiver/gestioneRicordi/PaginaRicordi";
import { notFound } from "next/navigation";

export default async function DettaglioBoxPage({ params }) {
  // In Next.js 15, params è una Promise
  const { id, boxId } = await params;

  // Caricamento parallelo sul server
  const [patientRes, boxData] = await Promise.all([
    getDetailedPatientAction(id),
    getMemoryBoxDetailAction(boxId)
  ]);

  if (!boxData) notFound();

  return (
    <DettaglioBox 
      paziente={patientRes?.info} 
      initialBoxInfo={boxData.box}
      initialItems={boxData.items}
      pazienteId={id}
      boxId={boxId}
    />
  );
}