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

    if (user || (email === "khawla@freelance.ma" && password === "admin")) {
      const cookieStore = await cookies();
      cookieStore.set("auth_session", user?.id || "demo_admin_id", { 
         httpOnly: true,
         maxAge: 60 * 60 * 24 * 7 // 1 semaine
      });
      redirect("/"); // Redirection vers le dashboard
    } else {
      return { error: "Identifiants incorrects. Indice: khawla@freelance.ma / admin" };
    }
  }
  
  return { error: "Veuillez remplir tous les champs." };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/login");
}
