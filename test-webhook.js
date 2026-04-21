const fetch = require("node-fetch"); // Si node-fetch n'est pas dispo, on utilise le fetch natif de Node > 18

async function sendTestWebhook() {
  // ⚠️ REMPLACEZ CEF NUMÉRO PAR VOTRE VRAI NUMÉRO (Celui qui va RECEVOIR le message, pas celui qui a scanné le QR, sauf si vous voulez vous parler à vous-même)
  const VOTRE_NUMERO_CIBLE = "0673745726";

  // L'ID de votre boutique qui est bien présent dans votre base de données locale
  const DEMO_STORE_ID = "cmo33zqmv000nh5x58krai2bw";

  console.log(`📤 Simulation d'une commande Shopify entrante pour le client : ${VOTRE_NUMERO_CIBLE}`);

  // Simuler le payload Shopify
  const payload = {
    id: "SHOPIFY_ORDER_" + Math.floor(Math.random() * 10000),
    total_price: "299.00",
    shipping_address: {
      first_name: "Client",
      last_name: "Test",
      phone: VOTRE_NUMERO_CIBLE
    }
  };

  try {
    // Appeler VOTRE serveur Next.js (qui va gérer l'idempotence, le parsing, et appeler whatsappWorker)
    const res = await fetch(`http://localhost:3000/api/webhooks/shopify?storeId=${DEMO_STORE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.text();
    console.log("✅ Réponse du serveur Next.js :", data);
  } catch (error) {
    console.error("❌ Erreur :", error);
  }
}

sendTestWebhook();
