// src/components/layout/Sidebar.js
"use client";
import { useState } from 'react';
import { useAuth } from '@/context/auth-context'; // Assumendo che tu lo crei
import NavItem from './NavItem';
import { getNavigation } from '@/config/navigation';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Se non c'è utente, non mostriamo la sidebar
  if (!user) return null;

  const navItems = getNavigation(user.ruolo);

  return (
    <>
      {/* Mobile Header: visibile solo su schermi piccoli */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-blue-700 text-white">
        <h1 className="text-xl font-bold">CogniCare</h1>
        <button onClick={() => setIsOpen(true)} className="p-2 text-2xl">☰</button>
      </header>

      {/* Sidebar Desktop e Mobile (Offcanvas) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-10 text-2xl font-bold text-blue-700">CogniCare</div>

          {/* Navigazione */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} onClick={() => setIsOpen(false)} />
            ))}
          </nav>

          {/* Profilo e Logout in basso */}
          <div className="mt-auto pt-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-bold text-sm">{user.nome}</p>
                <p className="text-xs text-slate-500 uppercase">{user.ruolo}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Esci
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay per chiudere il menu mobile cliccando fuori */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}