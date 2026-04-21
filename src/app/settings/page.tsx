import { PrismaClient } from "@prisma/client";
import SettingsClient from "@/components/SettingsClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await prisma.user.findFirst();

  return <SettingsClient initialSettings={user || undefined} />;
}
