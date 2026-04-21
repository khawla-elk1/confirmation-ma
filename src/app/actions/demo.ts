"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createDemoStore() {
  const user = await prisma.user.findFirst();
  if (!user) return { error: "Utilisateur non trouvé. Connectez-vous d'abord." };

  try {
    // 1. Créer une boutique de test
    const store = await prisma.store.create({
      data: {
        name: "Shopify Démo (Maroc)",
        platform: "Shopify",
        userId: user.id
      }
    });

    // 2. Créer quelques clients et commandes fictives
    const customers = [
      { name: "Ahmed Amrani", phone: "+212611223344", city: "Casablanca" },
      { name: "Zineb Tazi", phone: "+212655667788", city: "Rabat" }
    ];

    for (const c of customers) {
      const customer = await prisma.customer.upsert({
        where: { phone: c.phone },
        update: {},
        create: { phone: c.phone, name: c.name, city: c.city }
      });

      const order = await prisma.order.create({
        data: {
          totalAmount: Math.floor(Math.random() * 500) + 200,
          status: "PENDING",
          storeId: store.id,
          customerId: customer.id,
        }
      });

      // Créer un log simulé
      await prisma.validationLog.create({
        data: {
          orderId: order.id,
          messageSent: `Bonjour ${c.name}, votre commande chez Shopify Démo est en cours de préparation ! 🚚`,
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/stores");
    revalidatePath("/logs");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la création du mode démo." };
  }
}
