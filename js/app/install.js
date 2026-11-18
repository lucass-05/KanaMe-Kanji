/* Añadir a la pantalla de inicio */
import { $, el } from "./ui.js";
import { lsGet, lsSet } from "./storage.js";
import { startTour } from "./tour.js";
import { track } from "./streak.js";
/* La primera vez que se abre en el navegador (no como app instalada) se explica cómo añadirla.
   Se detecta el móvil (iPhone, Samsung u otro Android) y se puede cambiar a mano. En Android, si el navegador
   lo permite, aparece además el botón «Instalar con un toque». */
var INSTALL_KEY = "kaname.install.v1";
var installPrompt = null;
export function isStandalone() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; }
export function detectDevice() {
  var ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "iphone";
  if (/SamsungBrowser/i.test(ua)) return "samsung";
  if (/Android/i.test(ua)) return /SM-|Samsung/i.test(ua) && !/Chrome\/[\d.]+ Mobile/.test(ua) ? "samsung" : "android";
  return "";
}
var instDevice;
var SHARE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v8h14v-8"/></svg>';
function mockUrl() { return '<div class="mock"><span class="url">🔒 ' + location.host + location.pathname.replace(/\/$/, "") + '</span></div>'; }
function mockBar(where, icons) { return '<div class="mock"><div class="bar ' + where + '">' + icons.map(function (i) { return '<i' + (i[1] ? ' class="hl"' : "") + '>' + i[0] + '</i>'; }).join("") + '</div></div>'; }
function mockMenu(items) { return '<div class="mock"><div class="menu">' + items.map(function (i) { return '<div' + (i[1] ? ' class="hl"' : "") + '>' + i[0] + '</div>'; }).join("") + '</div></div>'; }
function mockHome() { return '<div class="mock"><div class="home"><i></i><i></i><img src="icons/icon-192.png" alt=""><i></i><i></i><i></i><i></i><i></i></div></div>'; }
var INSTALL_GUIDES;
function renderInstallNow() {
  var b = $("instNow"); if (!b) return;
  b.hidden = !installPrompt || instDevice === "iphone";
}
function renderInstall() {
  var tabs = $("instTabs"); tabs.innerHTML = "";
  ["iphone", "samsung", "android"].forEach(function (d) {
    var b = el("button", d === instDevice ? "on" : null, INSTALL_GUIDES[d].label);
    b.onclick = function () { instDevice = d; renderInstall(); };
    tabs.appendChild(b);
  });
  var g = INSTALL_GUIDES[instDevice];
  $("instWarn").hidden = !g.warn; $("instWarn").textContent = g.warn || "";
  var ol = $("instSteps"); ol.innerHTML = "";
  g.steps.forEach(function (s, i) {
    var li = el("li", "inst-step");
    li.appendChild(el("span", "n", String(i + 1)));
    var tx = el("div"); tx.appendChild(el("b", null, s[0]));
    var sp = el("span"); sp.innerHTML = s[1]; tx.appendChild(sp);
    if (s[2]) tx.appendChild(el("small", null, s[2]));
    li.appendChild(tx);
    var m = el("div"); m.innerHTML = s[3](); li.appendChild(m.firstChild);
    ol.appendChild(li);
  });
  renderInstallNow();
}
var installAfter = null;
export function openInstall(after, fromTour) {
  installAfter = after || null;
  $("instTag").hidden = !fromTour;
  renderInstall();
  $("installSheet").classList.add("open");
  $("installSheet").querySelector(".sheet").scrollTop = 0;
  track("guia-instalar-" + instDevice);
}
function closeInstall(state) {
  if (state) lsSet(INSTALL_KEY, state);
  $("installSheet").classList.remove("open");
  var a = installAfter; installAfter = null; if (a) a();
}
// Primera vez en el navegador del móvil: se muestra antes que nada (en iPhone el progreso no pasa a la app instalada)
function maybeAskInstall(done) {
  if (isStandalone() || lsGet(INSTALL_KEY) || !detectDevice()) return false;
  openInstall(done);
  return true;
}

