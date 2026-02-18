"use client";
import { useState, useEffect } from "react";

// Icone fisse: sono gli "stimoli" visivi per il paziente.
const ICONE = ["🍎", "🐶", "🚗", "⚽", "🏠", "🍕", "🚲", "☀️"];

export default function MemoryPlayer({ numeroCoppie, onComplete }) {
  // --- STATO DEL GIOCO ---
  const [cards, setCards] = useState([]);      // L'intero mazzo mescolato
  const [flipped, setFlipped] = useState([]);    // Indici delle carte girate (max 2)
  const [matched, setMatched] = useState([]);    // Chiavi delle carte già indovinate
  const [attempts, setAttempts] = useState(0);   // Contatore mosse totali
  const [errors, setErrors] = useState(0);     // Contatore errori (per il caregiver)

  // --- PREPARAZIONE DEL MAZZO (Inizializzazione) ---
  useEffect(() => {
    // 1. Prende solo le icone necessarie in base alla difficoltà scelta
    const icons = ICONE.slice(0, numeroCoppie);
    
    // 2. Crea le coppie: duplica le icone e assegna un ID (l'emoji) e una Key unica (posizione)
    const deck = [...icons, ...icons]
      .map((icon, i) => ({ id: icon, key: i }))
      // 3. Algoritmo di mescolamento (Shuffle)
      .sort(() => Math.random() - 0.5); 
    
    setCards(deck);
  }, [numeroCoppie]);

  // --- LOGICA DEL CLICK ---
  const handleFlip = (idx) => {
    // Clausole di protezione (Guard Clauses):
    // Non fare nulla se: ci sono già 2 carte girate, se clicco la stessa carta, o se è già indovinata.
    if (
      flipped.length === 2 ||
      flipped.includes(idx) ||
      matched.includes(cards[idx].key)
    )
      return;

    // Aggiunge l'indice della carta cliccata a quelle girate
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    // Se abbiamo girato due carte, controlliamo se sono uguali
    if (newFlipped.length === 2) {
      setAttempts((a) => a + 1);
      const [first, second] = newFlipped;

      // CONFRONTO
      if (cards[first].id === cards[second].id) {
        // MATCH: Le icone sono identiche
        setMatched((prev) => [...prev, cards[first].key, cards[second].key]);
        setFlipped([]); // Svuota subito le girate per permettere nuovi click

        // CONTROLLO VITTORIA
        if (matched.length + 2 === cards.length) {
          // Aspettiamo un secondo per far vedere l'ultima carta prima di chiudere
          setTimeout(() => onComplete(attempts + 1, errors), 1000);
        }
      } else {
        // ERRORE: Le icone sono diverse
        setErrors((e) => e + 1);
        // Lasciamo le carte visibili per 1.2 secondi per permettere al paziente di memorizzarle
        setTimeout(() => setFlipped([]), 1200);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {cards.map((card, i) => {
        // Una carta è "visibile" se è tra le girate attuali o se è già stata indovinata
        const isShown = flipped.includes(i) || matched.includes(card.key);
        
        return (
          <button
            key={i}
            onClick={() => handleFlip(i)}
            className={`aspect-square rounded-[3rem] text-7xl flex items-center justify-center transition-all duration-500 border-8 ${
              isShown
                ? "bg-white border-blue-200 rotate-y-180" // Stato: Girata (Bianca)
                : "bg-blue-700 border-white shadow-2xl"   // Stato: Coperta (Blu)
            }`}
          >
            {/* Se visibile mostra l'emoji, altrimenti il punto di domanda */}
            {isShown ? card.id : "❓"}
          </button>
        );
      })}
    </div>
  );
}