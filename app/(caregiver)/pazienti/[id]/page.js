import { getDetailedPatientAction } from "@/lib/actions/patients";
import PaginaPaziente from "@/components/caregiver/gestionePazienti/PatientPage";
import { notFound } from "next/navigation";

export default async function SchedaPazientePage({ params, searchParams }) {
  // In Next.js 15 params è una Promise
  const { id } = await params;
  const {tab} = await searchParams;
  
  // Recupero dati direttamente sul server
  const data = await getDetailedPatientAction(id);

  if (!data) {
    notFound(); // Mostra automaticamente la pagina 404
  }

  const activeTab = tab || "anagrafica";

  return <PaginaPaziente data={data} patientId={id} activeTab={activeTab}/>;

}