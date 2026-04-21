"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateSettings(formData: FormData) {
  const whatsappToken = formData.get("whatsappToken") as string;
  const whatsappPhoneId = formData.get("whatsappPhoneId") as string;

  const user = await prisma.user.findFirst();
  if (!user) return { error: "Utilisateur non trouvé" };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        whatsappToken,
        whatsappPhoneId,
      }
    });

    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { error: "Erreur lors de la mise à jour des paramètres" };
  }
}
