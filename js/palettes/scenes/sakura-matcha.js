/* 桜 Sakura y 抹茶 Matcha: ilustración plana con contorno grueso */
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
function bold(ink, w) { return '<g stroke="' + ink + '" stroke-width="' + (w || 3.2) + '" stroke-linejoin="round" stroke-linecap="round">'; }
// ---------- 桜 Sakura ----------
var SK_INK = "#4a2a33";
function skBlossom(x, y, sc, rot, light) {
  var s = '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + sc + ')">';
  for (var k = 0; k < 5; k++) s += '<path d="M0 0C-9 -6 -12 -18 -6 -25 -3 -28 -1 -27 0 -24 1 -27 3 -28 6 -25 12 -18 9 -6 0 0Z" transform="rotate(' + (k * 72) + ')" fill="' + (light ? "#fff3f6" : "#ffc7d6") + '"/>';
  s += '</g><g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + sc + ')" stroke="none">';
  for (var j = 0; j < 5; j++) s += '<path d="M0 0C-4 -4 -5 -9 -3 -12 0 -10 0 -10 3 -12 5 -9 4 -4 0 0Z" transform="rotate(' + (j * 72) + ')" fill="' + (light ? "#ffd6e1" : "#f58fab") + '"/>';
  s += '<circle r="3.2" fill="#ffd26a" stroke="' + SK_INK + '" stroke-width="1.6"/>';
  for (var q = 0; q < 5; q++) { var a = (q * 72 + 36) * Math.PI / 180; s += '<path d="M' + f(Math.cos(a) * 4) + ' ' + f(Math.sin(a) * 4) + 'L' + f(Math.cos(a) * 9) + ' ' + f(Math.sin(a) * 9) + '" stroke="' + SK_INK + '" stroke-width="1.3"/><circle cx="' + f(Math.cos(a) * 10) + '" cy="' + f(Math.sin(a) * 10) + '" r="1.5" fill="' + SK_INK + '"/>'; }
  return s + '</g>';
}
function skBud(x, y, sc, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 0C-6 -6 -6 -16 0 -22 6 -16 6 -6 0 0Z" fill="#f58fab"/><path d="M-5 -2C-3 2 3 2 5 -2L0 4Z" fill="#8cc06a"/></g>'; }
function skPetal(x, y, sc, rot) { return '<path d="M0 0C-7 -5 -9 -14 -4 -19 -2 -21 0 -19 0 -17 0 -19 2 -21 4 -19 9 -14 7 -5 0 0Z" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" fill="#ffc7d6"/>'; }
function skBranch(flip) {
  var s = '<g transform="' + (flip ? 'translate(400 0) scale(-1 1)' : '') + ' translate(-34 70)">';
  s += '<path d="M-20 70C40 60 90 88 140 80 180 74 210 50 250 52" fill="none" stroke="' + SK_INK + '" stroke-width="15"/><path d="M-20 70C40 60 90 88 140 80 180 74 210 50 250 52" fill="none" stroke="#8a5644" stroke-width="9"/>' +
    '<path d="M100 84C112 110 130 120 150 128" fill="none" stroke="' + SK_INK + '" stroke-width="11"/><path d="M100 84C112 110 130 120 150 128" fill="none" stroke="#8a5644" stroke-width="5.5"/>' +
    '<path d="M190 66C200 44 214 34 232 28" fill="none" stroke="' + SK_INK + '" stroke-width="10"/><path d="M190 66C200 44 214 34 232 28" fill="none" stroke="#8a5644" stroke-width="4.5"/>' +
    '<path d="M30 68h8M120 82h6" stroke="#c98d73" stroke-width="2"/>';
  [[20, 62, .95, 10], [62, 76, 1.15, 40, 1], [112, 72, 1, 0], [150, 128, .9, 20, 1], [178, 66, 1.2, 55], [236, 28, .85, 15], [246, 58, .9, 70, 1], [132, 108, .7, 30]].forEach(function (b) { s += skBlossom(b[0], b[1], b[2], b[3], b[4]); });
  s += skBud(92, 92, 1, 160) + skBud(214, 38, .9, -30) + skBud(44, 76, .8, 170);
  return s + '</g>';
}
function dango(x, y, sc, rot) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 -10V118" stroke-width="7"/><path d="M0 -10V118" stroke="#e8cf9a" stroke-width="3"/>' +
    '<circle cx="0" cy="12" r="19" fill="#f7a8bf"/><circle cx="0" cy="48" r="19" fill="#fff7ee"/><circle cx="0" cy="84" r="19" fill="#a9d17a"/>' +
    '<path d="M-9 4A10 10 0 0 1 -2 -2M-9 40A10 10 0 0 1 -2 34M-9 76A10 10 0 0 1 -2 70" fill="none" stroke="#fff" stroke-width="3"/></g>';
}
function boldStrawberry(x, y, sc, rot) {
  var s = '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 -2C-12 -5 -16 8 -11 17 -7 25 0 31 0 31 0 31 7 25 11 17 16 8 12 -5 0 -2Z" fill="#ee4b5f"/>' +
    '<path d="M-9 -2C-6 -8 -2 -5 0 -4 2 -5 6 -8 9 -2 5 0 2 1 0 2-2 1-5 0-9-2Z" fill="#7cba52" stroke-width="2.2"/></g><g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')" fill="#ffe7a8" stroke="none">';
  [[-5, 7], [4, 6], [-1, 13], [-6, 17], [5, 15], [0, 22]].forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1" ry="1.5"/>'; });
  return s + '</g>';
}
function boldCake(x, y, sc) {
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">';
  s += '<ellipse cx="56" cy="104" rx="78" ry="16" fill="#ffffff"/>';
  s += '<path d="M0 34L80 12 112 30V86L32 108 0 90Z" fill="#fffaf2"/>' +                                         // bloque
    '<path d="M0 34L32 44V108L0 90Z" fill="#fff1e2"/>' +                                                      // cara del corte
    '<path d="M32 44L112 30" fill="none"/>';
  s += '<g stroke="none"><path d="M2 50L30 59V68L2 59Z" fill="#f8d48a"/><path d="M2 70L30 79V88L2 79Z" fill="#f8d48a"/></g>';
  s += '<path d="M3 59.5C8 54 14 57 15 63M17 64C22 58 28 61 29 67" fill="#ee4b5f" stroke-width="2"/>';         // fresas cortadas
  s += '<path d="M34 64L110 46M34 84L110 66" fill="none" stroke-width="2" stroke-opacity=".35"/>';
  s += '<path d="M44 20C38 14 48 6 56 11 60 3 74 7 72 15 80 15 80 25 70 27H48C40 27 38 22 44 20Z" fill="#ffffff"/>'; // nata
  return s + '</g>' + boldStrawberry(x + 58 * sc, y - 2 * sc, sc * 1.05, -10);
}
function sakuraMochi(x, y, sc, rot) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M-30 6C-30 -14 30 -14 30 6 30 22 -30 22 -30 6Z" fill="#f9b8c9"/>' +
    '<path d="M-34 10C-20 -6 8 -10 34 -2 26 18 -8 30 -34 10Z" fill="#8cc06a"/><path d="M-26 9C-10 4 10 2 28 -1M-14 7L-10 16M2 5L4 15M16 3L18 12" fill="none" stroke-width="2"/>' +
    '<circle cx="-14" cy="-6" r="2" fill="#fff" stroke="none"/></g>';
}
export function sakuraScene() {
  var r = seeded(14), s = bold(SK_INK);
  s += skBranch(false);
  // pétalos cayendo
  for (var i = 0; i < 14; i++) s += skPetal(30 + r() * 340, 280 + r() * 400, .7 + r() * .5, r() * 360);
  // abajo: tarta de fresas, dango y sakura mochi sobre un mantel
  s += boldCake(18, 700, 1.05) + dango(318, 690, .95, 18) + sakuraMochi(214, 820, 1.1, -6) + boldStrawberry(176, 760, 1.15, 20) + boldStrawberry(380, 832, 1, -24);
  s += skBlossom(30, 340, 1.2, 10) + skBlossom(372, 430, 1, 40, 1) + skBlossom(24, 600, .8, 60, 1);
  return svg(s + '</g>', 400, 860);
}
function sakuraDots() { // fondo: lunares y flores de línea
  var s = '<g fill="none" stroke="#f3b6c7" stroke-width="2">' + '<path d="' + (function () { var d = ''; for (var k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; d += 'M' + f(60 + Math.cos(a) * 8) + ' ' + f(60 + Math.sin(a) * 8) + 'A6 6 0 1 1 ' + f(60 + Math.cos(a + 1.25) * 8) + ' ' + f(60 + Math.sin(a + 1.25) * 8); } return d; })() + '"/></g>' +
    '<circle cx="15" cy="20" r="3" fill="#f7c3d2"/><circle cx="100" cy="100" r="2.4" fill="#f7c3d2"/><circle cx="105" cy="25" r="1.8" fill="#fbd8e2"/>';
  return svg(s, 120, 120);
}
// ---------- 抹茶 Matcha: ilustración kawaii pastel, contorno salvia redondeado, brillos y hojitas ----------
var MO = "#7d9670";   // contorno salvia
var MAR = "Hiragino Maru Gothic ProN, Zen Maru Gothic, M PLUS Rounded 1c, Noto Sans CJK JP, sans-serif";
function mtOut(w) { return '<g stroke="' + MO + '" stroke-width="' + (w || 4) + '" stroke-linejoin="round" stroke-linecap="round">'; }
function sparkle(x, y, r, c) { return '<path d="M' + x + ' ' + (y - r) + 'C' + f(x + r * .12) + ' ' + f(y - r * .12) + ' ' + f(x + r * .12) + ' ' + f(y - r * .12) + ' ' + (x + r) + ' ' + y + 'C' + f(x + r * .12) + ' ' + f(y + r * .12) + ' ' + f(x + r * .12) + ' ' + f(y + r * .12) + ' ' + x + ' ' + (y + r) + 'C' + f(x - r * .12) + ' ' + f(y + r * .12) + ' ' + f(x - r * .12) + ' ' + f(y + r * .12) + ' ' + (x - r) + ' ' + y + 'C' + f(x - r * .12) + ' ' + f(y - r * .12) + ' ' + f(x - r * .12) + ' ' + f(y - r * .12) + ' ' + x + ' ' + (y - r) + 'Z" fill="' + c + '"/>'; }
function mtLeaf(x, y, sc, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 0C10 -12 36 -14 50 0 36 14 10 12 0 0Z" fill="#9cbf6a" stroke="#6f8f4e" stroke-width="3.6"/><path d="M8 0C20 -2 32 -2 42 0" fill="none" stroke="#c9e09e" stroke-width="3"/></g>'; }
function sprout(x, y, sc, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 0C0 -20 6 -36 18 -46" fill="none" stroke="#6f8f4e" stroke-width="4" stroke-linecap="round"/>' + mtLeaf(14, -42, .7, -60) + mtLeaf(12, -30, .75, 20) + '</g>'; }
function latteGlass(x, y, sc) {
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><defs><linearGradient id="lt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d38c"/><stop offset=".42" stop-color="#c6dc9c"/><stop offset=".6" stop-color="#eef5e0"/><stop offset=".72" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>' +
    '<filter id="ltb"><feGaussianBlur stdDeviation="4"/></filter><clipPath id="ltc"><path d="M-46 -60C-50 0 -50 60 -42 92 -40 100 -32 104 0 104 32 104 40 100 42 92 50 60 50 0 46 -60Z"/></clipPath></defs>';
  s += '<path d="M-46 -60C-50 0 -50 60 -42 92 -40 100 -32 104 0 104 32 104 40 100 42 92 50 60 50 0 46 -60Z" fill="#f6faee"/>';
  s += '<g clip-path="url(#ltc)"><rect x="-60" y="-44" width="120" height="160" fill="url(#lt)"/><g filter="url(#ltb)" fill="#ffffff"><circle cx="-30" cy="22" r="14"/><circle cx="-6" cy="16" r="16"/><circle cx="22" cy="20" r="14"/><circle cx="38" cy="26" r="10"/></g>' +
    '<g fill="#a9c77a"><circle cx="-28" cy="-20" r="1.8"/><circle cx="-24" cy="-14" r="1.4"/><circle cx="-34" cy="60" r="1.6"/><circle cx="26" cy="54" r="1.8"/><circle cx="30" cy="60" r="1.3"/></g></g>';
  s += mtOut(5) + '<path d="M-46 -60C-50 0 -50 60 -42 92 -40 100 -32 104 0 104 32 104 40 100 42 92 50 60 50 0 46 -60" fill="none"/><ellipse cx="0" cy="-60" rx="46" ry="12" fill="#fbfdf6"/></g>';
  s += '<path d="M-36 -56Q-20 -62 -6 -62" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><path d="M30 -24V16" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="26" r="2.6" fill="#fff"/>';
  return s + '</g>';
}
function kawaiiChawan(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' + mtOut(4.5) + '<path d="M-58 0C-56 36 -30 58 0 58S56 36 58 0Z" fill="#e9dcc6"/><path d="M-16 58H16V66H-16Z" fill="#dccbb0"/>' +
    '<ellipse cx="0" cy="0" rx="58" ry="14" fill="#f4ecdc"/><ellipse cx="0" cy="1" rx="48" ry="9" fill="#a9c77a" stroke-width="3"/></g>' +
    '<g fill="#d8e9b8"><circle cx="-14" cy="0" r="3"/><circle cx="4" cy="2" r="2"/><circle cx="16" cy="-1" r="2.6"/></g><path d="M-44 20Q-38 34 -26 40" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M-40 24C-24 32 24 32 40 24" fill="none" stroke="#b9c9a0" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/></g>';
}
function kawaiiChasen(x, y, sc, rot) {
  var t = ''; for (var i = 0; i <= 8; i++) { var a = -1 + i / 4; t += 'M' + f(a * 6) + ' 38C' + f(a * 20) + ' 56 ' + f(a * 24) + ' 74 ' + f(a * 9) + ' 90'; }
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')">' + mtOut(4) + '<rect x="-10" y="-34" width="20" height="74" rx="9" fill="#f1e2b8"/><path d="M-26 64C-26 94 26 94 26 64C26 50 -26 50 -26 64Z" fill="#f8efd6"/><path d="' + t + '" fill="none" stroke-width="2.2"/><path d="M-10 -8H10M-10 18H10" stroke-width="3"/></g>' +
    '<path d="M-4 -26V-14" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></g>';
}
function kawaiiKyusu(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' + mtOut(4.2) + '<path d="M40 2C56 -6 62 -16 70 -22 70 -10 62 6 42 20Z" fill="#cfe3b0"/><path d="M-42 4L-80 -16 -76 -4 -44 16Z" fill="#ead7a8"/>' +
    '<path d="M-46 8C-46 -24 46 -24 46 8 46 40 -46 40 -46 8Z" fill="#cfe3b0"/><path d="M-26 -14C-26 -26 26 -26 26 -14Z" fill="#bcd69a"/><circle cx="0" cy="-28" r="6" fill="#bcd69a"/></g>' +
    '<path d="M-32 0Q-28 -10 -18 -14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><g fill="#9cbf6a"><circle cx="-14" cy="12" r="3"/><circle cx="0" cy="16" r="3"/><circle cx="14" cy="12" r="3"/></g></g>';
}
export function matchaScene() {
  var r = seeded(5), s = '';
  // brillos
  [[60, 260, 22, "#c3d3ae"], [340, 220, 30, "#c3d3ae"], [80, 600, 18, "#c3d3ae"], [350, 600, 14, "#c3d3ae"], [210, 560, 12, "#ffffff"], [120, 330, 9, "#ffffff"], [300, 300, 8, "#ffffff"], [260, 770, 10, "#ffffff"], [30, 470, 10, "#ffffff"], [380, 470, 9, "#ffffff"], [170, 820, 8, "#c3d3ae"]].forEach(function (p) { s += sparkle(p[0], p[1], p[2], p[3]); });
  s += sprout(320, 190, 1.1, 10) + mtLeaf(24, 380, .8, -60) + mtLeaf(370, 380, .7, 220) + mtLeaf(40, 520, .6, -20) + mtLeaf(344, 520, .65, 200);
  s += kawaiiKyusu(316, 470, .9);
  s += '<text x="30" y="200" font-family="' + MAR + '" font-weight="800" font-size="38" fill="#d9c8bc">抹茶</text>';
  s += latteGlass(96, 730, 1) + kawaiiChawan(290, 780, 1) + kawaiiChasen(196, 752, .75, -14);
  s += '<text x="228" y="716" font-family="' + MAR + '" font-weight="800" font-size="26" fill="#8aa96a">まっちゃ</text>';
  for (var i = 0; i < 26; i++) s += '<circle cx="' + f(r() * 400) + '" cy="' + f(120 + r() * 700) + '" r="' + f(1 + r() * 1.6) + '" fill="#ffffff" fill-opacity=".8"/>';
  return svg(s, 400, 860);
}

export function init() {
  patchPal("sakura", {
    sakuraScene: true, mark: "", tile: sakuraDots(), tileSize: "120px 120px", tileOpacity: 1,
    bg: "#fde8ee", surface: "#fffafb", raised: "#fbdfe7", hairline: "#f2c3d1",
    text: "#4a2a33", muted: "#8f5f6c", faint: "#b88f9b", accent: "#d94f70", status: "#d94f70",
    grad: "linear-gradient(180deg, #fff4f7 0%, #fde6ed 55%, #f9d4df 100%)", glow: "rgba(217,79,112,.16)",
    pantone: "Inspirada en PANTONE Rose Quartz 13-1520 (fondo) y Honeysuckle 18-2120 (acento)"
  });
  patchPal("matcha", {
    bamboo: null, matchaDust: false, liquid: false, mark: "", tile: null,
    bg: "#e2edd0", surface: "#f8fbf1", raised: "#e9f1db", hairline: "#c9d9ae",
    text: "#3e4f33", muted: "#6b7f5c", faint: "#98aa88", accent: "#7d9a55", status: "#6f8f4e",
    grad: "linear-gradient(180deg, #f3f8ea 0%, #e3eecf 40%, #d0e2b0 75%, #bfd696 100%)", glow: "rgba(125,154,85,.16)",
    pantone: "Inspirada en PANTONE Greenery 15-0343 y Celery Green 13-0532 (matcha latte), con contorno salvia",
    amb: [{ kind: "sift", shape: "tea", colors: ["#9cbf6a", "#b7d38a", "#8fb260"], n: 7, size: [9, 13], dur: [12, 18], o: 0.8 },
          { kind: "rise", shape: "star", colors: ["#ffffff", "#e9f3d8"], n: 10, size: [6, 12], dur: [12, 20], o: 0.9 }]
  });
}
