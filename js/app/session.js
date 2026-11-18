/* Sesión de estudio: nivel elegido, cola de tarjetas y recuentos */
import { state } from "./state.js";
import { CARDS, DECKS, LEVELS, MODE } from "./data.js";
import { LEVEL_KEY, lsGet } from "./storage.js";
import { MIN } from "./srs.js";
import { dailyComplete } from "./daily.js";

export var FROM_KEY;
export function skipped(k) { return CARDS[k] && CARDS[k].grade + 1 < state.fromGroup; }
function deck(l) {
  if (l === 0) return state.daily.list;
  if (l < state.fromGroup) return DECKS[l - 1];                                  // grupo saltado: se ve entero, como repasado
  return state.fromGroup > 1 ? DECKS[l - 1].filter(function (k) { return !skipped(k); }) : DECKS[l - 1];
}
export function levelName(l) { return l === 0 ? "Hoy · " + dayLabel() : LEVELS[l - 1].name; }
function dayLabel() { return new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }); }
export var queue = [];          // kanji pendientes ahora mismo

function isDue(k, now) {
  var p = state.progress[k];
  return !p || typeof p.due !== "number" || p.due <= now;
}
export function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

export function levelCounts(l) {
  var now = Date.now(), due = 0, fresh = 0, waiting = 0;
  deck(l).forEach(function (k) {
    var p = state.progress[k];
    if (skipped(k)) waiting++;
    else if (!p || typeof p.due !== "number") fresh++;
    else if (p.due <= now) due++;
    else waiting++;
  });
  return { due: due, fresh: fresh, waiting: waiting, available: due + fresh, total: deck(l).length };
}

// Modo de la tarjeta: "srs" (niveles), "daily" (reto de hoy: ✕ / ✓) o "browse" (reto superado: «Siguiente»)
// "cram" = «Repasar todo igualmente»: ✕ / ✓ como en el reto (✓ no cambia nada; ✕ = Again, vuelve en 10 min)
export function mode() { return state.level !== 0 ? (state.cramMode ? "cram" : "srs") : dailyComplete() ? "browse" : "daily"; }

export function buildQueue() {
  if (state.level === 0 && state.daily.list.length) {
    if (mode() === "daily") queue = shuffle(state.daily.list.filter(function (k) { return state.daily.ticked.indexOf(k) < 0; }));
    else { queue = shuffle(state.daily.list.slice()); if (queue.length > 1 && queue[0] === state.current) queue.push(queue.shift()); }
    return;
  }
  var now = Date.now(), reviews = [], fresh = [];
  deck(state.level).forEach(function (k) {
    if (state.cramMode) { reviews.push(k); return; }
    if (skipped(k)) return;
    var p = state.progress[k];
    if (!p || typeof p.due !== "number") fresh.push(k);
    else if (p.due <= now) reviews.push(k);
  });
  queue = shuffle(reviews.concat(fresh));   // todo el grupo mezclado al azar: pendientes de repaso y nuevos juntos
}

// Añade al final de la cola las tarjetas que acaban de volver a estar disponibles (p. ej. "Again" tras 10 min)
export function refillQueue() {
  if (state.cramMode || state.level === 0) return;
  var now = Date.now(), inQ = {};
  queue.forEach(function (k) { inQ[k] = 1; });
  if (state.current) inQ[state.current] = 1;
  deck(state.level).forEach(function (k) {
    var p = state.progress[k];
    if (!inQ[k] && !skipped(k) && p && typeof p.due === "number" && p.due <= now) queue.push(k);
  });
}

export function nextDueIn() {
  var now = Date.now(), min = Infinity;
  deck(state.level).forEach(function (k) { var p = state.progress[k]; if (!skipped(k) && p && p.due > now && p.due < min) min = p.due; });
  return min === Infinity ? null : min - now;
}
export function humanTime(ms) {
  var m = Math.ceil(ms / MIN);
  if (m < 60) return m + " min";
  var h = Math.round(m / 60);
  if (h < 24) return h + " h";
  var d = Math.round(h / 24);
  return d + (d === 1 ? " día" : " días");
}

export function init() {
  // level 0 = «Kanji de hoy»; 1–7 = niveles acumulativos
  state.level = parseInt(lsGet(LEVEL_KEY), 10);
  if (!(state.level >= 0 && state.level <= LEVELS.length)) state.level = 0;
  /* «Mostrar kanji a partir de»: para estudiantes avanzados. Los kanji de los grupos anteriores cuentan como
     repasados (sin tocar su progreso ni marcarlos como dominados), no salen en los niveles siguientes ni en el
     reto diario. Al desactivarlo (volver a 1º) todo vuelve a la normalidad. */
  FROM_KEY = MODE === "jlpt" ? "kaname.fromGroup.jlpt.v1" : "kaname.fromGroup.v1";
  state.fromGroup = Math.max(1, Math.min(LEVELS.length, parseInt(lsGet(FROM_KEY), 10) || 1)); // 1 = desactivado
  state.current = null;
  state.flipped = false;
  state.cramMode = false;    // "Repasar todo de nuevo"
  state.busy = false;
}
