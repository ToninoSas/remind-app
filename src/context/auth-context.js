"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "@/actions/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Al caricamento, controlla se c'è un utente salvato nel browser
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const userData = await loginAction(email, password);
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));

    if (userData.ruolo === "paziente") {
      router.push("/myapp/esercizi");
    } else {
      router.push("/pazienti");
    }
  };

  const handleLogout = async () => {
    // 1. Pulizia Client (la tua logica)
    setUser(null);
    sessionStorage.removeItem("user");
    localStorage.removeItem("user"); // Spesso si usa anche questo

    // 2. Pulizia Server (Fondamentale!)
    // Questa azione rimuove 'auth-token' e 'user-role' dai cookie
    await logoutAction();

    // 3. Reset totale e redirect
    // router.refresh() assicura che il server ricalcoli lo stato dell'utente
    router.refresh();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, handleLogout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);