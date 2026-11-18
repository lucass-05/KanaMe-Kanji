/* Racha, medallas y paletas */
import { state } from "./state.js";
import { $, el, renderStreak } from "./ui.js";
import { PALETTE_KEY, STREAK_KEY, idbSet, lsGet, lsSet } from "./storage.js";
import { dailyDone, dayStr, yesterdayStr } from "./daily.js";
import { reminderDone } from "./reminder.js";
import { toast } from "./settings.js";

export var PALETTES;
export function saveStreak() { var s = JSON.stringify(state.streak); lsSet(STREAK_KEY, s); idbSet(STREAK_KEY, s); }
export function currentStreak() { return (state.streak.last === dayStr() || state.streak.last === yesterdayStr()) ? state.streak.cur : 0; }
export function unlocked(p) { return state.streak.best >= p.days; }
export function checkDayComplete() {
  var today = dayStr();
  if (state.streak.last === today) return;
  if (state.daily.list.length && dailyDone() < state.daily.list.length) return; // el reto diario aún no tiene todos los ✓
  var before = state.streak.best;
  state.streak.cur = (state.streak.last === yesterdayStr()) ? state.streak.cur + 1 : 1;
  state.streak.best = Math.max(state.streak.best, state.streak.cur);
  state.streak.last = today;
  saveStreak();
  track("dia-completado");
  reminderDone();
  var nuevas = PALETTES.filter(function (p) { return p.days > before && p.days <= state.streak.best; });
  if (nuevas.length) {
    var p = nuevas[nuevas.length - 1];
    setPalette(p.id);
    showMedal(p, p.id === "shiro" ? showStreakIntro : null);
  } else {
    if (window.kanameBurst) window.kanameBurst(true);
    toast("🔥 ¡Día completado! Racha: " + state.streak.cur + (state.streak.cur === 1 ? " día" : " días"));
  }
  renderStreak();
}
// Animación de la medalla nueva: cae girando, brilla y suelta la lluvia de su paleta
function showMedal(p, after) {
  var box = $("medalReveal");
  if (!box) {
    box = el("div", "medal-reveal"); box.id = "medalReveal"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
    document.body.appendChild(box);
  }
  box.innerHTML = "";
  var stage = el("div", "medal-stage"); stage.appendChild(el("div", "medal-rays"));
  var big = el("div", "medal-big"), url = window.KANAME_MEDAL(p.id);
  big.style.backgroundImage = url; big.style.setProperty("--m", url);
  stage.appendChild(big); box.appendChild(stage);
  box.appendChild(el("div", "kicker", p.days === 1 ? "Primer día de racha" : p.days + " días seguidos"));
  var h = el("h2"); h.appendChild(el("span", null, p.jp)); h.appendChild(document.createTextNode("Medalla " + p.name)); box.appendChild(h);
  box.appendChild(el("p", null, "Has desbloqueado la paleta " + p.name + ". Ya la llevas puesta; puedes cambiarla cuando quieras en tu medallero (toca 🔥)."));
  var btn = el("button", "pill-btn", "¡Genial!"); box.appendChild(btn);
  btn.onclick = function () { box.classList.remove("open"); if (after) after(); };
  box.classList.add("open");
  track("medalla-" + p.id);
  setTimeout(function () { if (window.kanameBurst) window.kanameBurst(true, big); }, 1150);
}
export function setPalette(id) { lsSet(PALETTE_KEY, id); if (window.applyKanamePalette) window.applyKanamePalette(id); }
// Ventana que explica cómo funcionan las rachas, al desbloquear la primera paleta (Shiro).
// Se muestra una sola vez; también a quien ya tenía racha antes de que existiera esta paleta.
export var INTRO_KEY = "kaname.streakIntro.v1";
function showStreakIntro() {
  var p = PALETTES.filter(function (x) { return x.id === "shiro"; })[0];
  if (!p) return;
  lsSet(INTRO_KEY, "1");
  var sw = $("introSwatch"); sw.style.background = p.accent; sw.style.boxShadow = "inset 0 0 0 7px " + p.bg + ", 0 0 0 1px " + p.hairline;
  $("introPalName").textContent = "Nueva paleta: " + p.name + " " + p.jp;
  $("remSheet").classList.remove("open");
  $("introSheet").classList.add("open");
}
export function maybeShowStreakIntro() {
  var p = PALETTES.filter(function (x) { return x.id === "shiro"; })[0];
  if (p && unlocked(p) && !lsGet(INTRO_KEY)) { showStreakIntro(); return true; }
  return false;
}
export function closeIntro() { $("introSheet").classList.remove("open"); }
export function track(name) {
  try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "evento/" + name, title: name, event: true }); } catch (e) {}
}

export function requestPersistence() {
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
}

export function init() {
  PALETTES = window.KANAME_PALETTES || [];
}
