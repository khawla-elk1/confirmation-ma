import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Confirmation.ma | Plateforme de Validation Premium",
  description: "Solution simple et efficace pour la validation des commandes e-commerce au Maroc.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;

  return (
    <html lang="fr" className="antialiased" suppressHydrationWarning>
      <body className={inter.className}>
        {session ? (
          <AppLayout>{children}</AppLayout>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
