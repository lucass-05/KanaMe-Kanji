/* Recordatorio diario (Web Push) */
import { state } from "./state.js";
import { $ } from "./ui.js";
import { dayStr, pad } from "./daily.js";
import { lsGet, lsSet, parse } from "./storage.js";
import { toast } from "./settings.js";
import { tour } from "./tour.js";
import { track } from "./streak.js";
/* La app se suscribe a notificaciones push y le dice al servidor (push/worker.js) a qué hora avisar.
   El servidor guarda la hora en UTC en franjas de 15 min y no avisa si ese día ya has completado los kanji. */
var PUSH_URL = "https://kaname-push.lucassuarez1605.workers.dev";   // URL del Worker de Cloudflare, p. ej. "https://kaname-push.tu-usuario.workers.dev"
var REM_KEY = "kaname.reminder.v1";   // { state: "on" | "off", time: "HH:MM", id, slot }
var rem;
var isIOS;
var standalone;
function pushSupported() { return !!PUSH_URL && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; }
function saveRem() { lsSet(REM_KEY, JSON.stringify(rem)); }
function remTime() { return rem.time || "20:00"; }
function utcSlot(time) {
  var hm = time.split(":"), d = new Date(); d.setHours(+hm[0], +hm[1], 0, 0);
  return pad(d.getUTCHours()) + pad(d.getUTCMinutes());
}
function newId() {
  try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
  return "k" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}
function b64ToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  var bin = atob(s), out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function api(path, body) {
  return fetch(PUSH_URL + path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {})
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
}
function fillTimes(sel) {
  if (sel.options.length) { sel.value = remTime(); return; }
  for (var h = 0; h < 24; h++) for (var m = 0; m < 60; m += 15) {
    var v = pad(h) + ":" + pad(m), o = document.createElement("option"); o.value = v; o.textContent = v; sel.appendChild(o);
  }
  sel.value = remTime();
}

// Activa (o actualiza) el recordatorio. Si ask = true, pide el permiso: debe llamarse desde un toque del usuario.
function enableReminder(time, ask) {
  var perm = ask && Notification.permission === "default" ? Notification.requestPermission() : Promise.resolve(Notification.permission);
  return Promise.resolve(perm).then(function (p) {
    if (p !== "granted") throw new Error("permiso");
    return navigator.serviceWorker.ready;
  }).then(function (reg) {
    return reg.pushManager.getSubscription().then(function (sub) {
      if (sub) return sub;
      return api("/key").then(function (k) { return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(k.publicKey) }); });
    });
  }).then(function (sub) {
    var slot = utcSlot(time), id = rem.id || newId();
    return api("/subscribe", { id: id, sub: sub.toJSON(), slot: slot, prevSlot: rem.slot || "", off: new Date().getTimezoneOffset(), done: state.streak.last === dayStr() ? dayStr() : "" })
      .then(function () { rem = { state: "on", time: time, id: id, slot: slot }; saveRem(); track("recordatorio-activado"); });
  });
}
function disableReminder() {
  var old = rem; rem = { state: "off", time: remTime() }; saveRem();
  if (old.id && old.slot) api("/unsubscribe", { id: old.id, slot: old.slot }).catch(function () {});
  if ("serviceWorker" in navigator) navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (s) { if (s) s.unsubscribe(); }).catch(function () {});
}
function reminderError(e) {
  var msg = e && e.message === "permiso"
    ? "Has bloqueado las notificaciones. Actívalas en los ajustes del navegador o del móvil."
    : "No se pudo activar el recordatorio. Inténtalo con conexión.";
  rem.state = "off"; saveRem(); renderReminder(); toast(msg);
}
// Al abrir la app: si estaba activado, comprueba que sigue válido (permiso, suscripción, cambio de horario de verano)
export function syncReminder() {
  if (!pushSupported() || rem.state !== "on") return;
  if (Notification.permission !== "granted") { rem.state = "off"; saveRem(); return; }
  navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (sub) {
    if (!sub || utcSlot(remTime()) !== rem.slot) return enableReminder(remTime(), false);
  }).catch(function () {});
}
export function reminderDone() {
  if (rem.state === "on" && rem.id && PUSH_URL) api("/done", { id: rem.id, slot: rem.slot, date: dayStr() }).catch(function () {});
}
export function renderReminder() {
  var sec = $("remSection");
  var iosTab = isIOS && !standalone;
  sec.hidden = !PUSH_URL || !(pushSupported() || iosTab);
  if (sec.hidden) return;
  var on = rem.state === "on";
  $("remToggle").checked = on; $("remToggle").disabled = iosTab;
  fillTimes($("remTime")); $("remTimeRow").style.display = on ? "" : "none";
  $("remStatus").textContent = iosTab ? "En iPhone, primero añade KanaMe a la pantalla de inicio."
    : on ? "Te avisaremos a las " + remTime() + " si aún no has hecho los kanji del día."
    : Notification.permission === "denied" ? "Notificaciones bloqueadas en los ajustes del móvil." : "Desactivado";
}
export function maybeAskReminder() {
  if (!pushSupported() || rem.state || Notification.permission === "denied") return;
  setTimeout(function () {
    if (tour || $("sheet").classList.contains("open") || $("introSheet").classList.contains("open") || $("sizeSheet").classList.contains("open") || $("installSheet").classList.contains("open")) return;
    fillTimes($("remTimeFirst"));
    $("remSheet").classList.add("open");
  }, 1200);
}

export function init() {
  rem = parse(lsGet(REM_KEY)) || {};
  isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  $("remYes").onclick = function () {
    var t = $("remTimeFirst").value, btn = this;
    btn.disabled = true;
    enableReminder(t, true).then(function () { $("remSheet").classList.remove("open"); toast("🔔 Recordatorio activado a las " + t); })
      .catch(function (e) { $("remSheet").classList.remove("open"); reminderError(e); })
      .then(function () { btn.disabled = false; });
  };
  $("remNo").onclick = function () { rem = { state: "off", time: remTime() }; saveRem(); $("remSheet").classList.remove("open"); };
  $("remToggle").onchange = function () {
    if (this.checked) {
      enableReminder($("remTime").value || remTime(), true).then(function () { renderReminder(); toast("🔔 Recordatorio activado a las " + remTime()); }).catch(reminderError);
    } else { disableReminder(); renderReminder(); }
  };
  $("remTime").onchange = function () {
    var t = this.value;
    enableReminder(t, false).then(function () { renderReminder(); toast("Te avisaremos a las " + t); }).catch(reminderError);
  };
}
