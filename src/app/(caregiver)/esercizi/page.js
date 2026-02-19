import { getExercisesAction } from "@/actions/excercises";
import LibreriaEsercizi from "@/components/caregiver/gestioneEsercizi/LibraryExercise";
import { cookies } from "next/headers";

export default async function EserciziPage({ searchParams }) {
  // 1. Recuperiamo l'ID e il filtro dai cookie/URL
  const cookieStore = await cookies();
  const profileId = cookieStore.get("profile-id")?.value;
  const { filter } = await searchParams;
  
  // 2. Recuperiamo gli esercizi dal server
  const esercizi = await getExercisesAction(profileId);

  console.log(esercizi);

  // 3. Passiamo tutto al componente Client
  return (
    <LibreriaEsercizi 
      initialEsercizi={esercizi} 
      activeFilter={filter || "tutti"} 
    />
  );
}