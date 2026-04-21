import { PrismaClient } from "@prisma/client";
import LogsClient from "@/components/LogsClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const logs = await prisma.validationLog.findMany({
    include: {
      order: {
        include: {
          customer: true,
          store: true
        }
      }
    },
    orderBy: {
      sentAt: 'desc'
    }
  });

  return <LogsClient logs={logs} />;
}
