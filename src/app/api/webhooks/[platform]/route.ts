import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params; // shopify ou youcan
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return NextResponse.json({ error: "Store ID missing" }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(`Webhook received from ${platform}:`, body);

    // 1. Récupération de la boutique et de l'utilisateur
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { user: { include: { templates: true } } }
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    // 2. Extraction des données selon la plateforme
    let customerName = "Client";
    let customerPhone = "";
    let totalAmount = 0;
    let externalId = "";

    if (platform === "shopify") {
      customerName = `${body.shipping_address?.first_name || ""} ${body.shipping_address?.last_name || ""}`.trim();
      customerPhone = body.shipping_address?.phone || body.customer?.phone || "";
      totalAmount = parseFloat(body.total_price || "0");
      externalId = body.id?.toString();
    } else if (platform === "youcan") {
      customerName = `${body.first_name || ""} ${body.last_name || ""}`.trim();
      customerPhone = body.phone || "";
      totalAmount = parseFloat(body.total_price || "0");
      externalId = body.id;
    }

    if (!customerPhone) {
      return NextResponse.json({ error: "No phone number found in order" }, { status: 200 });
    }

    // -- AMÉLIORATION LOGIQUE MÉTIER 1 : Formatage du numéro de téléphone (Maroc)
    // Transformer "06..." en "2126..." pour WhatsApp Cloud API
    let formattedPhone = customerPhone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "212" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("212") && formattedPhone.length === 9) {
      formattedPhone = "212" + formattedPhone;
    }

    // -- AMÉLIORATION LOGIQUE MÉTIER 2 : Idempotence (Éviter les doublons de webhooks)
    if (externalId) {
      const existingOrder = await prisma.order.findFirst({
        where: { externalId, storeId: store.id }
      });
      if (existingOrder) {
        console.log(`Order ${externalId} déjà traitée.`);
        return NextResponse.json({ success: true, message: "Order already processed" });
      }
    }

    // 3. Enregistrement en Base de Données
    // 3. Enregistrement en Base de Données
    // On cherche ou crée le client avec le numéro formaté
    const customer = await prisma.customer.upsert({
      where: { phone: formattedPhone },
      update: { name: customerName },
      create: { phone: formattedPhone, name: customerName }
    });

    // On crée la commande
    const order = await prisma.order.create({
      data: {
        externalId,
        totalAmount,
        status: "PENDING",
        storeId: store.id,
        customerId: customer.id,
      }
    });

    // 4. Déclenchement du Message WhatsApp vers le Worker local
    const template = store.user.templates[0];
    if (template) {
      // -- AMÉLIORATION LOGIQUE MÉTIER 3 : Parsing dynamique de template avancé
      const messageContent = template.body
        .replace(/{client_nom}/g, customerName)
        .replace(/{produit_nom}/g, "votre commande")
        .replace(/{montant}/g, `${totalAmount} DH`)
        .replace(/{boutique_nom}/g, store.name);

      await sendWhatsAppMessage(
        "local-worker",
        "no-token",
        formattedPhone,
        "n/a",
        "fr",
        messageContent
      );

      // Log de l'envoi
      await prisma.validationLog.create({
        data: {
          orderId: order.id,
          messageSent: messageContent,
        }
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
