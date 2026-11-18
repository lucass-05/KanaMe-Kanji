/* Kanji de hoy: el reto diario */
import { state } from "./state.js";
import { CARDS, DECKS, GRADE_TAG, GROUPS, MODE } from "./data.js";
import { DAILY_KEY, idbSet, lsSet, save } from "./storage.js";
import { applyRating } from "./srs.js";
import { checkDayComplete } from "./streak.js";
import { shuffle, skipped } from "./session.js";
/* Una vez al día (la primera vez que se abre la app) se genera una lista de DAILY_SIZE kanji nuevos (5, 10 o 20),
   elegidos al azar del nivel más sencillo que aún tenga kanji disponibles (sin estudiar, o cuyo tiempo de espera
   ya se ha cumplido, igual que en los niveles de abajo). Se guarda como texto
   que empieza por la fecha; mientras la fecha sea la de hoy, no se vuelve a calcular. */
export function pad(n) { return (n < 10 ? "0" : "") + n; }
export function dayStr(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
export function yesterdayStr() { var d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }
function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }

export function parseDaily(text) {
  if (typeof text !== "string") return { date: "", list: [], ticked: [] };
  var lines = text.split("\n");
  var date = (lines[0] || "").trim();
  var list = splitList(lines[1]).filter(function (k) { return CARDS[k]; });
  var ticked = splitList(lines[2]).filter(function (k) { return list.indexOf(k) >= 0; });
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? { date: date, list: list, ticked: ticked, v: +(lines[3] || 1) } : { date: "", list: [], ticked: [] };
}
// En JLPT hay palabras de varios caracteres: la lista se guarda separada por «|»
function splitList(t) { t = (t || "").trim(); return MODE === "jlpt" ? t.split("|").filter(Boolean) : Array.from(t); }
function joinList(a) { return a.join(MODE === "jlpt" ? "|" : ""); }
export function saveDaily() {
  var text = state.daily.date + "\n" + joinList(state.daily.list) + "\n" + joinList(state.daily.ticked) + "\n" + DAILY_V;
  lsSet(DAILY_KEY, text); idbSet(DAILY_KEY, text);
}
// Kanji disponibles (nuevos o con el tiempo de espera ya cumplido) del primer nivel que tenga alguno,
// al azar dentro del nivel; si no llegan, se completa con el siguiente. Sin repetir los de «excluir».
var DAILY_V = 2;   // 2 = reto elegido con esta regla (los de antes se rehacen una vez, conservando los ✓)
export function pickFresh(n, excluir) {
  var pick = [], now = Date.now();
  for (var g = 0; g < GROUPS.length && pick.length < n; g++) {
    if (g + 1 < state.fromGroup) continue;
    var fresh = GROUPS[g].filter(function (k) { var p = state.progress[k]; return (!p || typeof p.due !== "number" || p.due <= now) && excluir.indexOf(k) < 0; });
    pick = pick.concat(shuffle(fresh).slice(0, n - pick.length));
  }
  return pick;
}
export function ensureDaily() {
  var today = dayStr();
  if (state.daily.date === today && state.daily.v !== DAILY_V && state.daily.ticked.length < state.daily.list.length && state.streak.last !== today) {
    // reto de hoy elegido con la regla antigua y aún sin superar: se rehace conservando los ya marcados con ✓
    state.daily = { date: today, list: state.daily.ticked.concat(pickFresh(Math.max(0, state.DAILY_SIZE - state.daily.ticked.length), state.daily.ticked)), ticked: state.daily.ticked.slice(), v: DAILY_V };
    saveDaily();
    return true;
  }
  if (state.daily.date === today) return fitDaily();   // ya generado hoy: solo se ajusta si ha cambiado el tamaño del reto
  state.daily = { date: today, list: pickFresh(state.DAILY_SIZE, []), ticked: [], v: DAILY_V };
  saveDaily();
  return true;
}
// Ajusta la lista de hoy al tamaño elegido (5, 10 o 20). Si se acorta, se quedan primero los ya marcados con ✓;
// si se alarga, se añaden kanji nuevos. Si el reto de hoy ya está superado, el cambio vale a partir de mañana.
export function fitDaily() {
  var today = dayStr(), n = state.daily.list.length;
  if (!n || n === state.DAILY_SIZE || state.streak.last === today) return false;
  if (n > state.DAILY_SIZE) {
    var keep = state.daily.ticked.slice(0, state.DAILY_SIZE);
    state.daily.list.forEach(function (k) { if (keep.length < state.DAILY_SIZE && keep.indexOf(k) < 0) keep.push(k); });
    state.daily = { date: today, list: keep, ticked: state.daily.ticked.filter(function (k) { return keep.indexOf(k) >= 0; }) };
  } else {
    var extra = pickFresh(state.DAILY_SIZE - n, state.daily.list);
    if (!extra.length) return false;
    state.daily.list = state.daily.list.concat(extra);
  }
  saveDaily();
  // si con la lista ajustada ya están todos con ✓, el reto queda superado (racha incluida)
  if (state.daily.ticked.length >= state.daily.list.length) completeDaily();
  return true;
}
// Cuánto se tardaría en empezar todos los kanji de primaria (Kyōiku, 1026) a «n» kanji nuevos al día
function primaryEstimate(n) {
  var all = (MODE === "jlpt" ? [] : DECKS[5]) || [], left = all.filter(function (k) { return !state.progress[k] && !skipped(k); }).length;
  var days = Math.ceil(left / n), t;
  if (!left) t = "";
  else if (days < 14) t = days + (days === 1 ? " día" : " días");
  else if (days < 60) t = Math.round(days / 7) + " semanas";
  else { var m = Math.round(days / 30 * 2) / 2; t = String(m).replace(".", ",") + " meses"; }
  return { total: all.length, left: left, time: t };
}
// JLPT: cuánto falta para tener empezadas todas las tarjetas hasta el primer nivel que aún no está completo
function jlptEstimate(n) {
  for (var l = 0; l < DECKS.length; l++) {
    var all = DECKS[l], left = all.filter(function (k) { return !state.progress[k] && !skipped(k); }).length;
    if (!left) continue;
    var days = Math.ceil(left / n), t;
    if (days < 14) t = days + (days === 1 ? " día" : " días");
    else if (days < 60) t = Math.round(days / 7) + " semanas";
    else { var m = Math.round(days / 30 * 2) / 2; t = String(m).replace(".", ",") + " meses"; }
    return { left: left, total: all.length, time: t, lv: GRADE_TAG[l] };
  }
  return null;
}
export function estimateText(n) {
  if (MODE === "jlpt") {
    var j = jlptEstimate(n);
    if (!j) return "¡Ya has empezado todas las tarjetas del JLPT, del N5 al N1!";
    var q = j.left === j.total ? "las " + j.total + " tarjetas" : "las " + j.left + " tarjetas que te faltan";
    if (n >= 20) return "🚀 ¡En solo " + j.time + " habrías visto " + q + " hasta el " + j.lv + "!";
    if (n >= 10) return "🔥 ¡En " + j.time + " habrías visto " + q + " hasta el " + j.lv + "!";
    return "🌱 En unos " + j.time + " habrías visto " + q + " hasta el " + j.lv + ", a tu ritmo.";
  }
  var e = primaryEstimate(n);
  if (!e.left) return state.fromGroup > 6 ? "Empiezas directamente por los Jōyō: ¡a por ellos!" : "¡Ya has empezado todos los kanji de primaria! Ahora, a por los Jōyō.";
  var cuantos = e.left === e.total ? "los " + e.total + " kanji" : "los " + e.left + " kanji que te quedan de los " + e.total;
  if (n >= 20) return "🚀 ¡En solo " + e.time + " te sabrías " + cuantos + " que aprende un niño japonés en toda la primaria!";
  if (n >= 10) return "🔥 ¡En " + e.time + " te sabrías " + cuantos + " que aprende un niño japonés en toda la primaria!";
  return "🌱 En unos " + e.time + " te sabrías " + cuantos + " que aprende un niño japonés en toda la primaria, a tu ritmo.";
}
/* Reto diario: los kanji del día salen siempre (estén o no pendientes en los niveles). Se marcan con ✕ o ✓;
   los de ✕ se repiten hasta que todos tengan ✓. Marcar ✓ cuenta como «Good» en los niveles: el kanji usa su
   multiplicador de días y no vuelve hasta que se cumpla su espera. Al completarlo sube la racha.
   Después se pueden seguir viendo con «Siguiente», sin marcar nada. */
export function rateGood(k, now) {
  state.progress[k] = applyRating(state.progress[k] || { reps: 0 }, "good", now);
}
export function dailyDone() { return state.daily.ticked.length; }
export function dailyComplete() { return state.daily.list.length > 0 && (state.daily.ticked.length >= state.daily.list.length || state.streak.last === state.daily.date); }
export function completeDaily() {
  // los marcados con ✓ antes de que ✓ contara como «Good» (o al acortar el reto) se valoran ahora, una sola vez
  var now = Date.now(), t0 = startOfToday();
  state.daily.list.forEach(function (k) { var p = state.progress[k]; if (!p || !(p.seen >= t0)) rateGood(k, now); });
  save();
  checkDayComplete();
}
