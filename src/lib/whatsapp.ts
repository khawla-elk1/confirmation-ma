/**
 * Library to interact with the local WhatsApp Web (whatsapp-web.js) passage
 */
export async function sendWhatsAppMessage(
  phoneId: string, // Not used but kept for interface compat
  token: string,   // Not used but kept for interface compat
  to: string,
  templateName: string,
  languageCode: string = "fr",
  bodyText: string
) {
  const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:3001";
  const url = `${workerUrl}/api/send`;

  const payload = {
    to: to.replace('+', ''),
    message: bodyText,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { success: response.ok && data.success, data };
  } catch (error) {
    console.error("Local WhatsApp API Error:", error);
    return { success: false, error };
  }
}
