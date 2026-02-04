// Navigazione centralizzata per facilitare modifiche future
export const getNavigation = (ruolo) => {
  const common = [
    { name: 'Box dei ricordi', href: '/box-dei-ricordi', icon: '📦' },
  ];

  if (ruolo === 'caregiver') {
    return [
      { name: 'Pazienti', href: '/caregiver/pazienti', icon: '👥' },
      { name: 'Esercizi', href: '/caregiver/esercizi', icon: '🎮' },
      ...common,
    ];
  }

  return [
    { name: 'I Miei Esercizi', href: '/esercizi', icon: '🎮' },
    ...common,
  ];
};