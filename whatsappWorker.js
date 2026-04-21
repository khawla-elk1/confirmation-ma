const {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const express = require("express");
const cors = require("cors");
const qrcode = require("qrcode");
const pino = require("pino");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ── State ─────────────────────────────────────────────────────────────────────
let sock = null;
let isReady = false;
let currentQRDataURL = null;
const AUTH_FOLDER = path.join(__dirname, ".baileys_auth");

// ── Logger silencieux ─────────────────────────────────────────────────────────
const logger = pino({ level: "silent" });

// ── Connexion WhatsApp ────────────────────────────────────────────────────────
async function connectToWhatsApp() {
  if (!fs.existsSync(AUTH_FOLDER)) {
    fs.mkdirSync(AUTH_FOLDER, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();
  console.log(`📦 Baileys version WA: ${version.join(".")}`);

  sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: true, // Afficher aussi dans le terminal pour debug
    browser: ["Confirmation.ma", "Chrome", "1.0.0"],
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
  });

  // ── QR + Connexion ──────────────────────────────────────────────────────────
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 QR Code prêt — Scannez depuis le Dashboard ou le terminal !");
      currentQRDataURL = await qrcode.toDataURL(qr);
      isReady = false;
    }

    if (connection === "open") {
      console.log("🚀 Client WhatsApp Web Prêt et Connecté !");
      isReady = true;
      currentQRDataURL = null;
    }

    if (connection === "close") {
      isReady = false;
      currentQRDataURL = null;

      const statusCode = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output?.statusCode
        : 0;

      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️  Connexion fermée (code: ${statusCode}). Reconnexion: ${shouldReconnect}`);

      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 5000);
      } else {
        console.log("🔴 Déconnecté (logout). Nettoyage de la session et regénération du QR...");
        try {
          fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
        } catch (e) {}
        setTimeout(connectToWhatsApp, 2000);
      }
    }
  });

  // ── Sauvegarde des credentials ────────────────────────────────────────────
  sock.ev.on("creds.update", saveCreds);

  // ── Messages entrants ──────────────────────────────────────────────────────
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;

      const senderJid = msg.key.remoteJid;
      if (!senderJid || senderJid === "status@broadcast") continue;

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        "";

      if (!text) continue;

      const senderPhone = senderJid.replace("@s.whatsapp.net", "");
      console.log(`📩 Message reçu de ${senderPhone}: "${text}"`);

      // Transférer vers Next.js pour l'auto-validation
      try {
        const nextUrl = process.env.NEXTJS_URL || "http://localhost:3000";
        const res = await fetch(`${nextUrl}/api/webhooks/whatsapp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            object: "whatsapp_business_account",
            entry: [{
              changes: [{
                value: {
                  messages: [{ from: senderPhone, text: { body: text } }],
                },
              }],
            }],
          }),
        });
        const data = await res.json();
        console.log("✅ Webhook réponse:", JSON.stringify(data));
      } catch (err) {
        console.error("❌ Erreur envoi webhook:", err.message);
      }
    }
  });
}

// ── API Endpoints ─────────────────────────────────────────────────────────────

app.get("/api/qr", (req, res) => {
  if (isReady) return res.json({ connected: true });
  if (currentQRDataURL) return res.json({ connected: false, qr: currentQRDataURL });
  return res.json({ connected: false, status: "Connexion en cours... (QR bientôt disponible)" });
});

app.post("/api/send", async (req, res) => {
  if (!isReady || !sock) {
    return res.status(503).json({ error: "WhatsApp non connecté", success: false });
  }
  const { to, message } = req.body;
  const jid = `${to}@s.whatsapp.net`;
  try {
    await sock.sendMessage(jid, { text: message });
    console.log(`✅ Message envoyé vers ${to}`);
    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur d'envoi:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ── Démarrage ─────────────────────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n📡 Passerelle WhatsApp (Baileys — Sans Chrome) sur http://localhost:${PORT}`);
  console.log("⏳ Démarrage de la connexion WhatsApp...\n");
  connectToWhatsApp();
});
