/* Centro de comandos secreto (escribe «lucas» en el cuadro de restaurar) */
import { state } from "./state.js";
import { $, renderStreak, renderStreakSheet, selectLevel } from "./ui.js";
import { INTRO_KEY, PALETTES, currentStreak, saveStreak, setPalette, unlocked } from "./streak.js";
import { LEGACY_KEY, save } from "./storage.js";
import { dayStr, ensureDaily, yesterdayStr } from "./daily.js";
import { renderFromSettings } from "./from-group.js";
import { renderSizeSettings } from "./daily-size.js";
import { renderStats, restoreFrom, toast } from "./settings.js";
/* Se abre escribiendo «lucas» (en KanaMe Kana, como respuesta; en KanaMe Kanji, en el cuadro de restaurar).
   «rachaX» (p. ej. racha15) pone tu racha actual en X días; si supera la mayor racha, esa también pasa a ser X.
   «rachamaxX» (p. ej. rachamax30) cambia solo la mayor racha a X (y si la actual era mayor, la baja a X).
   Con los dos se desbloquean o vuelven a bloquear las paletas que toque (y al volver a ganarlas sale otra vez
   la animación de la medalla). La paleta vuelve siempre a Sumi. */
function openConsole() {
  document.querySelectorAll(".sheet-backdrop.open").forEach(function (e) { e.classList.remove("open"); });
  var bd = $("cmdSheet");
  if (!bd) {
    bd = document.createElement("div"); bd.className = "sheet-backdrop"; bd.id = "cmdSheet";
    bd.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="Comandos"><h2>Comandos</h2><p class="sub"><b>rachaX</b> (por ejemplo racha15): pone tu racha actual en X días; si es mayor que tu mejor racha, también la sube.<br><b>rachamaxX</b> (por ejemplo rachamax30): cambia solo tu mayor racha a X días.<br>Las paletas se desbloquean o vuelven a bloquear según tu mayor racha.</p>' +
      '<input type="text" id="cmdInput" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="racha15 · rachamax30" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid var(--hairline);background:var(--bg);color:var(--text);font:inherit;font-size:16px">' +
      '<div class="row" style="margin-top:10px;display:flex;gap:8px"><button class="pill-btn" id="cmdRun">Ejecutar</button><button class="pill-btn ghost" id="cmdClose">Cerrar</button></div><p class="note" id="cmdOut" style="margin-top:12px"></p></div>';
    document.body.appendChild(bd);
    bd.addEventListener("click", function (e) { if (e.target === bd) bd.classList.remove("open"); });
    $("cmdClose").onclick = function () { bd.classList.remove("open"); };
    $("cmdRun").onclick = runCommand;
    $("cmdInput").addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") { e.preventDefault(); runCommand(); } });
    $("cmdInput").addEventListener("keyup", function (e) { e.stopPropagation(); });
  }
  $("cmdOut").textContent = "Racha actual: " + dias(currentStreak()) + " · mayor racha: " + dias(state.streak.best) + ".";
  bd.classList.add("open");
  setTimeout(function () { $("cmdInput").focus(); }, 60);
}
function dias(n) { return n + (n === 1 ? " día" : " días"); }
function runCommand() {
  var v = $("cmdInput").value.trim().toLowerCase(), m = v.match(/^racha\s*(max)?\s*(\d+)$/), out = $("cmdOut");
  if (!m) { out.textContent = "Comando no reconocido. Prueba: racha15 o rachamax30"; return; }
  var x = parseInt(m[2], 10);
  if (m[1]) {
    // rachamaxX: solo la mayor racha (la actual no puede ser mayor)
    if (!(x > 0)) { out.textContent = "El número tiene que ser 1 o mayor."; return; }
    state.streak.best = x;
    if (state.streak.cur > x) state.streak.cur = x;
  } else {
    // rachaX: la racha actual. Si hoy ya está hecho, cuenta hoy; si no, queda viva hasta ayer y sigue al hacer el reto de hoy
    if (x > 0 && state.streak.last !== dayStr()) state.streak.last = yesterdayStr();
    state.streak.cur = x;
    if (x > state.streak.best) state.streak.best = x;
  }
  saveStreak();
  setPalette("sumi");
  var n = PALETTES.filter(unlocked).length;
  try { renderStreak(); } catch (e) {}
  try { renderStreakSheet(); } catch (e) {}
  out.textContent = "Racha actual: " + dias(currentStreak()) + " · mayor racha: " + dias(state.streak.best) + " · " + n + " de " + PALETTES.length + " paletas desbloqueadas. Paleta cambiada a Sumi.";
  $("cmdInput").value = "";
}

export function init() {
  $("importBtn").onclick = function () { var v = $("importText").value; if (v.trim().toLowerCase() === "lucas") { $("importText").value = ""; openConsole(); return; } restoreFrom(v); };
  $("fileBtn").onclick = function () { $("fileInput").click(); };
  $("fileInput").onchange = function () {
    var f = this.files && this.files[0]; if (!f) return;
    var rd = new FileReader(); rd.onload = function () { restoreFrom(String(rd.result)); }; rd.readAsText(f);
    this.value = "";
  };
  $("resetBtn").onclick = function () {
    if (!confirm("¿Borrar TODO tu progreso en este dispositivo? No se puede deshacer.")) return;
    state.progress = {}; save(); try { localStorage.removeItem(LEGACY_KEY); } catch (e) {}
    state.streak = { cur: 0, best: 0, last: "" }; saveStreak(); setPalette("sumi");
    try { localStorage.removeItem(INTRO_KEY); } catch (e) {}
    state.fromGroup = 1; try { localStorage.removeItem("kaname.fromGroup.v1"); localStorage.removeItem("kaname.fromGroup.jlpt.v1"); } catch (e) {}
    state.daily = { date: "", list: [] }; ensureDaily();
    selectLevel(state.level); renderStats(); renderStreakSheet(); renderFromSettings(); renderSizeSettings(); toast("Progreso borrado");
  };
}
