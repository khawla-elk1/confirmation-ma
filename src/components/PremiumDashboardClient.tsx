"use client";

import React, { useState, useLayoutEffect } from 'react';
import { 
  CheckCircle,
  Package,
  Activity,
  Smartphone,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { createDemoStore } from '@/app/actions/demo';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
};

interface DashboardData {
  stats: {
    totalOrders: number;
    confirmationRate: number;
    savedReturns: string;
    canceledCount: number;
    totalTemplates: number;
  };
  recentOrders: {
    id: string;
    name: string;
    price: string;
    status: string;
    source: string;
  }[];
  chartData: {
    name: string;
    Confirmées: number;
    Annulées: number;
  }[];
}

export default function PremiumDashboardClient({ data }: { data: DashboardData }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto w-full space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
        {data.stats.totalOrders === 0 && (
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-6"
          >
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                   <Sparkles size={32} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Bienvenue sur votre Dashboard !</h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-md">Vous n&apos;avez pas encore de boutique ? Pas de soucis. Cliquez sur le bouton pour installer une boutique de test et voir la magie opérer.</p>
                </div>
             </div>
             <button 
               onClick={async () => {
                 await createDemoStore();
               }}
               className="btn-primary flex items-center gap-3 px-8 py-4 text-sm"
             >
                <Sparkles size={18} fill="currentColor" />
                <span>Installer le Mode Démo</span>
             </button>
          </motion.div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <KPIBox title="Taux de Confirmation" value={`${data.stats.confirmationRate}%`} trend="+5.4% ce mois" trendUp={true} icon={<CheckCircle size={20} className="text-emerald-400" />} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPIBox title="Retours Sauvegardés" value={`${data.stats.savedReturns} DH`} trend="Économisés" trendUp={true} icon={<Package size={20} className="text-blue-400" />} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPIBox title="Commandes Totales" value={`${data.stats.totalOrders}`} trend="En direct" trendUp={true} icon={<Activity size={20} className="text-violet-400" />} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPIBox title="Scénarios Actifs" value={`${data.stats.totalTemplates}`} trend="Connectés à l'API" trendUp={true} icon={<Smartphone size={20} className="text-emerald-500" />} />
          </motion.div>
        </div>

        {/* ===== RICHESSE SAUVÉE BANNER ===== */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-black/80 to-black/60 p-6 md:p-8"
        >
          {/* Glowing BG Effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <ShieldCheck size={30} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500/80 mb-1">💎 Rapport Richesse Sauvée — Ce Mois-ci</p>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Vous avez économisé{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    {data.stats.savedReturns} DH
                  </span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Grâce à Confirmation.ma, vous avez évité <span className="text-white font-bold">{data.stats.canceledCount} retour{data.stats.canceledCount !== 1 ? 's' : ''}</span> non-livrés.
                  Sans notre bot, chaque retour vous coûtait <span className="text-rose-400 font-bold">~45 DH</span> de frais Amana.
                </p>
              </div>
            </div>

            {/* Right: Breakdown Stats */}
            <div className="flex gap-4 flex-shrink-0">
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Truck size={14} className="text-rose-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retours évités</span>
                </div>
                <span className="text-2xl font-black text-white">{data.stats.canceledCount}</span>
              </div>
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Frais / Retour</span>
                </div>
                <span className="text-2xl font-black text-emerald-400">45 DH</span>
              </div>
              <div className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Sparkles size={14} className="text-emerald-400" fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">Total Sauvé</span>
                </div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{data.stats.savedReturns} DH</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Performances des Validations</h3>
                  <p className="text-sm text-slate-500 mt-1">Données issues de la base de données Prisma</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-[12px] font-bold shadow-lg shadow-emerald-500/20">Semaine</button>
                  <button className="px-4 py-1.5 text-slate-400 text-[12px] font-bold hover:text-white transition">Mois</button>
                </div>
            </div>
            <div className="h-[300px] w-full" style={{ minHeight: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConfirm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCancel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#334155" tick={{fill: '#8b96a5', fontSize: 11, fontWeight: 600}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}
                      itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#8b96a5', fontSize: '12px', marginBottom: '8px' }}
                  />
                  <Area type="monotone" dataKey="Confirmées" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConfirm)" />
                  <Area type="monotone" dataKey="Annulées" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCancel)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Orders Table */}
          <motion.div variants={itemVariants} className="glass-panel rounded-3xl border border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">Dernières Commandes</h3>
              <button className="text-xs text-emerald-400 font-bold hover:underline">Voir tout</button>
            </div>
            <div className="p-0 space-y-0 flex-1 overflow-y-auto mt-2">
                {data.recentOrders.length === 0 ? (
                   <p className="text-sm text-slate-500 font-medium text-center py-16">Aucune commande. Naviguez vers /api/seed pour initialiser.</p>
                ) : data.recentOrders.map((order: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={order.id} 
                    className="flex items-center justify-between px-6 py-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer group last:border-0"
                  >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all uppercase shadow-inner">
                            {order.name[0]}
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-slate-200 group-hover:text-white transition-colors">{order.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md uppercase tracking-widest font-semibold border border-white/[0.03]">{order.source}</span>
                            </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[13px] font-mono font-bold text-white">{order.price} DH</span>
                        <StatusBadge status={order.status} />
                      </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
    </motion.div>
  );
}

function KPIBox({ title, value, trend, icon, trendUp }: { title: string, value: string, trend: string, icon: React.ReactNode, trendUp: boolean }) {
  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
       <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-125 group-hover:opacity-40 transition-all duration-700 ease-out">
         {icon}
       </div>
       <div className="flex flex-col h-full relative z-10">
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 mb-4">{title}</span>
          <div className="flex items-baseline gap-1 mt-auto">
            <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tighter">{value}</h4>
          </div>
          <div className="flex items-center gap-2 mt-4">
             <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${trendUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
               {trend}
             </span>
          </div>
       </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string, bg: string, text: string, border: string }> = {
    CONFIRMED: { label: 'Confirmé', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    PENDING: { label: 'En attente', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    CANCELLED: { label: 'Annulé', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    NO_ANSWER: { label: 'Injoignable', bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/20' },
  };
  
  const current = config[status] || { label: status, bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/20' };

  return (
    <div className={`px-2.5 py-1 rounded-md border ${current.bg} ${current.border} ${current.text} flex items-center shadow-inner`}>
       <span className="text-[10px] font-black uppercase tracking-[0.1em]">{current.label}</span>
    </div>
  );
}
