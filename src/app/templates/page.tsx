import { PrismaClient } from "@prisma/client";
import TemplatesClient from "@/components/TemplatesClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const template = await prisma.whatsAppTemplate.findFirst();

  const mappedTemplate = template ? {
    ...template,
    button1: template.button1 || undefined,
    button2: template.button2 || undefined,
  } : null;

  return <TemplatesClient initialTemplate={mappedTemplate} />;
}
