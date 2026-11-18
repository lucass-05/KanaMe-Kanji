/* Tamaño del reto diario (5, 10 o 20) */
import { state } from "./state.js";
import { $, el, renderLevels, showNext, stage } from "./ui.js";
import { SIZES, SIZE_KEY, lsGet, lsSet } from "./storage.js";
import { buildQueue } from "./session.js";
import { dayStr, estimateText, fitDaily } from "./daily.js";
import { toast } from "./settings.js";
import { track } from "./streak.js";
var SIZE_LABELS = { 5: "Tranquilo", 10: "Constante", 20: "Intensivo" };
function renderSizePicker(boxId, estId, selected, onPick) {
  var box = $(boxId); box.innerHTML = "";
  SIZES.forEach(function (n) {
    var b = el("button", "size-opt" + (n === selected ? " sel" : ""));
    b.setAttribute("aria-pressed", n === selected ? "true" : "false");
    b.setAttribute("aria-label", n + " kanji al día, " + SIZE_LABELS[n]);
    b.appendChild(el("b", null, String(n))); b.appendChild(el("span", null, SIZE_LABELS[n]));
    b.onclick = function () { onPick(n); };
    box.appendChild(b);
  });
  $(estId).textContent = estimateText(selected);
}
function setDailySize(n) {
  var before = state.DAILY_SIZE;
  state.DAILY_SIZE = n; lsSet(SIZE_KEY, String(n));
  if (n === before) return "";
  track("reto-" + n);
  var changed = fitDaily();
  if (state.level === 0) { state.current = null; buildQueue(); stage.innerHTML = ""; showNext(); }
  renderLevels();
  return changed || state.streak.last !== dayStr() ? "" : "Hoy ya has superado el reto: el cambio se aplica desde mañana.";
}
export function renderSizeSettings() {
  renderSizePicker("sizeOptsSettings", "sizeEstSettings", state.DAILY_SIZE, function (n) {
    var msg = setDailySize(n);
    renderSizeSettings();
    $("sizeNoteSettings").textContent = msg || "Kanji nuevos que te damos cada día en «Kanji de hoy».";
    toast("🎯 Reto diario: " + n + " kanji al día");
  });
}
// Primera vez: se pregunta antes que nada
export function maybeAskSize(done) {
  if (lsGet(SIZE_KEY)) return false;
  var pick = state.DAILY_SIZE;
  var draw = function () { renderSizePicker("sizeOptsFirst", "sizeEstFirst", pick, function (n) { pick = n; draw(); }); };
  draw();
  $("sizeGo").onclick = function () {
    setDailySize(pick); lsSet(SIZE_KEY, String(pick)); track("reto-elegido-" + pick);
    $("sizeSheet").classList.remove("open");
    if (done) done();
  };
  $("sizeSheet").classList.add("open");
  return true;
}
