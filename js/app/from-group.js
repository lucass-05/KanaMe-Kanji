/* Mostrar kanji a partir de… (saltar grupos) */
import { state } from "./state.js";
import { $, el, firstOpenLevel, renderLevels, showNext, stage } from "./ui.js";
import { DECKS, GRADE_TAG, LEVELS, MODE } from "./data.js";
import { FROM_KEY, buildQueue, skipped } from "./session.js";
import { LEVEL_KEY, lsSet } from "./storage.js";
import { dailyComplete, pickFresh, saveDaily } from "./daily.js";
import { renderSizeSettings } from "./daily-size.js";
import { toast } from "./settings.js";
import { track } from "./streak.js";
function groupLabel(n) { return MODE === "jlpt" ? GRADE_TAG[n - 1] : n === 7 ? "常 Jōyō" : n + "º"; }
export function renderFromSettings() {
  var box = $("fromOpts"); box.innerHTML = "";
  box.style.gridTemplateColumns = "repeat(" + LEVELS.length + ", 1fr)";
  LEVELS.forEach(function (L, i) {
    var n = i + 1, b = el("button", "from-opt" + (n === state.fromGroup ? " sel" : n < state.fromGroup ? " skip" : ""), GRADE_TAG[i] === "Jōyō" ? "常" : GRADE_TAG[i]);
    b.setAttribute("aria-pressed", n === state.fromGroup ? "true" : "false");
    b.setAttribute("aria-label", n === 1 ? "Desde " + GRADE_TAG[0] + " (todo)" : "A partir de " + groupLabel(n) + ": saltar los grupos anteriores");
    b.onclick = function () { setFromGroup(n); };
    box.appendChild(b);
  });
  var cuantos = DECKS[state.fromGroup - 2] ? DECKS[state.fromGroup - 2].length : 0, que = MODE === "jlpt" ? "tarjetas" : "kanji";
  $("fromNote").textContent = state.fromGroup === 1
    ? "Para estudiantes avanzados: elige un grupo para saltarte los anteriores. Contarán como repasados (sin marcarse como dominados) y no saldrán en los demás niveles ni en el reto diario. Vuelve a " + GRADE_TAG[0] + " para desactivarlo."
    : "Te saltas las " + cuantos + " " + que + " de " + (state.fromGroup === 2 ? GRADE_TAG[0] : GRADE_TAG[0] + " a " + GRADE_TAG[state.fromGroup - 2]) + ": cuentan como repasadas (no como dominadas) y no salen en los demás niveles ni en el reto diario. Puedes repasarlas igualmente desde su nivel. Vuelve a " + GRADE_TAG[0] + " para desactivarlo.";
}
function setFromGroup(n) {
  if (n === state.fromGroup) return;
  state.fromGroup = n; lsSet(FROM_KEY, String(n));
  track("a-partir-de-" + n);
  // Reto de hoy (si no está superado): los kanji saltados sin ✓ se cambian por otros nuevos
  if (state.daily.list.length && !dailyComplete()) {
    var keep = state.daily.list.filter(function (k) { return !skipped(k) || state.daily.ticked.indexOf(k) >= 0; });
    var extra = pickFresh(state.daily.list.length - keep.length, keep);
    if (keep.length !== state.daily.list.length) { state.daily.list = keep.concat(extra); saveDaily(); }
  }
  if (state.level !== 0 && state.level < state.fromGroup) state.level = firstOpenLevel(), lsSet(LEVEL_KEY, String(state.level));
  state.cramMode = false; state.current = null; buildQueue(); stage.innerHTML = ""; showNext(); renderLevels();
  renderFromSettings(); renderSizeSettings();
  toast(n === 1 ? "Mostrando todo desde " + GRADE_TAG[0] : "Mostrando a partir de " + groupLabel(n));
}
