/* 海 Umi: la gran ola */
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
var UMI_CREST = "M0 120C10 60 50 10 110 8C150 6 172 30 162 56C154 74 130 78 122 62C116 50 126 40 138 44C120 30 92 34 74 56C58 76 56 100 64 120Z";
function umiCrest(x, y, sc, flip, sd) {
  var r = seeded(sd), cols = ["#14345e", "#2a5a92", "#4f84bd", "#8db7de", "#c9e0f3"], o = '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')">';
  var cid = "uc" + sd, OPEN = "M0 120C10 60 50 10 110 8C150 6 172 30 162 56C154 74 130 78 122 62C116 50 126 40 138 44";
  o += '<defs><clipPath id="' + cid + '"><path d="' + UMI_CREST + '"/></clipPath></defs><path d="' + UMI_CREST + '" fill="#0f2a4e"/><g clip-path="url(#' + cid + ')" fill="none" stroke-linecap="round">';
  for (var k = 0; k < 9; k++) { var s2 = 1 - k * .085, tr = 'translate(136 50) scale(' + f(s2) + ') translate(-136 -50)'; o += '<path d="' + OPEN + '" transform="' + tr + '" stroke="#0a1222" stroke-width="' + f(14 / s2) + '"/><path d="' + OPEN + '" transform="' + tr + '" stroke="' + cols[k % 5] + '" stroke-width="' + f(10 / s2) + '"/>'; }
  o += '</g><path d="' + UMI_CREST + '" fill="none" stroke="#0a1222" stroke-width="3"/>';
  // espuma: cresta blanca y burbujas rizadas
  o += '<path d="M12 78C30 40 64 16 110 12 146 10 166 30 160 52" fill="none" stroke="#0a1222" stroke-width="18" stroke-linecap="round"/><path d="M12 78C30 40 64 16 110 12 146 10 166 30 160 52" fill="none" stroke="#f6f9fc" stroke-width="12" stroke-linecap="round"/>';
  for (var b = 0; b < 60; b++) {
    var t = r(), bx = 20 + t * 140, by = 70 - Math.sin(t * Math.PI * .9) * 58 - r() * 22, br = 1.4 + r() * 4;
    o += r() > .4 ? '<circle cx="' + f(bx) + '" cy="' + f(by) + '" r="' + f(br) + '" fill="#f6f9fc" stroke="#0a1222" stroke-width="1.4"/>' : '<path d="M' + f(bx) + ' ' + f(by) + 'a' + f(br) + ' ' + f(br) + ' 0 1 1 ' + f(br) + ' ' + f(br) + 'a' + f(br * .5) + ' ' + f(br * .5) + ' 0 1 1 -' + f(br * .5) + ' -' + f(br * .5) + '" fill="none" stroke="#0a1222" stroke-width="1.3"/>';
  }
  return o + '</g>';
}
function umiStorm() {
  var r = seeded(17), s = '<rect width="400" height="860" fill="#0d1f38"/>';
  // mar de fondo con franjas
  for (var y = 0; y < 880; y += 14) s += '<path d="M-10 ' + y + 'C80 ' + (y - 8) + ' 160 ' + (y + 8) + ' 240 ' + y + 'S360 ' + (y - 8) + ' 410 ' + y + '" fill="none" stroke="' + (y % 28 ? "#1c3b66" : "#2a5a92") + '" stroke-width="5"/>';
  var crests = [];
  for (var row = 0; row < 9; row++) { var yy = -40 + row * 104, off = (row % 2) * 90 - 90; for (var c = 0; c < 4; c++) { var fl = (row + c) % 2 === 1, sc = 1.05 + r() * .45; crests.push([off + c * 150 + r() * 30 + (fl ? 170 * sc : 0), yy + r() * 20, sc, fl, row * 10 + c]); } }
  crests.forEach(function (c) { s += umiCrest(c[0], c[1], c[2], c[3], c[4]); });
  // velo y sombra arriba para que se lea la cabecera
  s += '<rect width="400" height="860" fill="#06101f" fill-opacity=".32"/><defs><linearGradient id="utop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06101f" stop-opacity=".9"/><stop offset="1" stop-color="#06101f" stop-opacity="0"/></linearGradient></defs><rect width="400" height="150" fill="url(#utop)"/>';
  return svg(s, 400, 860);
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "umi") { p.greatWave = false; p.scene = umiStorm; p.tile = null; } });
  patchPal("umi", {
    light: false, bg: "#0d1f38", surface: "#12284a", raised: "#1a335a", hairline: "#2e4f7e",
    text: "#f3f7fc", muted: "#b9cde6", faint: "#7f98b8", accent: "#8db7de", status: "#c9e0f3",
    again: "#f08a8a", hard: "#f2c46a", good: "#7cd0a0", easy: "#9cc8ff",
    grad: "#0d1f38", surfA: "ee", glow: "rgba(141,183,222,.2)",
    amb: [{ kind: "rise", shape: "bubble", colors: ["#c9e0f3", "#ffffff"], n: 8, size: [6, 12], dur: [12, 20], o: 0.5 }],
    pantone: "Inspirada en PANTONE Classic Blue 19-4052, Blue Iris 18-3943 y Cerulean 15-4020 (las capas de la ola), con contorno de tinta"
  });
}