export function init() {
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installPrompt = e; renderInstallNow(); });
  window.addEventListener("appinstalled", function () { installPrompt = null; lsSet(INSTALL_KEY, "instalada"); track("app-instalada"); });
  instDevice = detectDevice() || "iphone";
  INSTALL_GUIDES = {
    iphone: { label: "iPhone", warn: "Hazlo antes de empezar: en iPhone, lo que hagas en Safari no pasa a la app de la pantalla de inicio.", steps: [
      ["Ábrela en Safari", "Es la forma más fiable en iPhone.", "En Chrome también vale: el botón Compartir está en la barra de dirección.", mockUrl],
      ["Toca «Compartir»", "El cuadrado con una <em>flecha hacia arriba</em>, en la barra de abajo (en iPad, arriba).", "Si no ves la barra, toca abajo del todo o «···».", function () { return mockBar("bottom", [["‹"], ["›"], [SHARE_SVG, 1], ["▢"], ["⧉"]]); }],
      ["«Añadir a pantalla de inicio»", "Desliza el menú hacia abajo hasta encontrar la opción y tócala.", "", function () { return mockMenu([["Copiar"], ["Añadir a favoritos"], ["Añadir a pantalla de inicio ⊞", 1], ["Imprimir"]]); }],
      ["Pulsa «Añadir»", "Arriba a la derecha. Abre KanaMe <em>siempre desde el icono</em>: ahí se guarda tu progreso.", "", mockHome]
    ] },
    samsung: { label: "Samsung", steps: [
      ["Ábrela en Samsung Internet", "El navegador de Samsung (también vale Chrome: mira la pestaña Android).", "", mockUrl],
      ["Toca el menú ≡", "Las <em>tres rayas</em>, abajo a la derecha.", "", function () { return mockBar("bottom", [["‹"], ["›"], ["⌂"], ["▢"], ["≡", 1]]); }],
      ["«Añadir página a» → «Pantalla de inicio»", "Según la versión puede llamarse «Añadir a pantalla de inicio».", "", function () { return mockMenu([["Marcadores"], ["Añadir página a  ›", 1], ["Descargas"], ["Ajustes"]]); }],
      ["Confirma con «Añadir»", "El icono aparece en tu pantalla. Abre KanaMe <em>siempre desde ahí</em>.", "", mockHome]
    ] },
    android: { label: "Android", steps: [
      ["Ábrela en Chrome", "El navegador de Google, que viene en casi todos los Android.", "", mockUrl],
      ["Toca el menú ⋮", "Los <em>tres puntos</em>, arriba a la derecha.", "", function () { return mockBar("top", [["⌂"], ["🔒"], ["⧉"], ["⋮", 1]]); }],
      ["«Añadir a pantalla de inicio»", "O «Instalar aplicación», según la versión.", "", function () { return mockMenu([["Nueva pestaña"], ["Historial"], ["Añadir a pantalla de inicio", 1], ["Compartir…"]]); }],
      ["Confirma con «Instalar»", "El icono aparece en tu pantalla. Abre KanaMe <em>siempre desde ahí</em>.", "", mockHome]
    ] }
  };
  $("instDone").onclick = function () { track("instalar-hecho-" + instDevice); closeInstall("hecho"); };
  $("instLater").onclick = function () { closeInstall("luego"); };
  $("instNow").onclick = function () {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(function (r) {
      track("instalar-boton-" + (r && r.outcome === "accepted" ? "aceptado" : "cancelado"));
      if (r && r.outcome === "accepted") closeInstall("instalada");
    }).catch(function () {});
    installPrompt = null; renderInstallNow();
  };
  $("instOpen").onclick = function () { $("sheet").classList.remove("open"); openInstall(); };
  $("instOpen").hidden = isStandalone();
  $("tourAgain").onclick = function () { $("sheet").classList.remove("open"); setTimeout(function () { startTour(null, true); }, 250); };
}
