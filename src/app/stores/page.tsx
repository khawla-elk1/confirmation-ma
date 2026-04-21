import { PrismaClient } from "@prisma/client";
// Force rebuild after schema change
import StoresClientReal from "@/components/StoresClient";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  const formattedStores = stores.map(s => ({
    id: s.id,
    name: s.name,
    platform: s.platform,
    status: 'Ready',
    orders: s._count.orders.toString(),
    syncTime: 'En direct',
    color: s.platform === 'Shopify' ? 'emerald' : (s.platform === 'YouCan' ? 'blue' : 'rose')
  }));

  return <StoresClientReal stores={formattedStores} />;
}
