import React from 'react';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onMenuClick, title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="glass-panel border-b border-white/10 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-white">{user?.name}</span>
          <span className="text-xs text-slate-400">{user?.email}</span>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-glow-blue flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-extrabold text-brand-300 text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
