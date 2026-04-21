/**
 * TEST SCRIPT: Simulate a new order incoming from a store.
 * Usage: npx ts-node scripts/test-webhook.ts
 */

const TEST_ORDER = {
  customer_name: "Khalid Benjelloun",
  customer_phone: "+212600112233",
  customer_city: "Marrakech",
  total_price: "350.50",
  items: ["Produit Anti-Chute", "Brosse Tech"]
};

async function simulateOrder() {
  console.log("🚀 Simulation d'une nouvelle commande...");
  
  try {
    const response = await fetch("http://localhost:3000/api/webhooks/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "STORE_ID_HERE" // Remplacer par un ID valide après migration
      },
      body: JSON.stringify(TEST_ORDER)
    });

    const data = await response.json();
    console.log("✅ Réponse du serveur :", data);
  } catch (error) {
    console.error("❌ Erreur : Assurez-vous que le serveur dev 'npm run dev' est lancé.");
  }
}

simulateOrder();
