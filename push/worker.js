/* KanaMe — servidor de recordatorios diarios (Cloudflare Worker)
 *
 * Qué hace:
 *   - Guarda, para cada móvil que activa el recordatorio, su suscripción push y la hora elegida.
 *   - Cada 15 minutos (cron) envía un aviso a los que les toca a esa hora y aún no han
 *     completado el reto de hoy (KanaMe Kanji, KanaMe Kana y KanaMe Hangul comparten este servidor).
 *
 * Almacenamiento (KV, enlazado como SUBS):
 *   "s:HHMM:<id>"  -> valor vacío; metadata { sub, off, done }
 *        HHMM = franja UTC de 15 min en la que toca avisar; off = getTimezoneOffset() del móvil;
 *        done = fecha local (AAAA-MM-DD) del último día completado.
 *   "vapid"        -> claves VAPID (se generan solas la primera vez).
 *   Con la suscripción guardada en la metadata, cada ejecución del cron hace UNA sola lectura (list).
 *
 * Endpoints: GET /key · POST /subscribe · POST /unsubscribe · POST /done
 */

const ALLOWED_ORIGINS = ["https://lucass-05.github.io", "http://localhost:8000"];
const CONTACT = "https://github.com/lucass-05/KanaMe-Kanji"; // contacto que exige el estándar Web Push (VAPID)

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

    try {
      const path = new URL(req.url).pathname;
      if (req.method === "GET" && path === "/key") {
        const v = await getVapid(env);
        return json({ publicKey: v.publicKey });
      }
      if (req.method !== "POST") return json({ error: "not found" }, 404);
      if (tooMany(req.headers.get("CF-Connecting-IP") || "?")) return json({ error: "too many requests" }, 429);
      const body = await req.json().catch(() => null);
      if (!body || !validId(body.id)) return json({ error: "bad request" }, 400);

      if (path === "/subscribe") {
        const sub = body.sub;
        if (!validSlot(body.slot) || !validSub(sub)) return json({ error: "bad subscription" }, 400);
        const off = Math.max(-840, Math.min(840, Math.round(Number(body.off) || 0)));
        const done = /^\d{4}-\d{2}-\d{2}$/.test(body.done || "") ? body.done : "";
        const meta = { sub: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, off, done };
        if (body.app === "kana" || body.app === "hangul") meta.app = body.app; // KanaMe Kana y KanaMe Hangul usan el mismo servidor
        if (validSlot(body.prevSlot) && body.prevSlot !== body.slot) await env.SUBS.delete(key(body.prevSlot, body.id));
        // Si ya está guardada igual, no se vuelve a escribir (el plan gratuito limita las escrituras diarias)
        const k = key(body.slot, body.id);
        const prev = (await env.SUBS.getWithMetadata(k)).metadata;
        if (!prev || JSON.stringify(prev) !== JSON.stringify(meta)) await env.SUBS.put(k, "", { metadata: meta });
        return json({ ok: true });
      }
      if (path === "/unsubscribe") {
        if (validSlot(body.slot)) await env.SUBS.delete(key(body.slot, body.id));
        return json({ ok: true });
      }
      if (path === "/done") {
        if (!validSlot(body.slot) || !/^\d{4}-\d{2}-\d{2}$/.test(body.date || "")) return json({ error: "bad request" }, 400);
        const k = key(body.slot, body.id);
        const { metadata } = await env.SUBS.getWithMetadata(k);
        if (metadata && metadata.done !== body.date) await env.SUBS.put(k, "", { metadata: { ...metadata, done: body.date } });
        return json({ ok: true });
      }
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server error" }, 500);
    }
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(sendReminders(env, controller.scheduledTime));
  },
};

/* ---------------- Envío ---------------- */

async function sendReminders(env, when) {
  const d = new Date(when);
  const slot = pad(d.getUTCHours()) + pad(Math.floor(d.getUTCMinutes() / 15) * 15);
  const vapid = await getVapid(env);
  let cursor;
  do {
    const page = await env.SUBS.list({ prefix: "s:" + slot + ":", cursor });
    for (const k of page.keys) {
      const m = k.metadata;
      if (!m || !m.sub || !isPushService(m.sub.endpoint)) { await env.SUBS.delete(k.name); continue; }
      const localToday = localDate(when, m.off);
      if (m.done === localToday) continue; // ya ha hecho los kanji de hoy
      const status = await sendPush(m.sub, vapid);
      if (status === 404 || status === 410) {
        // El servicio de push dice que esa suscripción ya no existe: se borró la app (o se quitaron
        // los permisos de notificación en los ajustes del móvil). Se deja de avisar y se anota en GoatCounter.
        await env.SUBS.delete(k.name);
        const app = m.app === "kana" || m.app === "hangul" ? m.app : "";
        await track("evento/" + (app ? app + "-" : "") + "app-desinstalada-o-silenciada", (app === "kana" ? "KanaMe Kana · " : app === "hangul" ? "KanaMe Hangul · " : "") + "App desinstalada/silenciada · " + platform(m.sub.endpoint));
      }
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
}

// Push sin contenido: el service worker de la app compone el mensaje (racha, etc.) al recibirlo.
async function sendPush(sub, vapid) {
  const aud = new URL(sub.endpoint).origin;
  const jwt = await vapidJWT(aud, vapid);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: { "Authorization": "vapid t=" + jwt + ", k=" + vapid.publicKey, "TTL": "7200", "Urgency": "normal", "Content-Length": "0" },
  });
  return res.status;
}

