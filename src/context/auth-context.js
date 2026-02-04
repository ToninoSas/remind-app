// src/context/auth-context.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

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
      router.push("/paziente/dashboard");
    } else {
      router.push("/caregiver/pazienti");
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);