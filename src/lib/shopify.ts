/**
 * Helper to interact with the Shopify Admin API
 */
export async function setupShopifyWebhook(domain: string, accessToken: string, webhookUrl: string) {
  const shopifyDomain = domain.includes("myshopify.com") ? domain : `${domain}.myshopify.com`;
  const url = `https://${shopifyDomain}/admin/api/2024-01/webhooks.json`;

  const payload = {
    webhook: {
      topic: "orders/create",
      address: webhookUrl,
      format: "json",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Shopify Webhook Setup Error:", error);
    return { success: false, error };
  }
}
