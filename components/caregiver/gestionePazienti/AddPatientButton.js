import Link from "next/link";

export default function AddPatientButton() {
  return (
    <Link
      href="/pazienti/nuovo"
      className="inline-block bg-slate-950 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
    >
      + Aggiungi Paziente
    </Link>
  );
}















/* "use client";
import { useRouter } from "next/navigation";

export default function AddPatientButton() {
  const router = useRouter();
  return (
  <button onClick={() => router.push("/pazienti/nuovo")}
  className="bg-slate-950 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95" > 
  + Aggiungi Paziente
  </button>
  );
  }
  */
