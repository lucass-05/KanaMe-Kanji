/* KanaMe service worker — permite usar la app sin conexión.
   Estrategia "red primero": si hay internet siempre carga la última versión;
   si no, usa la copia guardada. Sube VERSION al publicar cambios grandes. */
const VERSION = "kaname-v25";
const CORE = ["./", "index.html", "data/kanji.js", "site.webmanifest", "icons/icon-192.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});

/* ---------- Recordatorio diario (Web Push) ----------
   El servidor envía un aviso sin contenido; aquí se compone el mensaje con la racha guardada en el móvil. */
function readKV(key) {
  return new Promise((res) => {
    try {
      const rq = indexedDB.open("kaname", 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore("kv");
      rq.onerror = () => res(null);
      rq.onsuccess = () => {
        try {
          const g = rq.result.transaction("kv", "readonly").objectStore("kv").get(key);
          g.onsuccess = () => res(g.result || null);
          g.onerror = () => res(null);
        } catch (e) { res(null); }
      };
    } catch (e) { res(null); }
  });
}
function pad(n) { return (n < 10 ? "0" : "") + n; }
function dayStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

self.addEventListener("push", (e) => {
  e.waitUntil(readKV("kaname.streak.v1").then((raw) => {
    let s = {}; try { s = JSON.parse(raw) || {}; } catch (err) {}
    const today = new Date(), y = new Date(); y.setDate(y.getDate() - 1);
    let title = "今日 · Tus kanji de hoy te esperan";
    let body = "Tus kanji nuevos y unos minutos de repaso. ¡Vamos!";
    if (s.last === dayStr(today)) { title = "今日 · ¡Hoy ya has cumplido!"; body = "Si te apetece, repasa un poco más."; }
    else if (s.last === dayStr(y) && s.cur > 0) { title = "🔥 Racha de " + s.cur + (s.cur === 1 ? " día" : " días"); body = "Completa los kanji de hoy para no perderla."; }
    return self.registration.showNotification(title, {
      body, tag: "kaname-daily", renotify: true,
      icon: "icons/icon-192.png", badge: "icons/favicon-32x32.png", data: { url: "./" },
    });
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) if ("focus" in c) return c.focus();
    return self.clients.openWindow("./");
  }));
});
