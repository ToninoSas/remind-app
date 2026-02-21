import { Suspense } from "react";
import RegisterForm from '@/app/ui/register-form';

export default function RegisterPage() {
 return(
  <Suspense fallback={<div>Caricamento...</div>}>
    <RegisterForm />
  </Suspense>
 )

}

