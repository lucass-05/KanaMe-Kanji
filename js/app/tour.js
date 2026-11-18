/* Tutorial de la primera vez */
import { state } from "./state.js";
import { $, el, flip } from "./ui.js";
import { MODE } from "./data.js";
import { detectDevice, isStandalone, openInstall } from "./install.js";
import { lsGet, lsSet } from "./storage.js";
import { mode } from "./session.js";
import { track } from "./streak.js";
/* Ilumina cada parte de la pantalla con una explicación corta. Sale una sola vez (TOUR_KEY). */
var TOUR_KEY = "kaname.tour.v1";
export var tour = null;
function unflip() {
  if (!state.flipped || !$("card")) return;
  state.flipped = false;
  $("card").classList.remove("flipped");
  $("ratings").classList.toggle("show", mode() === "browse");
}
function tourSteps() {
  var m = mode(), steps = [];
  steps.push({ el: "todayBtn", t: "Kanji de hoy", h: "Cada día te damos <b>" + state.DAILY_SIZE + " kanji nuevos</b> (puedes cambiarlo en Progreso). Es tu reto diario: supéralo para sumar un día a tu <b>racha 🔥</b>." });
  if ($("card")) {
    steps.push({ el: "card", t: "Las tarjetas", h: "Intenta recordar la lectura y el significado del kanji. Después <b>toca la tarjeta para girarla</b> y ver la respuesta, con palabras de ejemplo.", go: function () { setTimeout(flip, 350); } });
    if (m === "daily") steps.push({ el: "ratings", t: "¿Te lo sabías?", h: "Marca <b>✓</b> si te lo sabías y <b>✕</b> si no. Los de ✕ se repiten hasta que aciertes los " + state.daily.list.length + ": entonces el reto queda superado." });
    else if (m === "srs") steps.push({ el: "ratings", t: "¿Cuándo vuelve?", h: "Elige lo bien que te lo sabías. Debajo de cada botón ves <b>cuándo volverá</b> esa tarjeta." });
    else steps.push({ el: "ratings", t: "Repaso libre", h: "Has superado el reto de hoy: puedes seguir viendo los " + state.daily.list.length + " kanji con <b>Siguiente</b>, sin marcar nada." });
  }
  steps.push({ el: "levels", t: "Niveles", h: (MODE === "jlpt" ? "Aquí eliges qué estudiar: los niveles del JLPT, del <b>N5</b> al <b>N1</b> (cada uno incluye los anteriores), con sus kanji y sus palabras." : "Aquí eliges qué estudiar: de <b>1º a 6º de primaria</b> (cada uno incluye los anteriores) y <b>常</b>, los 2136 kanji Jōyō.") + " El número es lo que tienes pendiente. Al superar el reto de hoy te llevamos solos al primer nivel sin terminar.",
    chips: true });
  steps.push({ el: "streakBtn", t: "Racha y colores", h: "Tu racha de días seguidos. Tócala para ver las <b>paletas de colores</b> que vas desbloqueando y elegir la que quieras." });
  steps.push({ el: "openSettings", t: "Jōyō o JLPT", h: "Aquí, en <b>Modo de estudio</b>, eliges cómo aprender: <b>Jōyō</b>, los kanji por cursos del colegio japonés, o <b>JLPT</b>, del N5 al N1 con kanji y palabras. Puedes cambiar cuando quieras: tu progreso es el mismo en los dos." + (MODE === "jlpt" ? " Ahora estás en JLPT." : " Ahora estás en Jōyō.") });
  steps.push({ el: "openSettings", t: "Tu progreso", h: "Estadísticas, <b>recordatorio diario</b> y copia de seguridad para pasar tu progreso a otro móvil." + " ¡Listo, a estudiar!" });
  return steps;
}
// replay = true al pulsar «Ver el tutorial otra vez»: entonces el último paso (añadir a la pantalla de inicio) sale siempre
export function startTour(done, replay) {
  if (tour) return;
  var steps = tourSteps(), i = 0;
  var withInst = replay || (!isStandalone() && !!detectDevice());
  var root = el("div", "tour"), hole = el("div", "tour-hole"), bub = el("div", "tour-bubble");
  root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Cómo funciona KanaMe");
  root.appendChild(hole); root.appendChild(bub); document.body.appendChild(root);
  tour = { root: root };
  function finish() {
    lsSet(TOUR_KEY, "1");
    window.removeEventListener("resize", place);
    root.remove(); tour = null; unflip();
    track("tutorial-" + (i >= steps.length - 1 ? "completado" : "saltado"));
    if (withInst) openInstall(done, true); else if (done) done();
  }
  function place() {
    var s = steps[i], t = $(s.el); if (!t) return;
    var r = t.getBoundingClientRect(), pad = 6, vw = window.innerWidth, vh = window.innerHeight;
    hole.style.top = (r.top - pad) + "px"; hole.style.left = (r.left - pad) + "px";
    hole.style.width = (r.width + pad * 2) + "px"; hole.style.height = (r.height + pad * 2) + "px";
    var w = Math.min(360, vw - 24); bub.style.width = w + "px";
    bub.style.left = Math.max(12, Math.min(vw - w - 12, r.left + r.width / 2 - w / 2)) + "px";
    var bh = bub.offsetHeight, below = r.bottom + pad + 12, above = r.top - pad - 12 - bh;
    bub.style.top = (below + bh <= vh - 12 ? below : above >= 12 ? above : Math.max(12, vh - bh - 12)) + "px";
  }
  function show() {
    var s = steps[i];
    bub.innerHTML = "";
    bub.appendChild(el("h4", null, s.t));
    var p = el("p"); p.innerHTML = s.h; bub.appendChild(p);
    if (s.chips) {
      var c = el("div", "tour-chips");
      [["again", "Again", "10 min"], ["hard", "Hard", "×1,2"], ["good", "Good", "×2,5"], ["easy", "Easy", "×3"]].forEach(function (x) {
        var sp = el("span", x[0], x[1]); sp.appendChild(el("small", null, x[2])); c.appendChild(sp);
      });
      bub.appendChild(c);
      bub.appendChild(el("p", null, "En los niveles, cada acierto multiplica el tiempo hasta que la tarjeta vuelve: lo que ya sabes (como 一, «uno») apenas te saldrá."));
    }
    var nav = el("div", "tour-nav"), dots = el("div", "tour-dots");
    steps.forEach(function (_, j) { dots.appendChild(el("i", j === i ? "on" : "")); });
    if (withInst) dots.appendChild(el("i"));
    nav.appendChild(dots);
    var last = i === steps.length - 1;
    if (!last) { var sk = el("button", "tour-skip", "Saltar"); sk.onclick = finish; nav.appendChild(sk); }
    var nx = el("button", "pill-btn tour-next", last && !withInst ? "¡Empezar!" : "Siguiente");
    nx.onclick = function () { if (last) finish(); else { i++; show(); } };
    nav.appendChild(nx);
    bub.appendChild(nav);
    if (s.go) s.go();
    place();
    setTimeout(place, 480); // tras girar la tarjeta o mostrar los botones
    nx.focus();
  }
  window.addEventListener("resize", place);
  show();
}
export function maybeStartTour(done) {
  if (lsGet(TOUR_KEY)) return false;
  startTour(done);
  return true;
}
