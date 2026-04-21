import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Purge et reset de la base de données (pour démo)
    await prisma.validationLog.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.store.deleteMany();
    await prisma.whatsAppTemplate.deleteMany();
    await prisma.user.deleteMany();

    // 2. Création de l'utilisateur principal (Khawla)
    const user = await prisma.user.create({
      data: {
        email: "khawla@freelance.ma",
        name: "Khawla Freelance",
      }
    });

    // 3. Création des Boutiques (Stores)
    const store1 = await prisma.store.create({
       data: { name: "MaBoutique.ma", platform: "Shopify", userId: user.id }
    });
    const store2 = await prisma.store.create({
       data: { name: "ElectroMaroc", platform: "YouCan", userId: user.id }
    });
    const store3 = await prisma.store.create({
       data: { name: "Beauty Store", platform: "WooCommerce", userId: user.id }
    });

    // 4. Création des Clients (Customers)
    const c1 = await prisma.customer.create({ data: { phone: "+212601112233", name: "Khalid Benjelloun", city: "Casablanca" }});
    const c2 = await prisma.customer.create({ data: { phone: "+212602223344", name: "Sara Mansouri", city: "Rabat" }});
    const c3 = await prisma.customer.create({ data: { phone: "+212603334455", name: "Yassine Alami", city: "Agadir" }});
    const c4 = await prisma.customer.create({ data: { phone: "+212604445566", name: "Meryem Tazi", city: "Tanger" }});

    // 5. Création des Commandes (Orders)
    await prisma.order.create({ data: { totalAmount: 499, status: "CONFIRMED", storeId: store1.id, customerId: c1.id }});
    await prisma.order.create({ data: { totalAmount: 199, status: "PENDING", storeId: store2.id, customerId: c2.id }});
    await prisma.order.create({ data: { totalAmount: 250, status: "CANCELLED", storeId: store3.id, customerId: c3.id }});
    await prisma.order.create({ data: { totalAmount: 499, status: "NO_ANSWER", storeId: store1.id, customerId: c4.id }});

    // 6. Création des Templates WhatsApp
    await prisma.whatsAppTemplate.create({
      data: {
        name: "Message de Confirmation Initiale",
        trigger: "ON_NEW_ORDER",
        body: "Bonjour {client_nom} ! 👋\n\nMerci d'avoir passé commande sur notre boutique.\nNous avons bien reçu votre demande pour le produit : {produit_nom}.\nSuper Nouvelle ! La livraison est GRATUITE. 🚚\n\nSouhaitez-vous confirmer l'expédition pour la recevoir demain ?",
        button1: "Oui, Je confirme !",
        button2: "Annuler ma commande",
        userId: user.id
      }
    });

    return NextResponse.json({ 
       success: true, 
       message: "Base de données initialisée avec succès avec Prisma !",
       data: { user, stores: 3, orders: 4, templates: 1 }
    });
  } catch (error) {
    console.error("Erreur Seed Prisma:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de l'initialisation de la DB." }, { status: 500 });
  }
}
