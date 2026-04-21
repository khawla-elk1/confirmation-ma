"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { setupShopifyWebhook } from "@/lib/shopify";

const prisma = new PrismaClient();

export async function addStore(formData: FormData) {
  const name = formData.get("name") as string;
  const platform = formData.get("platform") as string;
  const domain = formData.get("domain") as string;
  const accessToken = formData.get("accessToken") as string;

  const user = await prisma.user.findFirst();
  if (!user) return { error: "Utilisateur non trouvé" };

  try {
    const store = await prisma.store.create({
      data: {
        name,
        platform,
        domain,
        accessToken,
        userId: user.id
      }
    });

    // AUTO-CONNECT: Si Shopify et token disponible, installe le webhook automatiquement
    if (platform === "Shopify" && domain && accessToken) {
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/shopify?storeId=${store.id}`;
      const result = await setupShopifyWebhook(domain, accessToken, webhookUrl);
      console.log("Auto-webhook result:", result);
    }
    
    revalidatePath("/stores");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la création." };
  }
}

export async function deleteStore(id: string) {
  try {
    await prisma.store.delete({
      where: { id }
    });
    revalidatePath("/stores");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la suppression." };
  }
}
