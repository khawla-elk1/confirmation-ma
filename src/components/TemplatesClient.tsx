"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Code, Save, Play, Bot, Smartphone, RefreshCw } from 'lucide-react';
import { saveTemplate } from '@/app/actions/template';

export default function TemplatesClient({ initialTemplate }: { initialTemplate: any }) {
  const [trigger, setTrigger] = useState(initialTemplate?.trigger || "ON_NEW_ORDER");
  const [body, setBody] = useState(
    initialTemplate?.body || "Bonjour {client_nom} ! 👋\n\nMerci d'avoir passé commande sur notre boutique.\nNous avons bien reçu votre demande pour le produit : {produit_nom}.\nSuper Nouvelle ! La livraison est GRATUITE. 🚚\n\nSouhaitez-vous confirmer l'expédition pour la recevoir demain ?"
  );
  const [button1, setButton1] = useState(initialTemplate?.button1 || "Oui, Je confirme !");
  const [button2, setButton2] = useState(initialTemplate?.button2 || "Annuler ma commande");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await saveTemplate(formData);
    setIsSubmitting(false);

    if (res?.success) {
      alert("Scénario WhatsApp sauvegardé avec succès !");
    } else {
      alert(res?.error || "Erreur de sauvegarde");
    }
  };

  // Replace variables for preview
  const previewBody = body
    .replace('{client_nom}', 'Khalid')
    .replace('{produit_nom}', 'Pack Montre Luxe')
    .split('\n').map((str: string, index: number) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));

  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto w-full space-y-8" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <form onSubmit={handleSave}>
        <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Scénarios WhatsApp</h1>
              <p className="text-slate-400 text-sm mt-1">Configurez les messages automatisés envoyés par votre Bot WhatsApp.</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
               {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
               <span>Enregistrer Modèle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                   <h3 className="text-lg font-bold text-white mb-4">Éditeur du Message</h3>
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Trigger / Déclencheur</label>
                        <select 
                          name="trigger"
                          value={trigger} 
                          onChange={(e) => setTrigger(e.target.value)} 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        >
                           <option value="ON_NEW_ORDER">Dès la réception de la nouvelle commande (Immédiat)</option>
                           <option value="AFTER_15_MIN">Après 15 minutes</option>
                           <option value="MANUAL">Manuel (Via le Dashboard)</option>
                         </select>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Corps du Message</label>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setBody("Salam {client_nom} ! 👋\n\nTkellmti m3ana 3la la commande dyalek f {boutique_nom}.\nLe montant d'achat dyalek howa: {montant}.\n\nBghiti nconfirmiw lik l'expédition bach tweslek ghedda inchaallah ?")} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors">🇲🇦 Darija</button>
                            <button type="button" onClick={() => setBody("مرحباً {client_nom} ! 👋\n\nنشكرك على طلبك من متجرنا {boutique_nom}.\nقيمة طلبك هي: {montant}.\n\nهل تؤكد طلبك ليتم شحنه إليك غداً ؟")} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors">🇦🇪 Arabic</button>
                            <button type="button" onClick={() => setBody("Bonjour {client_nom} ! 👋\n\nMerci d'avoir passé commande sur {boutique_nom}.\nVotre total est de {montant}.\nLa livraison est GRATUITE. 🚚\n\nSouhaitez-vous confirmer l'expédition pour la recevoir demain ?")} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors">🇫🇷 Français</button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-black/40 rounded-xl border border-white/5">
                           <span className="text-[10px] text-slate-500 font-medium px-2 py-1">Variables :</span>
                           {['{client_nom}', '{montant}', '{boutique_nom}', '{produit_nom}'].map(variable => (
                             <button 
                               key={variable} 
                               type="button" 
                               onClick={() => setBody(body + ' ' + variable)} 
                               className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors"
                             >
                               {variable}
                             </button>
                           ))}
                        </div>

                        <textarea 
                          name="body"
                          rows={7}
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-y font-mono leading-relaxed"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Boutons d'Action Rapide / Réponses Attendues</label>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-1 relative">
                              <input 
                                type="text" 
                                name="button1"
                                value={button1} 
                                onChange={(e) => setButton1(e.target.value)}
                                className="w-full bg-transparent text-center text-sm font-bold text-emerald-400 outline-none p-2"
                              />
                           </div>
                           <div className="flex-1 bg-rose-500/10 border border-rose-500/30 rounded-xl p-1 relative">
                              <input 
                                type="text" 
                                name="button2"
                                value={button2} 
                                onChange={(e) => setButton2(e.target.value)}
                                className="w-full bg-transparent text-center text-sm font-bold text-rose-400 outline-none p-2"
                              />
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 border-b-[8px] bg-gradient-to-b from-white/5 to-[#050505] relative shadow-2xl overflow-hidden h-[600px] flex flex-col">
                   {/* Dynamic island mock */}
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
                   
                   <div className="bg-[#075e54] text-white p-4 pt-10 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Bot size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-[15px]">Confirmation.ma</p>
                         <p className="text-xs text-white/70">En ligne</p>
                      </div>
                   </div>

                   <div className="flex-1 bg-[#efeae2]/5 p-4 space-y-4 overflow-y-auto">
                      <div className="flex justify-center">
                         <span className="px-3 py-1 bg-black/40 rounded-lg text-[10px] text-white/50">Aujourd'hui</span>
                      </div>
                      <div className="bg-[#202c33] p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm text-[#e9edef] shadow-md border border-white/5 leading-relaxed">
                         {previewBody}
                         <span className="block text-right text-[10px] text-white/40 mt-1">10:45</span>
                      </div>
                      
                      {/* Interactive Buttons Preview */}
                      <div className="flex flex-col gap-2 w-full max-w-[85%]">
                         {button1 && (
                           <div className="bg-[#00a884] text-white p-2.5 rounded-xl text-sm font-bold shadow-md text-center">
                             {button1}
                           </div>
                         )}
                         {button2 && (
                           <div className="bg-[#2a3942] text-[#e9edef] p-2.5 rounded-xl text-sm font-bold shadow-md text-center">
                             {button2}
                           </div>
                         )}
                      </div>
                   </div>
                </div>
            </div>
        </div>
      </form>
    </motion.div>
  );
}
