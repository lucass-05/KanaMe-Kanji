/* Ciclo de vida: cambio de día, guardado al salir, teclado y service worker */
import { state } from "./state.js";
import { $, flip, markCram, markDaily, nextBrowse, rate, renderLevels, renderStatus, showNext, stage } from "./ui.js";
import { buildQueue, mode, queue, refillQueue } from "./session.js";
import { ensureDaily } from "./daily.js";
import { save } from "./storage.js";
import { tour } from "./tour.js";

export function init() {
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") save();
    else {
      // Si ha cambiado el día con la app abierta, se generan los kanji del nuevo día
      if (ensureDaily() && state.level === 0) { state.current = null; buildQueue(); stage.innerHTML = ""; showNext(); }
      refillQueue(); renderLevels(); if (!state.current) { buildQueue(); stage.innerHTML = ""; showNext(); } else renderStatus();
    }
  });
  window.addEventListener("pagehide", save);
  // Cada 30 s comprueba si alguna tarjeta ("Again") ha vuelto a estar disponible
  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    if (ensureDaily() && state.level === 0 && !state.current) buildQueue();
    if (!state.current && !state.cramMode) { buildQueue(); if (queue.length) { stage.innerHTML = ""; showNext(); } }
    renderLevels(); if (state.current) renderStatus();
  }, 30000);
  document.addEventListener("keydown", function (e) {
    if (tour || ["sheet", "remSheet", "introSheet", "sizeSheet", "installSheet"].some(function (id) { return $(id).classList.contains("open"); })) return;
    var m = mode();
    if (m === "browse" && (e.key === "Enter" || e.key === "ArrowRight")) { e.preventDefault(); nextBrowse(); }
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (m === "daily" || m === "cram") { var mk = m === "cram" ? markCram : markDaily; if (e.key === "1" || e.key === "ArrowLeft") mk(false); else if (e.key === "2" || e.key === "ArrowRight") mk(true); }
    else if (state.flipped && "1234".indexOf(e.key) >= 0) rate(["again", "hard", "good", "easy"][+e.key - 1]);
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
}
