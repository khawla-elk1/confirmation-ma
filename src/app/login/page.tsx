"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { loginAction } from '@/app/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
            className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
          >
            <Bot size={40} className="text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight">Confirmation<span className="text-emerald-400">.ma</span></h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Rejoignez la révolution COD au Maroc</p>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 shadow-2xl relative">
          
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <ShieldCheck size={100} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center">
                 {error}
               </motion.div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Adresse E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue="khawla@freelance.ma"
                  required 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" 
                  placeholder="nom@boutique.ma"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mot de passe</label>
                <a href="#" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">Oublié ?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500" />
                </div>
                <input 
                  type="password" 
                  name="password" 
                  defaultValue="admin"
                  required 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono tracking-widest" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2 group"
            >
              {isLoading ? "Connexion sécurisée..." : (
                 <>
                   Accéder au Dashboard
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8 font-medium font-sans">
            Sécurisé par Meta et des serveurs marocains ultra-rapides. <Zap size={10} className="inline text-amber-400" />
          </p>
        </div>
      </motion.div>
    </div>
  );
}
