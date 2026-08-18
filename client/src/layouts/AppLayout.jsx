import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { BackgroundBlobs } from '../components/BackgroundBlobs';

export const AppLayout = ({ children, title = 'Dashboard' }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen relative flex bg-slate-950 text-slate-100 overflow-x-hidden">
      <BackgroundBlobs />

      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 relative z-10">
        <Navbar onMenuClick={() => setIsMobileOpen(true)} title={title} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
