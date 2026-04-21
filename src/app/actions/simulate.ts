"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const prisma = new PrismaClient();

export async function simulateValidation() {
  try {
    // 1. Get the first user and their template
    const user = await prisma.user.findFirst({
      include: { templates: true, stores: true }
    });

    if (!user || user.stores.length === 0) {
      return { error: "Veuillez d'abord connecter une boutique et créer un scénario." };
    }

    const store = user.stores[0];
    const template = user.templates[0] ?? { body: "Bonjour ! Merci pour votre commande." };

    // 2. Create a fake customer
    const phone = `+2126${Math.floor(10000000 + Math.random() * 90000000)}`;
    const customer = await prisma.customer.create({
      data: {
        phone,
        name: "Client Simulé",
        city: "Casablanca"
      }
    });

    // 3. Create a fake order
    const order = await prisma.order.create({
      data: {
        totalAmount: 299,
        status: "PENDING",
        storeId: store.id,
        customerId: customer.id,
      }
    });

    const messageContent = template.body.replace('{client_nom}', customer.name ?? "Client");

    // 4. Send Message via Local WhatsApp Worker
    let externalStatus = "LOGGED_ONLY";
    try {
      const waResult = await sendWhatsAppMessage(
        "local-worker", 
        "no-token",
        phone, // Caution: this is random, might attempt to send to real people if not careful!
        "n/a",
        "fr",
        messageContent
      );
      externalStatus = waResult.success ? "SENT_REAL" : "FAILED_REAL";
      console.log("WhatsApp Local Send Status:", externalStatus, waResult.data || waResult.error);
    } catch(e) {
      console.error(e);
      externalStatus = "FAILED_LOCAL";
    }

    // 5. Create a validation log
    await prisma.validationLog.create({
      data: {
        orderId: order.id,
        messageSent: messageContent + (externalStatus !== "LOGGED_ONLY" ? ` [${externalStatus}]` : ""),
      }
    });

    revalidatePath("/");
    return { success: true, externalStatus };
  } catch (err) {
    console.error("Simulation error:", err);
    return { error: "Erreur lors de la simulation." };
  }
}
