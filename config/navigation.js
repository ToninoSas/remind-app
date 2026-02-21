// Navigazione centralizzata per facilitare modifiche future
export const getNavigation = (ruolo) => {

  const caregiverNav = [
    { name: "Pazienti", href: "/pazienti", icon: "👥" },
    { name: "Esercizi", href: "/esercizi", icon: "🎮" },,
  ];

  const pazienteNav = [
    { name: "I Miei Esercizi", href: "/myapp/esercizi", icon: "🎮" },
    { name: "I Miei Ricordi", href: "/myapp/ricordi", icon: "📸" },
  ];

  if (ruolo === 'caregiver') {
    return caregiverNav
  }

  return pazienteNav
};