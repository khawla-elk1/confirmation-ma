"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string; // Dans un vrai monde, ceci est hashé.
  
  // Simulation d'authentification basée sur notre Seeder
  if (email && password) {
    // Vérifier en base
    const user = await prisma.user.findFirst({
       where: { email: email.trim().toLowerCase() }
    });

    // Récupérer les identifiants administrateur super-sécurisés depuis Vercel
    const adminEmail = process.env.ADMIN_EMAIL || "khawla@freelance.ma";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    const isAdmin = (email === adminEmail && password === adminPassword);

    if (user || isAdmin) {
      const cookieStore = await cookies();
      cookieStore.set("auth_session", user?.id || "demo_admin_id", { 
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 7 // 1 semaine,
      });
      redirect("/"); // Redirection vers le dashboard
    } else {
      return { error: "Identifiants incorrects. Accès privé uniquement." };
    }
  }
  
  return { error: "Veuillez remplir tous les champs." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/login");
}
