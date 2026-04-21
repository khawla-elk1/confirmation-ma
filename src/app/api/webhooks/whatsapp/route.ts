import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction requise par Meta pour vérifier le webhook
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Définir un token sécurisé dans vos variables d'environnement
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "confirma-webhook-token99";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Réception des messages WhatsApp (Clients qui répondent)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vérifier s'il s'agit d'un événement WhatsApp
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value.messages && change.value.messages[0]) {
            const message = change.value.messages[0];
            const senderPhone = message.from; // e.g. "212600000000"
            const textResponse = message.text?.body || "";
            const buttonResponse = message.button?.text || "";

            const incomingText = (buttonResponse || textResponse).toLowerCase();

            // 1. Identifier le client
            const customer = await prisma.customer.findUnique({
              where: { phone: senderPhone },
              include: { 
                orders: { 
                  where: { status: "PENDING" },
                  orderBy: { createdAt: "desc" },
                  take: 1
                } 
              }
            });

            if (customer && customer.orders.length > 0) {
              const pendingOrder = customer.orders[0];
              
              // 2. Logique Métier d'Auto-Validation
              let newStatus = null;
              
              // Analyse NLP très basique pour les retours
              if (
                incomingText.includes("oui") || 
                incomingText.includes("confirme") || 
                incomingText.includes("je veux") || 
                incomingText.includes("c'est bon")
              ) {
                newStatus = "CONFIRMED";
              } else if (
                incomingText.includes("non") || 
                incomingText.includes("annule") || 
                incomingText.includes("plus besoin") || 
                incomingText.includes("erreur")
              ) {
                newStatus = "CANCELLED";
              }

              // 3. Mise à jour de l'état
              if (newStatus) {
                await prisma.order.update({
                  where: { id: pendingOrder.id },
                  data: { status: newStatus }
                });

                // Enregistrer la réponse
                await prisma.validationLog.create({
                  data: {
                    orderId: pendingOrder.id,
                    messageSent: `[REÇU] ${incomingText}`,
                    responseReceived: incomingText,
                    repliedAt: new Date()
                  }
                });

                console.log(`Auto-validation: Ordre ${pendingOrder.id} marqué comme ${newStatus}`);
              }
            }
          }
        }
      }
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Not a valid WhatsApp payload" }, { status: 400 });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
