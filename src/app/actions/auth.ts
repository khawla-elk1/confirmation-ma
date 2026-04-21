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
    // 1. Vérifier si c'est le compte Administrateur (Master Admin)
    const adminEmail = process.env.ADMIN_EMAIL || "khawla@freelance.ma";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    const isAdmin = (email === adminEmail && password === adminPassword);

    if (isAdmin) {
      const cookieStore = await cookies();
      cookieStore.set("auth_session", "master_admin_id", { 
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 7 // 1 semaine,
      });
      redirect("/"); // Redirection vers le dashboard
    }

    // 2. Sinon, essayer de vérifier dans la base de données (Prisma)
    try {
      const user = await prisma.user.findFirst({
         where: { email: email.trim().toLowerCase() }
      });

      if (user) {
        const cookieStore = await cookies();
        cookieStore.set("auth_session", user.id, { 
           httpOnly: true,
           maxAge: 60 * 60 * 24 * 7 // 1 semaine,
        });
        redirect("/"); // Redirection vers le dashboard
      }
    } catch (e) {
       console.error("Erreur de base de données (probablement SQLite sur Vercel):", e);
    }

    // Si on arrive ici, rien n'a fonctionné
    return { error: "Identifiants incorrects ou base de données inaccessible. Accès privé uniquement." };
    }
  }
  
  return { error: "Veuillez remplir tous les champs." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/login");
}
