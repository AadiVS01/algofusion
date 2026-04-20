import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Stethoscope, 
  History, 
  Settings, 
  LogOut,
  Search as SearchIcon,
  Bell,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { patientId } = router.query;
  const activeId = patientId || 'P101';

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Consultation', icon: Stethoscope, path: `/consult?patientId=${activeId}` },
    { name: 'Patient History', icon: History, path: `/history/${activeId}` },
    { name: 'Clinical AI Hub', icon: Sparkles, path: `/insights/${activeId}` },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <span className="text-lg font-serif font-bold tracking-tight">ClinicAI</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
              SW
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Dr. Wilson</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Neurology</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-300 cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/history/${searchQuery.trim()}`);
                setSearchQuery('');
              }
            }}
            className="relative w-96 flex items-center"
          >
            <SearchIcon className="absolute left-4 w-4 h-4 text-slate-400" />
            <input 
              className="w-full bg-slate-50 border-none px-12 py-2.5 rounded-full text-xs focus:ring-2 focus:ring-slate-100 placeholder-slate-400 font-medium"
              placeholder="Search patient ID (e.g. P102)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-4">
             <div className="relative cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
