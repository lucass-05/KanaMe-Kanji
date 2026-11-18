/* Almacenamiento: localStorage + IndexedDB (si uno se pierde, se recupera del otro) */
import { state } from "./state.js";
import { MODE } from "./data.js";
import { parseDaily } from "./daily.js";
/* El progreso se escribe en localStorage Y en IndexedDB.
   Si uno de los dos se pierde, se recupera del otro al abrir. */
var KEY = "kaname.progress.v1";
export var LEVEL_KEY;
export var LEGACY_KEY = "kyoikuSR_progress_v1"; // versiones anteriores de la app
export var DAILY_KEY;
export var STREAK_KEY = "kaname.streak.v1";     // { cur, best, last: "AAAA-MM-DD" }
export var PALETTE_KEY = "kaname.palette.v1";
export var SIZE_KEY = "kaname.dailySize.v1";     // kanji del reto diario: 5, 10 o 20 (lo elige el usuario)
export var SIZES = [5, 10, 20];
var idb = null;
function openIDB() {
  return new Promise(function (res) {
    try {
      var rq = indexedDB.open("kaname", 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore("kv"); };
      rq.onsuccess = function () { idb = rq.result; res(idb); };
      rq.onerror = function () { res(null); };
    } catch (e) { res(null); }
  });
}
function idbGet(key) {
  return new Promise(function (res) {
    if (!idb) return res(null);
    try {
      var rq = idb.transaction("kv", "readonly").objectStore("kv").get(key);
      rq.onsuccess = function () { res(rq.result || null); };
      rq.onerror = function () { res(null); };
    } catch (e) { res(null); }
  });
}
export function idbSet(key, val) {
  if (!idb) return;
  try { idb.transaction("kv", "readwrite").objectStore("kv").put(val, key); } catch (e) {}
}

export function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
export function lsSet(key, val) { try { localStorage.setItem(key, val); return true; } catch (e) { return false; } }

function countKeys(o) { return o ? Object.keys(o).length : 0; }
export function parse(s) { try { var o = JSON.parse(s); return (o && typeof o === "object") ? o : null; } catch (e) { return null; } }

export function save() {
  var s = JSON.stringify(state.progress);
  lsSet(KEY, s);
  idbSet(KEY, s);
}

export function loadProgress() {
  return openIDB().then(function () {
    return Promise.all([idbGet(KEY), idbGet(DAILY_KEY), idbGet(STREAK_KEY)]);
  }).then(function (r) {
    var a = parse(lsGet(KEY)), b = parse(r[0]), legacy = parse(lsGet(LEGACY_KEY));
    // Quedarse con la copia más completa
    var best = [a, b, legacy].reduce(function (m, x) { return countKeys(x) > countKeys(m) ? x : m; }, null);
    state.progress = best || {};
    if (countKeys(state.progress)) save();
    // Kanji del día: la copia con la fecha más reciente
    var d1 = parseDaily(lsGet(DAILY_KEY)), d2 = parseDaily(r[1]);
    state.daily = (d2.date > d1.date || (d2.date === d1.date && d2.ticked.length > d1.ticked.length)) ? d2 : d1;
    // Racha: la copia con el último día más reciente (y la mejor marca de las dos)
    var s1 = parse(lsGet(STREAK_KEY)) || {}, s2 = parse(r[2]) || {};
    var sb = ((s2.last || "") > (s1.last || "")) ? s2 : s1;
    state.streak = { cur: sb.cur || 0, best: Math.max(s1.best || 0, s2.best || 0, sb.cur || 0), last: sb.last || "" };
  });
}

export function init() {
  LEVEL_KEY = MODE === "jlpt" ? "kaname.level.jlpt.v1" : "kaname.level.v1";
  DAILY_KEY = MODE === "jlpt" ? "kaname.daily.jlpt.v1" : "kaname.daily.v1";  // "AAAA-MM-DD\n" + las tarjetas del día + "\n" + las ya marcadas con ✓ hoy (en JLPT separadas por «|»)
  state.DAILY_SIZE = SIZES.indexOf(+lsGet(SIZE_KEY)) >= 0 ? +lsGet(SIZE_KEY) : 10;
  state.progress = {};       // kanji -> { due, reps, last, seen }
  state.daily = { date: "", list: [], ticked: [] };
  state.streak = { cur: 0, best: 0, last: "" };
}
