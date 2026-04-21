"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Smartphone, RefreshCw, CheckCircle } from 'lucide-react';
// Next.js Image component not needed here since we inject base64 text into img src directly

interface SettingsProps {
  initialSettings?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SettingsClient({ initialSettings: _initialSettings }: SettingsProps) {
  const [waStatus, setWaStatus] = useState<"loading" | "qr" | "connected">("loading");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Vérification de la passerelle WhatsApp...");

  const checkWhatsAppStatus = async () => {
    try {
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:3001";
      const res = await fetch(`${workerUrl}/api/qr`);
      const data = await res.json();
      
      if (data.connected) {
        setWaStatus("connected");
        setStatusMessage("Appareil lié avec succès.");
      } else if (data.qr) {
        setWaStatus("qr");
        setQrCodeData(data.qr);
        setStatusMessage("En attente du scan...");
      } else {
        setWaStatus("loading");
        setStatusMessage(data.status || "Génération en cours...");
      }
    } catch {
      setWaStatus("loading");
      setStatusMessage("Passerelle WhatsApp locale hors-ligne. (Avez-vous lancé node whatsappWorker.js ?)");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkWhatsAppStatus();
    const interval = setInterval(checkWhatsAppStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto w-full space-y-8" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Liaison Appareil WhatsApp</h1>
              <p className="text-slate-400 text-sm mt-1">Connectez votre numéro de téléphone personnel ou professionnel sans compte Facebook Business.</p>
            </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Smartphone size={20} />
               </div>
               <h3 className="text-xl font-bold text-white">Scanner avec WhatsApp (Méthode Web)</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center justify-center py-6">
                
                {/* Visualiser le Statut ou le QR code */}
                <div className="flex flex-col items-center justify-center gap-4 w-[280px] h-[280px] rounded-3xl bg-black/40 border border-white/10 p-4 relative overflow-hidden shadow-2xl shadow-emerald-500/5">
                   {waStatus === "connected" && (
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-emerald-400 gap-4">
                       <CheckCircle size={64} fill="currentColor" className="text-black" />
                       <span className="font-bold text-lg text-emerald-400">Connecté !</span>
                     </motion.div>
                   )}
                   {waStatus === "loading" && (
                     <div className="flex flex-col items-center text-slate-400 gap-4">
                       <RefreshCw size={32} className="animate-spin text-emerald-400" />
                       <span className="font-medium text-sm text-center">{statusMessage}</span>
                     </div>
                   )}
                   {waStatus === "qr" && qrCodeData && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 bg-white p-2 rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCodeData} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
                     </motion.div>
                   )}
                </div>

                {/* Instructions */}
                <div className="flex-1 space-y-5 text-slate-300">
                   <h4 className="text-lg font-bold text-white">Instructions</h4>
                   <ol className="list-decimal pl-5 space-y-3 font-medium text-[14px]">
                      <li>Ouvrez WhatsApp sur votre téléphone.</li>
                      <li>Appuyez sur <strong className="text-emerald-400">Menu</strong> ou <strong className="text-emerald-400">Paramètres</strong> et sélectionnez <strong>Appareils liés</strong>.</li>
                      <li>Appuyez sur <strong>Connecter un appareil</strong>.</li>
                      <li>Pointez votre téléphone vers cet écran pour scanner le code QR affiché.</li>
                   </ol>
                   <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200">
                     <span className="font-bold block mb-1">Important (Version Locale)</span>
                     Pour que cela fonctionne sur votre machine actuelle, vous devez ouvrir un autre terminal et lancer la commande : 
                     <code className="block bg-black/50 p-2 rounded mt-2 px-3 text-emerald-400 border border-white/10">node whatsappWorker.js</code>
                   </div>
                </div>

            </div>

            <div className={`border ${waStatus === 'connected' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-500/5 border-white/5'} rounded-2xl p-4 flex gap-4 transition-colors`}>
               <div className={`${waStatus === 'connected' ? 'text-emerald-400' : 'text-slate-400'} pt-1`}>
                  <Zap size={20} fill="currentColor" />
               </div>
               <div className="text-sm">
                  <p className={`font-bold ${waStatus === 'connected' ? 'text-emerald-400' : 'text-slate-400'} mb-1`}>
                    Status passerelle : {waStatus === 'connected' ? "Active" : "En attente d'appareil"}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Une fois le code scanné, Confirmation.ma prendra en charge les envois via votre compte existant, contournant ainsi les API Meta coûteuses.
                  </p>
               </div>
            </div>
        </div>
    </motion.div>
  );
}
