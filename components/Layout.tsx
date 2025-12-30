
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, Home, FileText, AlertTriangle, Settings, Bell, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-orange-500 p-1 rounded">PV</span>
            <span>PVMS India</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">e-Governance Portal</p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <a href="#/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#/report" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <AlertTriangle size={20} />
            <span>Report Violation</span>
          </a>
          {user.role !== UserRole.CITIZEN && (
            <>
              <a href="#/inspections" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                <FileText size={20} />
                <span>Active Inspections</span>
              </a>
              <a href="#/rules" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                <Settings size={20} />
                <span>Rule Config</span>
              </a>
            </>
          )}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-orange-500" alt="Avatar" />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-slate-700">Central Enforcement System</h2>
          <div className="flex items-center gap-4">
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="h-8 w-[1px] bg-slate-200"></div>
             <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">GOI-V2.0</span>
             </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