/* ---------------- VAPID ---------------- */

async function getVapid(env) {
  const stored = await env.SUBS.get("vapid", "json");
  if (stored) return stored;
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const privateJwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey)); // 65 bytes, sin comprimir
  const v = { publicKey: b64url(raw), privateJwk };
  await env.SUBS.put("vapid", JSON.stringify(v));
  return v;
}

async function vapidJWT(aud, vapid) {
  const enc = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const unsigned = enc({ typ: "JWT", alg: "ES256" }) + "." + enc({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: CONTACT });
  const key = await crypto.subtle.importKey("jwk", vapid.privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(unsigned));
  return unsigned + "." + b64url(new Uint8Array(sig)); // WebCrypto ya devuelve r||s (formato JWS)
}

/* ---------------- Estadísticas (GoatCounter) ---------------- */

const GOATCOUNTER = "https://lucassuarezzz.goatcounter.com/count";

// Anota un evento anónimo, igual que los que manda la app (sin datos del usuario).
async function track(path, title) {
  try {
    const u = GOATCOUNTER + "?e=true&p=" + encodeURIComponent(path) + "&t=" + encodeURIComponent(title) + "&rnd=" + Math.random().toString(36).slice(2);
    await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (KanaMe recordatorios)", "Referer": "https://lucass-05.github.io/KanaMe-Kanji/" } });
  } catch (e) {}
}

// Tipo de dispositivo según el servicio de push (no identifica a nadie).
function platform(endpoint) {
  const h = new URL(endpoint).hostname;
  if (h.endsWith("push.apple.com")) return "Apple";
  if (h.endsWith("googleapis.com")) return "Android/Chrome";
  if (h.endsWith("mozilla.com")) return "Firefox";
  if (h.endsWith("windows.com")) return "Edge";
  return "otro";
}

/* ---------------- Protección ---------------- */

// Solo se aceptan suscripciones de los servicios de notificaciones reales de los navegadores.
// Así nadie puede usar este servidor para mandar peticiones a otras webs.
function isPushService(endpoint) {
  let u; try { u = new URL(endpoint); } catch (e) { return false; }
  if (u.protocol !== "https:" || u.port) return false;
  const h = u.hostname;
  return h === "fcm.googleapis.com"                                            // Chrome, Android, Edge (Chromium)
    || h === "web.push.apple.com" || h.endsWith(".push.apple.com")             // iPhone, iPad, Mac (Safari)
    || h === "updates.push.services.mozilla.com" || h.endsWith(".push.services.mozilla.com") // Firefox
    || h.endsWith(".notify.windows.com");                                      // Edge en Windows
}
// Claves de cifrado de la suscripción: base64url con el tamaño que fija el estándar
function validSub(sub) {
  return !!sub && typeof sub.endpoint === "string" && sub.endpoint.length <= 600 && isPushService(sub.endpoint)
    && !!sub.keys && /^[A-Za-z0-9_-]{80,100}$/.test(sub.keys.p256dh || "") && /^[A-Za-z0-9_-]{16,32}$/.test(sub.keys.auth || "");
}
// Límite de peticiones por IP: 20 cada 10 minutos. Se cuenta en memoria (no gasta escrituras de KV);
// no es perfecto, pero frena a quien intente llenar el almacén o agotar el límite diario.
const RATE = { max: 20, windowMs: 10 * 60 * 1000 };
const hits = new Map();
function tooMany(ip) {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.t > RATE.windowMs) hits.delete(k);
  const h = hits.get(ip);
  if (!h || now - h.t > RATE.windowMs) { hits.set(ip, { t: now, n: 1 }); return false; }
  return ++h.n > RATE.max;
}

/* ---------------- Utilidades ---------------- */

function key(slot, id) { return "s:" + slot + ":" + id; }
function validId(id) { return typeof id === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(id); }
function validSlot(s) { return typeof s === "string" && /^([01]\d|2[0-3])(00|15|30|45)$/.test(s); }
function pad(n) { return (n < 10 ? "0" : "") + n; }
function localDate(ts, off) {
  const d = new Date(ts - (Number(off) || 0) * 60000);
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
}
function b64url(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
