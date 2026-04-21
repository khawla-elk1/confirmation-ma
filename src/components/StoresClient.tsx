"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Plus, ExternalLink, RefreshCw, ShoppingCart, AlertCircle, X, Trash2, CheckCircle, Zap } from 'lucide-react';
import { addStore, deleteStore } from '@/app/actions/store';

interface StoreData {
  id: string;
  name: string;
  platform: string;
  status: string;
  orders: string;
  syncTime: string;
  color: string;
}

export default function StoresClient({ stores }: { stores: StoreData[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('Shopify');

  const handleAddStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addStore(formData);
    setIsSubmitting(false);
    
    if (res?.success) {
      setIsModalOpen(false);
    } else {
      alert(res?.error || "Erreur de création");
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette boutique et son historique ?")) {
      await deleteStore(id);
    }
  };

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto w-full space-y-8 relative" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Vos Boutiques Connectées</h1>
              <p className="text-slate-400 text-sm mt-1">Gérez vos différentes plateformes E-commerce ({stores.length} au total) et surveillez les synchronisations.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
               <Plus size={16} />
               <span>Connecter une Boutique</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.length === 0 ? (
               <div className="col-span-3 text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-slate-400 font-medium">Aucune boutique connectée pour le moment.</p>
               </div>
            ) : stores.map((store: StoreData, i: number) => (
               <motion.div 
                 key={store.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="glass-panel p-6 rounded-3xl border border-white/5 relative group hover:border-white/10 transition-all"
               >
                  <div className="flex items-start justify-between mb-6">
                     <div className={`w-12 h-12 rounded-2xl bg-${store.color}-500/20 text-${store.color}-400 flex items-center justify-center border border-${store.color}-500/30`}>
                        <ShoppingCart size={20} />
                     </div>
                     <div className="flex gap-2">
                        {store.status === 'Error' ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                            <AlertCircle size={12} />
                            Déconnecté
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                            <RefreshCw size={12} className="animate-spin-slow" />
                            Synchronisé
                          </span>
                        )}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xl font-bold text-white tracking-tight">{store.name}</h3>
                     <p className="text-sm text-slate-500 font-medium">{store.platform}</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <div>
                        <span className="block text-xs text-slate-500 font-medium mb-1">Commandes Auto</span>
                        <span className="text-lg font-black text-white">{store.orders}</span>
                     </div>
                     <div className="text-right">
                        <span className="block text-xs text-slate-500 font-medium mb-1">Dernière synchro</span>
                        <span className="text-sm font-semibold text-slate-300">{store.syncTime}</span>
                     </div>
                  </div>

                  {/* Webhook URL Section */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                     <span className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider mb-2">URL Webhook à copier dans {store.platform}</span>
                     <div className="flex bg-black/60 border border-white/10 rounded-lg overflow-hidden group/webhook hover:border-emerald-500/30 transition-colors">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${store.platform.toLowerCase()}?storeId=${store.id}`} 
                          className="w-full text-[10px] font-mono p-2.5 text-slate-400 bg-transparent outline-none selection:bg-emerald-500/30" 
                        />
                        <button 
                          onClick={(e) => {
                             const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/${store.platform.toLowerCase()}?storeId=${store.id}`;
                             navigator.clipboard.writeText(url);
                             const btn = e.currentTarget;
                             const oldText = btn.innerHTML;
                             btn.innerHTML = "Copié !";
                             setTimeout(() => btn.innerHTML = oldText, 2000);
                          }}
                          className="px-3 bg-white/5 hover:bg-emerald-500 text-slate-300 hover:text-white text-[11px] font-bold transition-colors border-l border-white/10 group-hover/webhook:border-emerald-500/30"
                        >
                          Copier
                        </button>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteStore(store.id)}
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-rose-500/10 rounded-full hover:bg-rose-500/30"
                    title="Supprimer la boutique"
                  >
                     <Trash2 size={16} className="text-rose-400" />
                  </button>
               </motion.div>
            ))}
        </div>

        {/* Modal "Add Store" */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-white/10 max-h-[90vh] overflow-y-auto"
              >
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">Ajouter une Boutique</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                 </div>
                 
                 <form onSubmit={handleAddStore} className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Nom de la Boutique</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        autoFocus
                        placeholder="Ex: My Awesome Store"
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" 
                      />
                    </div>

                    {(selectedPlatform === 'Shopify' || selectedPlatform === 'YouCan') && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-2 border-t border-white/5"
                      >
                         <div className="flex items-center gap-2 mb-2">
                           <Zap size={14} className="text-amber-400" fill="currentColor" />
                           <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Connexion Automatique (Recommandé)</span>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Domaine .myshopify.com</label>
                              <input 
                                type="text" 
                                name="domain" 
                                placeholder="ma-boutique"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Admin Access Token</label>
                              <input 
                                type="password" 
                                name="accessToken" 
                                placeholder="shpat_..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" 
                              />
                            </div>
                         </div>
                         <p className="text-[10px] text-slate-500 italic">Laissez vide pour configurer manuellement via Webhook.</p>
                      </motion.div>
                    )}
                    
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Plateforme E-commerce</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Shopify', 'YouCan', 'WooCommerce', 'G-Sheets'].map((plat) => {
                          const colors: Record<string, string> = { 'Shopify': 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/50 text-emerald-400', 'YouCan': 'from-blue-500/20 to-blue-500/5 border-blue-500/50 text-blue-400', 'WooCommerce': 'from-rose-500/20 to-rose-500/5 border-rose-500/50 text-rose-400', 'G-Sheets': 'from-slate-500/20 to-slate-500/5 border-slate-500/50 text-slate-300' };
                          const icons: Record<string, string> = { 'Shopify': '🛍️', 'YouCan': '🛒', 'WooCommerce': '📦', 'G-Sheets': '📊' };
                          return (
                            <label key={plat} className="cursor-pointer relative" onClick={() => setSelectedPlatform(plat)}>
                              <input type="radio" name="platform" value={plat} className="peer sr-only" required defaultChecked={plat === 'Shopify'} />
                              <div className={`p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all peer-checked:bg-gradient-to-br peer-checked:border-current peer-checked:shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                                 <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">{icons[plat]}</span>
                                    <span className={`text-[13px] font-bold peer-checked:${colors[plat].split(' ')[2]}`}>{plat}</span>
                                 </div>
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 transition-opacity">
                                <CheckCircle size={14} className={colors[plat].split(' ')[2]} />
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden mt-6">
                       <h4 className="text-[13px] font-bold text-white flex items-center gap-2 mb-3">
                         <ExternalLink size={14} className="text-emerald-400" /> Comment intégrer avec {selectedPlatform} ?
                       </h4>
                       
                       {selectedPlatform === 'Shopify' && (
                         <div className="space-y-3">
                           <p className="text-[12px] text-slate-300 leading-relaxed">
                             1. Allez dans votre Dashboard Shopify &gt; <b>Paramètres</b> &gt; <b>Notifications</b>.<br/>
                             2. Descendez jusqu&apos;à <b>Webhooks</b> et cliquez sur <b>Créer un webhook</b>.<br/>
                             3. Événement : <b>Création de commande</b> | Format : <b>JSON</b>.
                           </p>
                           <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">URL À COLLER DANS SHOPIFY</label>
                              <div className="flex bg-black/60 border border-emerald-500/30 rounded-lg overflow-hidden">
                                 <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/shopify?storeId=VOTRE_ID`} className="w-full text-xs font-mono p-2.5 text-emerald-300 bg-transparent outline-none" />
                                 <button type="button" className="px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition">Copier</button>
                              </div>
                           </div>
                         </div>
                       )}

                       {selectedPlatform === 'YouCan' && (
                         <div className="space-y-3">
                           <p className="text-[12px] text-slate-300 leading-relaxed">
                             1. Allez dans le panneau d&apos;administration YouCan &gt; <b>Applications</b>.<br/>
                             2. Cliquez sur <b>Webhooks</b> et ajoutez une nouvelle intégration.<br/>
                             3. Cochez l&apos;événement <b>Order Created</b> pour déclencher le bot.
                           </p>
                           <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">URL À COLLER DANS YOUCAN</label>
                              <div className="flex bg-black/60 border border-blue-500/30 rounded-lg overflow-hidden">
                                 <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/youcan?storeId=VOTRE_ID`} className="w-full text-xs font-mono p-2.5 text-blue-300 bg-transparent outline-none" />
                                 <button type="button" className="px-4 bg-blue-500 hover:bg-blue-400 text-white font-bold transition">Copier</button>
                              </div>
                           </div>
                         </div>
                       )}

                       {selectedPlatform === 'WooCommerce' && (
                         <div className="space-y-3">
                           <p className="text-[12px] text-slate-300 leading-relaxed">
                             Allez sur WordPress &gt; <b>WooCommerce</b> &gt; <b>Réglages</b> &gt; <b>Avancé</b> &gt; <b>Webhooks</b>. Créez un nouveau Webhook (Sujet : Commande créée).
                           </p>
                           <div className="flex bg-black/60 border border-rose-500/30 rounded-lg overflow-hidden">
                             <input type="text" readOnly value="https://api.confirmation.ma/hook/woo_999" className="w-full text-xs font-mono p-2.5 text-rose-300 bg-transparent outline-none" />
                             <button type="button" className="px-4 bg-rose-500 hover:bg-rose-400 text-white font-bold transition">Copier</button>
                           </div>
                         </div>
                       )}

                       {selectedPlatform === 'G-Sheets' && (
                         <p className="text-[12px] text-slate-400 leading-relaxed">
                           Pour Google Sheets, importez manuellement votre fichier CSV ou installez notre Add-on Sheets officiel (Prochainement).
                         </p>
                       )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3.5 mt-2 text-center disabled:opacity-50 flex justify-center items-center font-black"
                    >
                      {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : "Connecter la plateforme"}
                    </button>
                 </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </motion.div>
  );
}
