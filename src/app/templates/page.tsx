import { PrismaClient } from "@prisma/client";
import TemplatesClient from "@/components/TemplatesClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const template = await prisma.whatsAppTemplate.findFirst();

  return <TemplatesClient initialTemplate={template} />;
}
