"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Store, 
  MessageCircle, 
  Settings, 
  ChevronRight,
  Bell,
  Zap,
  ListChecks,
  Command
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { simulateValidation } from '@/app/actions/simulate';

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`nav-item group ${active ? 'nav-item-active' : 'nav-item-idle'}`}>
      <div className={`transition-transform duration-300 ${active ? 'scale-110 text-emerald-400' : 'group-hover:scale-110 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>{label}</span>
      {active && (
        <motion.div layoutId="navIndicator" className="absolute right-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] rounded-l-full top-0" />
      )}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '/';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSimulate = async () => {
    setShowToast(true);
    await simulateValidation();
    setTimeout(() => setShowToast(false), 4000);
  };

  const getPageTitle = () => {
    if (pathname === '/') return 'Vue Globale';
    if (pathname.includes('/stores')) return 'Boutiques Connectées';
    if (pathname.includes('/logs')) return 'Historique des messages';
    if (pathname.includes('/templates')) return 'Scénarios WhatsApp';
    if (pathname.includes('/settings')) return 'Configuration API';
    return 'Tableau de bord';
  };

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />; 

  return (
    <div className="flex min-h-screen text-slate-200 overflow-hidden relative selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Orbs */}
      <div className="fixed top-[-15%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 glass-panel px-5 py-3.5 rounded-2xl flex items-center gap-3 border border-emerald-500/30"
          >
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
               <Zap size={16} fill="currentColor" />
             </div>
             <div>
               <span className="text-sm font-bold text-white block">Bot WhatsApp Déclenché</span>
               <span className="text-xs text-slate-400">Traitement asynchrone des commandes...</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="w-64 border-r border-white/[0.04] hidden md:flex flex-col sticky top-0 h-screen bg-[#030303]/80 backdrop-blur-3xl z-10"
      >
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-white/10">
            <Command size={16} fill="none" strokeWidth={3} />
          </div>
          <span className="text-[18px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Confirma<span className="text-emerald-400">.</span>
          </span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <div className="px-3 mb-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Menu Principal</div>
          <NavLink href="/" icon={<LayoutDashboard size={18} />} label="Vue d'ensemble" active={pathname === '/'} />
          <NavLink href="/stores" icon={<Store size={18} />} label="Boutiques COD" active={pathname.includes('/stores')} />
          <NavLink href="/logs" icon={<ListChecks size={18} />} label="Historique & Logs" active={pathname.includes('/logs')} />
          <NavLink href="/templates" icon={<MessageCircle size={18} />} label="Scénarios WhatsApp" active={pathname.includes('/templates')} />
          <NavLink href="/settings" icon={<Settings size={18} />} label="Configuration API" active={pathname.includes('/settings')} />
        </nav>

        <div className="p-4 mt-auto">
           <form action={logoutAction}>
             <button type="submit" className="w-full glass-panel p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between border border-white/5 group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                     <span className="font-bold text-xs text-white">KF</span>
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-[13px] font-bold text-white truncate">Khawla Freelance</p>
                    <p className="text-[11px] text-rose-400 font-medium truncate group-hover:underline">Se déconnecter</p>
                  </div>
                </div>
             </button>
           </form>
        </div>
      </motion.aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-[72px] border-b border-white/[0.04] px-8 flex items-center justify-between sticky top-0 bg-[#050505]/60 backdrop-blur-2xl z-40">
           <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="text-slate-400 font-medium hover:text-white transition-colors cursor-pointer">Dashboard</span>
              <ChevronRight size={14} className="text-slate-600" />
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{getPageTitle()}</span>
           </div>
           <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-2 mr-4">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[11px] font-medium text-slate-400">WhatsApp API Connecté</span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell size={18} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0a]"></span>
              </button>
              <button 
                onClick={handleSimulate}
                className="btn-primary flex items-center gap-2"
              >
                <Zap size={14} fill="currentColor" />
                <span>Simuler Auto-Validation</span>
              </button>
           </div>
        </header>

        {children}
      </main>
    </div>
  );
}
