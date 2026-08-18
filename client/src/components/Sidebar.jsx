import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquarePlus,
  ListOrdered,
  User,
  LogOut,
  BarChart3,
  SlidersHorizontal,
  Tags,
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Submit Feedback', path: '/submit', icon: MessageSquarePlus },
    { label: 'My Feedback', path: '/my-feedback', icon: ListOrdered },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Feedback List', path: '/admin/feedback', icon: SlidersHorizontal },
    { label: 'Category Management', path: '/admin/categories', icon: Tags },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const content = (
    <div className="flex flex-col h-full justify-between p-6">
      <div>
        {/* Brand Logo */}
        <div className="pb-6 border-b border-white/10 mb-6">
          <Logo size="md" />
        </div>

        {/* User Role Badge */}
        <div className="mb-6 px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-400/40 flex items-center justify-center font-bold text-brand-300 text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
            <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500/30 to-brand-600/20 text-brand-300 border border-brand-400/30 shadow-glow-blue'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors w-full mt-auto"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/10 min-h-screen fixed top-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 glass-panel border-r border-white/20 z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
