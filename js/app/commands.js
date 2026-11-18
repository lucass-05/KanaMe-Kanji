/* Centro de comandos secreto (escribe «lucas» en el cuadro de restaurar) */
import { state } from "./state.js";
import { $, renderStreak, renderStreakSheet, selectLevel } from "./ui.js";
import { INTRO_KEY, PALETTES, saveStreak, setPalette, unlocked } from "./streak.js";
import { LEGACY_KEY, save } from "./storage.js";
import { ensureDaily } from "./daily.js";
import { renderFromSettings } from "./from-group.js";
import { renderSizeSettings } from "./daily-size.js";
import { renderStats, restoreFrom, toast } from "./settings.js";
/* Se abre escribiendo «lucas» (en KanaMe Kana, como respuesta; en KanaMe Kanji, en el cuadro de restaurar).
   «rachaX» (p. ej. racha30) cambia la mayor racha a X: se desbloquean o vuelven a bloquear las paletas que toque
   (y al volver a ganarlas sale otra vez la animación de la medalla). La paleta vuelve siempre a Sumi. */
function openConsole() {
  document.querySelectorAll(".sheet-backdrop.open").forEach(function (e) { e.classList.remove("open"); });
  var bd = $("cmdSheet");
  if (!bd) {
    bd = document.createElement("div"); bd.className = "sheet-backdrop"; bd.id = "cmdSheet";
    bd.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="Comandos"><h2>Comandos</h2><p class="sub"><b>rachaX</b> (por ejemplo racha30): cambia tu mayor racha a X días y desbloquea o vuelve a bloquear las paletas que correspondan.</p>' +
      '<input type="text" id="cmdInput" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="racha30" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid var(--hairline);background:var(--bg);color:var(--text);font:inherit;font-size:16px">' +
      '<div class="row" style="margin-top:10px;display:flex;gap:8px"><button class="pill-btn" id="cmdRun">Ejecutar</button><button class="pill-btn ghost" id="cmdClose">Cerrar</button></div><p class="note" id="cmdOut" style="margin-top:12px"></p></div>';
    document.body.appendChild(bd);
    bd.addEventListener("click", function (e) { if (e.target === bd) bd.classList.remove("open"); });
    $("cmdClose").onclick = function () { bd.classList.remove("open"); };
    $("cmdRun").onclick = runCommand;
    $("cmdInput").addEventListener("keydown", function (e) { e.stopPropagation(); if (e.key === "Enter") { e.preventDefault(); runCommand(); } });
    $("cmdInput").addEventListener("keyup", function (e) { e.stopPropagation(); });
  }
  $("cmdOut").textContent = "Mayor racha actual: " + state.streak.best + (state.streak.best === 1 ? " día." : " días.");
  bd.classList.add("open");
  setTimeout(function () { $("cmdInput").focus(); }, 60);
}
function runCommand() {
  var v = $("cmdInput").value.trim().toLowerCase(), m = v.match(/^racha\s*(\d+)$/), out = $("cmdOut");
  if (!m) { out.textContent = "Comando no reconocido. Prueba: racha30"; return; }
  var x = parseInt(m[1], 10);
  if (!(x > 0)) { out.textContent = "El número tiene que ser 1 o mayor."; return; }
  state.streak.best = x;
  if (state.streak.cur > x) state.streak.cur = x;
  saveStreak();
  setPalette("sumi");
  var n = PALETTES.filter(unlocked).length;
  try { renderStreak(); } catch (e) {}
  try { renderStreakSheet(); } catch (e) {}
  out.textContent = "Mayor racha: " + x + (x === 1 ? " día" : " días") + " · " + n + " de " + PALETTES.length + " paletas desbloqueadas. Paleta cambiada a Sumi.";
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
