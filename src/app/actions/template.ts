"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function saveTemplate(formData: FormData) {
  const name = formData.get("name") as string || "Message de Confirmation Initiale";
  const trigger = formData.get("trigger") as string;
  const body = formData.get("body") as string;
  const button1 = formData.get("button1") as string;
  const button2 = formData.get("button2") as string;
  
  const user = await prisma.user.findFirst();
  if (!user) return { error: "Utilisateur principal introuvable" };

  try {
    // Dans ce MVP, on écrase l'ancien template pour n'en garder qu'un seul principal
    await prisma.whatsAppTemplate.deleteMany({ where: { userId: user.id } });

    await prisma.whatsAppTemplate.create({
      data: {
        name,
        trigger,
        body,
        button1,
        button2,
        userId: user.id,
      }
    });
    
    revalidatePath("/templates");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Erreur lors de la sauvegarde du Scénario" };
  }
}
