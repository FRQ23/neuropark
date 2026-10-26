import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RoleSwitcherBanner } from './RoleSwitcherBanner';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas-light flex flex-col selection:bg-calm-200 selection:text-calm-900">
      {/* Top Demo Banner for easy testing and role switching */}
      <RoleSwitcherBanner />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-72 min-w-0">
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" id="main-content">
            <Outlet />
          </main>

          <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-6 text-center text-xs text-slate-500">
            <p>
              NeuroParque &copy; 2026 — Modelo de gestión y seguimiento de adecuación de parques inclusivos para
              personas neurodivergentes.
            </p>
            <p className="mt-0.5 text-slate-400">
              Desarrollado para el Comité de Parque Cooper (Ensenada, B.C.) y replicabilidad estatal.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
