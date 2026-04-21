import { PrismaClient } from "@prisma/client";
// Refreshing for schema changes
import PremiumDashboardClient from "@/components/PremiumDashboardClient";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function PremiumDashboard() {
  // 1. Fetch Orders with relationships from Prisma
  const rawOrders = await prisma.order.findMany({
    include: {
      customer: true,
      store: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8
  });

  // 2. Count metrics
  const totalOrders = await prisma.order.count();
  const confirmedOrders = await prisma.order.count({ where: { status: "CONFIRMED" } });
  const totalTemplates = await prisma.whatsAppTemplate.count();
  
  // Aggrégation financière : Le Rapport de Richesse Sauvée
  const canceledOrders = await prisma.order.findMany({ where: { status: "CANCELLED" }});
  const CANCELED_COUNT = canceledOrders.length;
  // Par défaut au Maroc, un retour NPAI coûte entre 40 et 50 DH avec la société de livraison.
  const AVERAGE_SHIPPING_FEE = 45; 
  const savedDeliveryLosses = CANCELED_COUNT * AVERAGE_SHIPPING_FEE;

  const confirmationRate = totalOrders > 0 ? Math.round((confirmedOrders / totalOrders) * 100) : 0;

  // Format orders for the client UI
  const formatRecentOrders = rawOrders.map((o) => ({
    id: o.id,
    name: o.customer.name || "Client Anonyme",
    price: o.totalAmount.toLocaleString('fr-MA'),
    status: o.status,
    source: o.store.platform, // e.g. Shopify, YouCan
  }));

  // Hardcode or mock chart data dynamically for layout sake, or map if we had date ranges 
  const chartData = [
    { name: 'Lun', Confirmées: 40, Annulées: 10 },
    { name: 'Mar', Confirmées: 45, Annulées: 5 },
    { name: 'Mer', Confirmées: 42, Annulées: 15 },
    { name: 'Jeu', Confirmées: Math.round(confirmedOrders * 0.3) + 20, Annulées: 8 },
    { name: 'Ven', Confirmées: 60, Annulées: 12 },
    { name: 'Sam', Confirmées: 110, Annulées: 20 },
    { name: 'Dim', Confirmées: confirmedOrders, Annulées: canceledOrders.length },
  ];

  const dashboardData = {
    stats: {
      totalOrders,
      confirmationRate,
      savedReturns: savedDeliveryLosses.toLocaleString('fr-MA'),
      canceledCount: CANCELED_COUNT,
      totalTemplates
    },
    recentOrders: formatRecentOrders,
    chartData
  };

  return <PremiumDashboardClient data={dashboardData} />;
}

