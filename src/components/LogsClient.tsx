"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Check, ExternalLink, Calendar, Clock, User, Phone } from 'lucide-react';

interface LogEntry {
  id: string;
  order: {
    id: string;
    customer: {
      name: string | null;
      phone: string;
    };
    store: {
      name: string;
    };
  };
  messageSent: string;
  responseReceived: string | null;
  sentAt: string | Date;
}

export default function LogsClient({ logs }: { logs: LogEntry[] }) {
  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto w-full space-y-8" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Historique des Validations</h1>
              <p className="text-slate-400 text-sm mt-1">Suivez en temps réel tous les messages envoyés à vos clients.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un client ou commande..." 
                    className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
                  />
               </div>
               <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <Filter size={18} />
               </button>
            </div>
        </div>

        <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Client & Boutique</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Message Envoyé</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Statut</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Heure</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {logs.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">
                             Aucun log de validation disponible.
                          </td>
                       </tr>
                    ) : logs.map((log, i) => (
                       <motion.tr 
                         key={log.id} 
                         initial={{ opacity: 0, x: -10 }} 
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="hover:bg-white/[0.02] transition-colors group"
                       >
                          <td className="px-6 py-5">
                             <div className="flex flex-col">
                                <span className="text-white font-bold flex items-center gap-2">
                                   <User size={12} className="text-emerald-400" /> {log.order.customer.name || 'Client Inconnu'}
                                </span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                                   <Phone size={10} /> {log.order.customer.phone}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 w-fit mt-2 text-slate-400 font-medium">
                                   Boutique: {log.order.store.name}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="max-w-xs xl:max-w-md">
                                 <p className="text-sm text-slate-300 line-clamp-2 italic leading-relaxed">
                                    &ldquo;{log.messageSent}&rdquo;
                                 </p>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                             {log.responseReceived ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                   <Check size={12} /> Confirmé
                                </div>
                             ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                                   <Clock size={12} /> En attente
                                </div>
                             )}
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex flex-col">
                                <span className="text-xs text-white font-medium flex items-center gap-1.5">
                                   <Calendar size={12} className="text-slate-500" />
                                   {new Date(log.sentAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                </span>
                                <span className="text-[11px] text-slate-500 ml-4.5 mt-0.5">
                                   {new Date(log.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-all opacity-0 group-hover:opacity-100">
                                <ExternalLink size={16} />
                             </button>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="bg-white/[0.02] px-6 py-4 flex items-center justify-between border-t border-white/5">
              <span className="text-xs text-slate-500">Affichage de {logs.length} résultats</span>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-white/5 rounded-lg opacity-50 cursor-not-allowed">Précédent</button>
                 <button className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-500/20 border border-emerald-500/30 rounded-lg">Suivant</button>
              </div>
           </div>
        </div>
    </motion.div>
  );
}
