/* Ajustes: estadísticas, modo de estudio y copia de seguridad */
import { state } from "./state.js";
import { $, el, renderLevels, renderStreakSheet, showNext, stage } from "./ui.js";
import { CARDS, JLPT, KNOWN, LEVELS, MODE, MODE_KEY } from "./data.js";
import { FROM_KEY, buildQueue } from "./session.js";
import { MASTERED, ivlOf } from "./srs.js";
import { PALETTES, closeIntro, saveStreak, setPalette, track, unlocked } from "./streak.js";
import { PALETTE_KEY, SIZES, SIZE_KEY, lsGet, lsSet, parse, save } from "./storage.js";
import { fitDaily } from "./daily.js";
import { renderFromSettings } from "./from-group.js";
import { renderReminder } from "./reminder.js";
import { renderSizeSettings } from "./daily-size.js";
export function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("show"); }, 2200); }

export function renderStats() {
  var now = Date.now(), seen = 0, mature = 0, due = 0;
  Object.keys(state.progress).forEach(function (k) {
    var p = state.progress[k]; if (!CARDS[k] || !p) return;   // cuenta solo las tarjetas del modo actual
    seen++;
    if (ivlOf(p) >= MASTERED) mature++;
    if (p.due <= now) due++;
  });
  var s = $("stats"); s.innerHTML = "";
  [[seen, MODE === "jlpt" ? "estudiadas" : "estudiados"], [mature, MODE === "jlpt" ? "dominadas" : "dominados"], [Object.keys(CARDS).length - seen, "por empezar"]].forEach(function (x) {
    var d = el("div", "stat"); d.appendChild(el("b", null, String(x[0]))); d.appendChild(el("span", null, x[1])); s.appendChild(d);
  });
}
function backupString() { return JSON.stringify({ app: "KanaMe", v: 2, date: new Date().toISOString(), progress: state.progress, streak: state.streak, palette: lsGet(PALETTE_KEY) || "sumi", dailySize: state.DAILY_SIZE, fromGroup: parseInt(lsGet("kaname.fromGroup.v1"), 10) || 1 }); }
export function restoreFrom(text) {
  var o = parse((text || "").trim());
  var p = o && (o.progress || (o.app ? null : o));
  if (!p || typeof p !== "object") { toast("Código no válido"); return; }
  var n = 0, merged = {};
  Object.keys(state.progress).forEach(function (k) { merged[k] = state.progress[k]; });
  Object.keys(p).forEach(function (k) {
    if (!KNOWN[k] || !p[k] || typeof p[k].due !== "number") return;
    // Si la tarjeta existe en ambos, nos quedamos con la revisada más recientemente
    if (!merged[k] || (p[k].seen || 0) >= (merged[k].seen || 0)) { merged[k] = p[k]; n++; }
  });
  state.progress = merged; save();
  if (o.streak && typeof o.streak === "object") {
    var st = o.streak;
    if ((st.last || "") > state.streak.last) { state.streak.cur = st.cur || 0; state.streak.last = st.last; }
    state.streak.best = Math.max(state.streak.best, st.best || 0, state.streak.cur);
    saveStreak();
    if (o.palette) { var pp = PALETTES.filter(function (x) { return x.id === o.palette; })[0]; if (pp && unlocked(pp)) setPalette(pp.id); }
  }
  if (SIZES.indexOf(+o.dailySize) >= 0) { state.DAILY_SIZE = +o.dailySize; lsSet(SIZE_KEY, String(state.DAILY_SIZE)); fitDaily(); }
  if (MODE === "joyo" && o.fromGroup >= 1 && o.fromGroup <= LEVELS.length) { state.fromGroup = +o.fromGroup; lsSet(FROM_KEY, String(state.fromGroup)); }
  buildQueue(); stage.innerHTML = ""; state.current = null; showNext(); renderLevels(); renderStats(); renderStreakSheet();
  if ($("sheet").classList.contains("open")) { renderSizeSettings(); renderFromSettings(); }
  toast(n + " tarjetas restauradas");
}

function renderModeSettings() {
  var box = $("modeOpts"); box.innerHTML = "";
  [["joyo", "常用 Jōyō", "Por cursos del colegio"], ["jlpt", "JLPT", "N5 a N1, con palabras"]].forEach(function (x) {
    var b = el("button", "size-opt" + (x[0] === MODE ? " sel" : ""));
    b.setAttribute("aria-pressed", x[0] === MODE ? "true" : "false");
    b.appendChild(el("b", null, x[1])); b.appendChild(el("span", null, x[2]));
    b.onclick = function () {
      if (x[0] === MODE) return;
      if (x[0] === "jlpt" && !JLPT) { toast("No se pudieron cargar los datos del JLPT"); return; }
      save(); lsSet(MODE_KEY, x[0]); track("modo-" + x[0]);
      location.reload();
    };
    box.appendChild(b);
  });
  $("modeNote").textContent = MODE === "jlpt"
    ? "Niveles del JLPT del N5 al N1, con sus kanji y su vocabulario. Las palabras tienen su propia tarjeta: al girarla, toca cada kanji para ver su explicación. Tu progreso es el mismo en los dos modos: lo que repases aquí cuenta también en Jōyō. (Listas no oficiales: el JLPT no publica listas desde 2010.)"
    : "Los kanji ordenados como los aprenden los niños japoneses: de 1º a 6º de primaria y después el resto de los Jōyō. Tu progreso es el mismo en los dos modos: lo que repases aquí cuenta también en JLPT.";
}
function openSheet() { renderModeSettings(); renderStats(); renderSizeSettings(); $("sizeNoteSettings").textContent = "Kanji nuevos que te damos cada día en «Kanji de hoy»."; renderFromSettings(); renderStreakSheet(); renderReminder(); $("sheet").classList.add("open"); }

export function init() {
  $("openSettings").onclick = openSheet;
  $("streakBtn").onclick = openSheet;
  $("closeSettings").onclick = function () { $("sheet").classList.remove("open"); };
  $("introOk").onclick = closeIntro;
  $("introPalettes").onclick = function () { closeIntro(); openSheet(); setTimeout(function () { $("streakHero").scrollIntoView({ block: "start", behavior: "smooth" }); }, 50); };
  $("introSheet").onclick = function (e) { if (e.target === $("introSheet")) closeIntro(); };
  $("sheet").onclick = function (e) { if (e.target === $("sheet")) $("sheet").classList.remove("open"); };
  $("exportBtn").onclick = function () {
    var s = backupString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(function () { toast("Código copiado"); }, function () { $("importText").value = s; toast("Cópialo del cuadro de abajo"); });
    } else { $("importText").value = s; toast("Cópialo del cuadro de abajo"); }
  };
  $("downloadBtn").onclick = function () {
    var blob = new Blob([backupString()], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kaname-progreso-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  };
}
