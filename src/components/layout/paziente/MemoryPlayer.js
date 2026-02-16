"use client";
import { useState, useEffect } from "react";

const ICONE = ["🍎", "🐶", "🚗", "⚽", "🏠", "🍕", "🚲", "☀️"];

export default function MemoryPlayer({ numeroCoppie, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    const icons = ICONE.slice(0, numeroCoppie);
    const deck = [...icons, ...icons]
      .map((icon, i) => ({ id: icon, key: i }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
  }, [numeroCoppie]);

  const handleFlip = (idx) => {
    if (
      flipped.length === 2 ||
      flipped.includes(idx) ||
      matched.includes(cards[idx].key)
    )
      return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((a) => a + 1);
      const [first, second] = newFlipped;

      if (cards[first].id === cards[second].id) {
        setMatched((prev) => [...prev, cards[first].key, cards[second].key]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          // Esercizio finito
          setTimeout(() => onComplete(attempts + 1, errors), 1000);
        }
      } else {
        setErrors((e) => e + 1);
        setTimeout(() => setFlipped([]), 1200);
      }
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {cards.map((card, i) => {
        const isShown = flipped.includes(i) || matched.includes(card.key);
        return (
          <button
            key={i}
            onClick={() => handleFlip(i)}
            className={`aspect-square rounded-[3rem] text-7xl flex items-center justify-center transition-all duration-500 border-8 ${
              isShown
                ? "bg-white border-blue-200 rotate-y-180"
                : "bg-blue-700 border-white shadow-2xl"
            }`}
          >
            {isShown ? card.id : "❓"}
          </button>
        );
      })}
    </div>
  );
}
