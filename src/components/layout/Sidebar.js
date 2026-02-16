/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import NavItem from "./NavItem";
import { getNavigation } from "@/config/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = getNavigation(user.Ruolo);

  return (
    <>
      {/* Mobile Header: Usiamo un blu più profondo per il contrasto */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-blue-800 text-white shadow-md">
        <h1 className="text-xl font-black italic tracking-tight">Remind</h1>
        <button onClick={() => setIsOpen(true)} className="p-2 text-3xl">
          ☰
        </button>
      </header>

      {/* Sidebar: Forziamo il bordo e lo sfondo bianco puro */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-300 transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo: Blu più scuro e font più spesso */}
          <div className="mb-10 text-2xl font-black text-blue-800 italic tracking-tighter">
            Remind
          </div>

          {/* Navigazione */}
          <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                onClick={() => setIsOpen(false)}
                // Assicurati che NavItem usi internamente text-slate-700 o 900
              />
            ))}
          </nav>

          {/* Profilo e Logout: Aumentiamo il contrasto dei testi secondari */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6 p-2">
              {/* Avatar più visibile */}
              <div className="w-10 h-10 rounded-xl bg-slate-300 flex items-center justify-center font-black text-slate-700">
                {user.Nome?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-sm text-slate-950 truncate">
                  {user.Nome}
                </p>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  {user.Ruolo}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full text-left p-4 text-red-700 bg-red-50 hover:bg-red-100 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-red-100"
            >
              Esci dall'account
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay: Più scuro per far risaltare la sidebar bianca */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
