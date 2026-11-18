/* Escenas y medallas de Inari, Ajisai, Hanabi, Daruma, Onsen, Matsuri, Maneki, Tanabata y Ryū */
import { MEDALS, METAL, arcPt, f, star } from "./medals.js";
import { SHAPES, WC, seeded, svg } from "./shapes.js";
export function ribbon(pts, wf) { // contorno relleno de una línea central con grosor variable
  var L = [], R = [], n = pts.length;
  for (var i = 0; i < n; i++) {
    var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = wf(i / (n - 1)) / 2;
    L.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]); R.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]);
  }
  var s = "M" + L.map(function (p) { return f(p[0]) + " " + f(p[1]); }).join("L");
  return s + "L" + R.reverse().map(function (p) { return f(p[0]) + " " + f(p[1]); }).join("L") + "Z";
}
export function curvePts(fn, n) { var a = []; for (var i = 0; i <= n; i++) a.push(fn(i / n)); return a; }
export function ellipseD(cx, cy, rx, ry) { return "M" + f(cx - rx) + " " + f(cy) + "a" + f(rx) + " " + f(ry) + " 0 1 0 " + f(rx * 2) + " 0a" + f(rx) + " " + f(ry) + " 0 1 0 " + f(-rx * 2) + " 0Z"; }

// ---------- 花火 Hanabi: fuegos artificiales sobre el río en una noche de verano ----------
function fwBurst(cx, cy, R, cols, n, sd) {
  var r = seeded(sd), s = '';
  for (var k = 0; k < n; k++) {
    var a = k / n * Math.PI * 2 + r() * .08, c = cols[k % cols.length];
    s += '<path d="M' + f(cx + Math.cos(a) * R * .18) + ' ' + f(cy + Math.sin(a) * R * .18) + 'L' + f(cx + Math.cos(a) * R * .86) + ' ' + f(cy + Math.sin(a) * R * .86 + R * .04) + '" stroke="' + c + '" stroke-opacity=".28" stroke-width="1"/>';
    for (var j = 0; j < 4; j++) { var t = .55 + j * .15, rr = 1 + j * .55; s += '<circle cx="' + f(cx + Math.cos(a) * R * t) + '" cy="' + f(cy + Math.sin(a) * R * t + R * .06 * t * t) + '" r="' + f(rr) + '" fill="' + c + '" fill-opacity="' + (.35 + j * .2) + '"/>'; }
  }
  return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(R * .9) + '" fill="url(#hg)"/>';
}
function fwWillow(cx, cy, R, c) {
  var s = '<g fill="none" stroke="' + c + '" stroke-linecap="round">';
  for (var k = 0; k < 22; k++) { var a = Math.PI + k / 21 * Math.PI, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * .8; s += '<path d="M' + cx + ' ' + cy + 'Q' + f(x) + ' ' + f(y - R * .1) + ' ' + f(x + Math.cos(a) * R * .15) + ' ' + f(cy + R * (1.1 + Math.abs(Math.cos(a)) * .3)) + '" stroke-opacity=".32" stroke-width="1.2" stroke-dasharray="1 5"/>'; }
  return s + '</g>';
}
export function hanabiScene() {
  var s = '<defs><radialGradient id="hg"><stop offset="0" stop-color="#fff2c4" stop-opacity=".22"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1236"/><stop offset="1" stop-color="#05061a"/></linearGradient></defs>';
  s += fwBurst(60, 250, 74, ["#ff8fb1", "#ffd1e0", "#ff6b9a"], 34, 3) + fwBurst(345, 200, 60, ["#7fe0ff", "#d4f6ff", "#5fb8ff"], 28, 5) +
    fwBurst(350, 560, 50, ["#ffd86b", "#fff3c4"], 24, 7) + fwWillow(200, 420, 150, "#ffcf6b") + fwBurst(50, 540, 40, ["#b9a3ff", "#e6dcff"], 20, 9) + fwBurst(220, 640, 26, ["#ff8fb1", "#ffffff"], 16, 12);
  // orilla con farolillos y el puente
  s += '<path d="M0 720C60 706 120 712 180 704S320 700 400 708V860H0Z" fill="url(#rv)"/>' +
    '<path d="M0 712C40 700 90 702 140 708L140 716H0Z" fill="#05061a"/><path d="M230 704Q300 662 400 690V712H230Z" fill="#05061a"/>' +
    '<g fill="#05061a"><rect x="250" y="684" width="3" height="24"/><rect x="290" y="672" width="3" height="34"/><rect x="330" y="668" width="3" height="38"/><rect x="370" y="674" width="3" height="32"/></g>';
  for (var i = 0; i < 9; i++) s += '<circle cx="' + (12 + i * 14) + '" cy="' + (700 - Math.sin(i / 8 * Math.PI) * 6) + '" r="2.6" fill="#ff8a3d"/><circle cx="' + (12 + i * 14) + '" cy="' + (700 - Math.sin(i / 8 * Math.PI) * 6) + '" r="7" fill="#ff8a3d" fill-opacity=".18"/>';
  // reflejos en el agua
  var r = seeded(4);
  [["#ff8fb1", 70], ["#7fe0ff", 330], ["#ffd86b", 205], ["#ff8a3d", 70]].forEach(function (c, k) { for (var j = 0; j < 7; j++) { var w = 10 + r() * 40, y = 730 + j * 17 + k * 3; s += '<rect x="' + f(c[1] - w / 2 + (r() - .5) * 50) + '" y="' + y + '" width="' + f(w) + '" height="2" rx="1" fill="' + c[0] + '" fill-opacity="' + f(.42 - j * .05) + '"/>'; } });
  return svg(s, 400, 860);
}
var HANABI_D;
var HANABI_FIELD;
var HANABI_EM;
var HANABI_SPARK;

// ---------- 稲荷 Inari: túnel de mil torii bermellón y zorros guardianes ----------
function torii(cx, by, w, h, op) {
  var p = w * .07, k = '<g fill-opacity="' + op + '">';
  k += '<rect x="' + f(cx - w * .36 - p / 2) + '" y="' + f(by - h) + '" width="' + f(p) + '" height="' + f(h) + '" fill="#d9452b"/>';
  k += '<rect x="' + f(cx + w * .36 - p / 2) + '" y="' + f(by - h) + '" width="' + f(p) + '" height="' + f(h) + '" fill="#d9452b"/>';
  k += '<rect x="' + f(cx - w * .36 - p / 2) + '" y="' + f(by - p * 1.4) + '" width="' + f(p) + '" height="' + f(p * 1.4) + '" fill="#1d1712"/><rect x="' + f(cx + w * .36 - p / 2) + '" y="' + f(by - p * 1.4) + '" width="' + f(p) + '" height="' + f(p * 1.4) + '" fill="#1d1712"/>';
  k += '<rect x="' + f(cx - w * .44) + '" y="' + f(by - h * .8) + '" width="' + f(w * .88) + '" height="' + f(p * .7) + '" fill="#d9452b"/>';
  k += '<path d="M' + f(cx - w / 2) + ' ' + f(by - h * .95) + 'Q' + cx + ' ' + f(by - h * .9) + ' ' + f(cx + w / 2) + ' ' + f(by - h * .95) + 'L' + f(cx + w * .52) + ' ' + f(by - h * 1.02) + 'Q' + cx + ' ' + f(by - h * .97) + ' ' + f(cx - w * .52) + ' ' + f(by - h * 1.02) + 'Z" fill="#1d1712"/>';
  k += '<rect x="' + f(cx - w * .47) + '" y="' + f(by - h * .95) + '" width="' + f(w * .94) + '" height="' + f(p * .55) + '" fill="#d9452b"/>';
  return k + '</g>';
}
function kitsune(x, y, sc, flip) {
  // zorro de piedra de Inari sentado de perfil: cola tupida hacia arriba, babero rojo y la joya en la boca
  var W = "#f6f1e7", L = "#d6c9b2", S = "#e6dccb";
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')" stroke-linejoin="round" stroke-linecap="round">' +
    // cola
    '<path d="M-9 -9C-24 -12 -30 -30 -24 -46 -21 -54 -16 -60 -9 -68 -9 -60 -7 -54 -10 -46 -14 -36 -12 -24 -3 -18Z" fill="' + S + '" stroke="' + L + '" stroke-width="1"/>' +
    '<path d="M-9 -68C-12 -62 -14 -58 -13 -52 -11 -57 -9 -62 -9 -68Z" fill="#fff"/><path d="M-20 -24C-23 -32 -22 -40 -18 -47M-15 -22C-17 -30 -16 -38 -13 -44" fill="none" stroke="' + L + '" stroke-width=".8"/>' +
    // cuerpo sentado
    '<path d="M-15 0C-20 -8 -18 -21 -7 -27 -2 -30 1 -36 3 -44L13 -46C15 -37 15 -28 13 -20L13 0Z" fill="' + W + '" stroke="' + L + '" stroke-width="1"/>' +
    '<path d="M-13 -1C-13 -10 -7 -17 1 -15" fill="none" stroke="' + L + '" stroke-width="1"/>' +
    '<path d="M7 -20V-1M7 -1H14" fill="none" stroke="' + L + '" stroke-width="1"/><path d="M-15 0H15" stroke="' + L + '" stroke-width="1"/>' +
    // cabeza: hocico largo hacia delante y orejas altas
    '<path d="M2 -51C3 -58 10 -61 15 -59L27 -53C29 -52 29 -49.5 26.5 -49.5L15 -47.5C10 -45 4 -46 2 -51Z" fill="' + W + '" stroke="' + L + '" stroke-width="1"/>' +
    '<path d="M3.5 -56L2.5 -71 10.5 -60ZM8 -59.5L10 -72 14 -59.5Z" fill="' + W + '" stroke="' + L + '" stroke-width="1"/>' +
    '<path d="M4.5 -59L4 -67 8 -60.5ZM9.5 -60L10.6 -68 12.6 -60Z" fill="#d9452b" fill-opacity=".75"/>' +
    '<path d="M12.5 -55.2Q15 -55.8 17.5 -54" fill="none" stroke="#1d1712" stroke-width="1.1"/><path d="M12 -54Q15 -53.4 18 -53" fill="none" stroke="#d9452b" stroke-width=".7"/>' +
    '<circle cx="27.4" cy="-51" r="1.2" fill="#1d1712"/>' +
    // joya (hōju) en la boca
    '<path d="M18 -48C18 -44 24 -44 24 -48 24 -50 22 -52 21 -53.5 20 -52 18 -50 18 -48Z" fill="#e8b84a" stroke="#8a611a" stroke-width=".6"/>' +
    // babero rojo
    '<path d="M2.5 -42C6 -40 11 -40.5 14 -43.5L12.5 -33C10 -31 6 -32 2.5 -42Z" fill="#d9452b"/><path d="M3.5 -41.2C7 -39.4 11 -39.8 13.6 -42.4" fill="none" stroke="#a8301c" stroke-width=".8"/>' +
    // pedestal de piedra
    '<rect x="-22" y="0" width="42" height="7" fill="#a39886"/><rect x="-25" y="7" width="48" height="14" fill="#8b806f"/><path d="M-22 1H20M-25 8H23" stroke="#c4baa8" stroke-width="1"/></g>';
}
export function inariScene() {
  var s = '';
  for (var i = 7; i >= 0; i--) { var t = i / 7, w = 110 + 330 * Math.pow(1 - t, 1.5), h = w * 1.05; s += torii(200, 860 - t * 190, w, h, (.18 + .5 * (1 - t)).toFixed(2)); }
  s += kitsune(52, 846, 1.35, false) + kitsune(348, 846, 1.35, true);
  return svg(s, 400, 860);
}
var INARI_D = "M32 61L38.5 52 47 44 58 36 51.5 29.5 55 3.5 41 17.5Q32 14.5 23 17.5L9 3.5 12.5 29.5 6 36 17 44 25.5 52Z";
var INARI_FIELD = "M14 10L22.5 19.5 16 25ZM50 10L41.5 19.5 48 25ZM19.5 32Q25 26.5 29.5 31.5Q24.5 34 19.5 32ZM44.5 32Q39 26.5 34.5 31.5Q39.5 34 44.5 32ZM32 19.5C34.2 22.5 34.2 25.5 32 27.5 29.8 25.5 29.8 22.5 32 19.5ZM29 55.5L32 58.6 35 55.5 32 53.8Z";

// ---------- 紫陽花 Ajisai: hortensias en la estación de lluvias ----------
function floret(cx, cy, r, c, rot) { var s = '<g transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + rot + ')">'; for (var k = 0; k < 4; k++) s += '<path d="M0 0C' + f(-r * .55) + ' ' + f(-r * .4) + ' ' + f(-r * .45) + ' ' + f(-r) + ' 0 ' + f(-r) + 'S' + f(r * .55) + ' ' + f(-r * .4) + ' 0 0Z" fill="' + c + '" transform="rotate(' + (k * 90) + ')"/>'; return s + '<circle r="' + f(r * .14) + '" fill="#fff" fill-opacity=".8"/></g>'; }
function hydrangea(cx, cy, R, cols, sd) {
  var r = seeded(sd), s = '';
  for (var i = 0; i < 46; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * R; s += floret(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .85, 8 + r() * 5, cols[(r() * cols.length) | 0], (r() * 90) | 0); }
  return s;
}
function hLeaf(x, y, sc, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><path d="M0 0C-22 -10 -26 -44 0 -70 26 -44 22 -10 0 0Z" fill="#5f9a6a" fill-opacity=".8"/><path d="M0 -4V-64M0 -20L-12 -32M0 -20L12 -32M0 -38L-10 -48M0 -38L10 -48" stroke="#a9d3a6" stroke-opacity=".6" stroke-width="1.2" fill="none"/></g>'; }
export function ajisaiScene() {
  var B = ["#7d8fe0", "#9aa6ee", "#6f7fd6", "#b6a6ec", "#c9b6f2", "#8fb6ea"], P = ["#e6a6d6", "#d79ad8", "#c7a6ee", "#f0bfe0", "#b6a6ec"];
  var s = '<defs>' + WC + '</defs><g filter="url(#wc)">' + hLeaf(40, 830, 1.4, -40) + hLeaf(110, 860, 1.2, 10) + hLeaf(330, 840, 1.5, 35) + hLeaf(380, 760, 1.1, 70) + hLeaf(20, 700, 1, -70) + '</g>';
  s += '<g filter="url(#wc)">' + hydrangea(70, 770, 70, B, 3) + hydrangea(320, 790, 78, P, 5) + hydrangea(392, 660, 46, B, 8) + hydrangea(-10, 640, 44, P, 11) + hydrangea(196, 850, 52, B, 13) + '</g>';
  // gotas de lluvia en el cristal
  var r = seeded(17); s += '<g>';
  for (var i = 0; i < 26; i++) { var x = r() * 400, y = r() * 560, rr = 2 + r() * 4; s += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rr) + '" ry="' + f(rr * 1.2) + '" fill="#ffffff" fill-opacity=".55" stroke="#8a9ad8" stroke-opacity=".35" stroke-width=".8"/><circle cx="' + f(x - rr * .35) + '" cy="' + f(y - rr * .4) + '" r="' + f(rr * .3) + '" fill="#fff"/>'; }
  // caracol en una hoja
  s += '</g><g transform="translate(300 694) scale(1.2)"><path d="M-16 6Q-4 9 14 6Q18 2 14 0H-12Z" fill="#c9b79e"/><path d="M-16 6Q-20 -2 -16 -4" stroke="#c9b79e" stroke-width="2" fill="none"/><circle cx="2" cy="-6" r="10" fill="#c98a5a"/><path d="M2 -6m-6 0a6 6 0 1 1 6 6a3.5 3.5 0 1 1 -3 -4" fill="none" stroke="#8a5a34" stroke-width="1.4"/></g>';
  return svg(s, 400, 860);
}
export function rainTile() { var s = '<g stroke="#7d8fe0" stroke-opacity=".16" stroke-width="1" stroke-linecap="round">'; var r = seeded(2); for (var i = 0; i < 30; i++) { var x = r() * 200, y = r() * 200, l = 10 + r() * 16; s += '<path d="M' + f(x) + ' ' + f(y) + 'l' + f(-l * .25) + ' ' + f(l) + '"/>'; } return svg(s + '</g>', 200, 200); }
var AJISAI_PTS = [[32, 14, 9], [20, 18, 8], [44, 18, 8], [13, 29, 7.5], [51, 29, 7.5], [26, 28, 8.5], [38, 28, 8.5], [32, 40, 8.5], [19, 41, 7.5], [45, 41, 7.5], [26, 51, 7], [38, 51, 7], [32, 58, 5]];
function floretPath(cx, cy, r, rot) { var s = ''; for (var k = 0; k < 4; k++) { var a = (k * 90 + rot) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a); var P = function (x, y) { return f(cx + x * c - y * sn) + " " + f(cy + x * sn + y * c); }; s += "M" + P(0, 0) + "C" + P(-r * .62, -r * .38) + " " + P(-r * .5, -r) + " " + P(0, -r) + "C" + P(r * .5, -r) + " " + P(r * .62, -r * .38) + " " + P(0, 0) + "Z"; } return s; }
var AJISAI_D;
var AJISAI_FIELD;

// ---------- 温泉 Onsen: aguas termales en la nieve, con un macaco ----------
export function onsenScene() {
  var s = '<defs>' + WC + '<linearGradient id="ow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3cc"/><stop offset="1" stop-color="#3f9a9a"/></linearGradient></defs>';
  // ramas nevadas arriba
  s += '<g transform="translate(46 640)"><rect x="-6" y="-10" width="12" height="40" fill="#8a8d92"/><rect x="-16" y="-34" width="32" height="24" rx="2" fill="#9a9da2"/><rect x="-8" y="-28" width="16" height="12" fill="#ffd27a"/><circle cx="0" cy="-22" r="18" fill="#ffd27a" fill-opacity=".18"/>' +
    '<path d="M-26 -34L0 -50 26 -34Z" fill="#7d8086"/><path d="M-28 -34Q0 -56 28 -34Q14 -40 0 -46 -14 -40 -28 -34Z" fill="#fff"/><rect x="-20" y="28" width="40" height="8" fill="#7d8086"/><path d="M-21 28H21" stroke="#fff" stroke-width="3"/></g>';
  // piscina y rocas
  s += '<g filter="url(#wc)"><path d="M-10 700Q200 650 410 700V860H-10Z" fill="url(#ow)"/>';
  [[20, 690, 46, 24], [104, 676, 34, 18], [300, 676, 40, 20], [384, 692, 44, 26], [190, 664, 28, 14], [60, 860, 70, 40], [350, 860, 80, 46]].forEach(function (k) { s += '<ellipse cx="' + k[0] + '" cy="' + k[1] + '" rx="' + k[2] + '" ry="' + k[3] + '" fill="#8a8d92"/><ellipse cx="' + k[0] + '" cy="' + (k[1] - k[3] * .55) + '" rx="' + (k[2] * .85) + '" ry="' + (k[3] * .45) + '" fill="#ffffff"/>'; });
  s += '</g><g fill="none" stroke="#e6fbf8" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"><path d="M60 740H140M200 760H300M120 790H220M260 812H360"/></g>';
  // macaco de las nieves bañándose
  s += '<g transform="translate(236 726)"><ellipse cx="0" cy="8" rx="30" ry="9" fill="#3f9a9a" fill-opacity=".6"/><path d="M-22 6Q-24 -24 0 -28 24 -24 22 6Z" fill="#b08a6a"/><circle cx="0" cy="-34" r="16" fill="#b08a6a"/>' +
    '<path d="M-10 -36Q-10 -26 0 -24 10 -26 10 -36 10 -42 0 -42 -10 -42 -10 -36Z" fill="#e7a3a0"/><circle cx="-4" cy="-35" r="1.4" fill="#2a1a12"/><circle cx="4" cy="-35" r="1.4" fill="#2a1a12"/><path d="M-3 -29Q0 -27 3 -29" stroke="#2a1a12" stroke-width=".9" fill="none"/>' +
    '<path d="M-14 -48Q0 -56 14 -48Q8 -44 0 -45 -8 -44 -14 -48Z" fill="#fff"/><path d="M-22 6Q0 10 22 6V10H-22Z" fill="#3f9a9a" fill-opacity=".8"/></g>';
  return svg(s, 400, 860);
}
var ONSEN_D;
var ONSEN_FIELD = "M9 40.6Q32 36.5 55 40.6Q53.5 56.8 32 57.6 10.5 56.8 9 40.6Z";

// ---------- 龍 Ryū: el dragón entre las nubes, oro sobre jade oscuro ----------
function cloudSwirl(x, y, s, c, op) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="' + c + '" stroke-opacity="' + op + '" stroke-width="1.6" stroke-linecap="round"><path d="M0 0C-4 -14 12 -22 20 -12 26 -24 46 -22 46 -8 58 -14 70 -2 62 8H-2C-12 8 -12 -2 0 0Z" fill="#0e3430" fill-opacity=".92"/><path d="M14 -2C12 -8 20 -10 22 -5M38 -2C37 -9 46 -10 47 -4"/></g>'; }
export function catmull(P, n) {
  var out = [];
  for (var i = 0; i < P.length - 1; i++) {
    var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (var k = 0; k < n; k++) { var t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(function (j) { return .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3); })); }
  }
  out.push(P[P.length - 1]); return out;
}
// cabeza de dragón mirando a la derecha; origen en el cuello
var DRAGON_HEAD = '<path d="M2 -14L-14 -24 -6 -9 -22 -12 -4 -1 -20 4 -2 8 -14 18 2 14Z" fill="#4fc3a1"/>' +
  '<path d="M12 -18Q-4 -32 -22 -44Q-2 -36 18 -21ZM20 -20Q8 -38 -6 -52Q14 -40 25 -21Z" fill="url(#rg)"/>' +
  '<path d="M0 -14C10 -21 24 -23 34 -18L48 -16C56 -15 61 -12 63 -7L57 -5 63 -1C59 5 51 7 44 4L37 8 50 14C42 19 30 19 20 15L0 14Z" fill="url(#rg)" stroke="#5a3a08" stroke-width="1"/>' +
  '<path d="M38 8L41 11 43 7.5 46 11.5 48 8.5" fill="none" stroke="#fff6d0" stroke-width="1"/><path d="M22 -16Q30 -14 34 -18" fill="none" stroke="#5a3a08" stroke-width="1.2"/>' +
  '<circle cx="30" cy="-10" r="3.2" fill="#fff6d0"/><circle cx="30.6" cy="-10" r="1.6" fill="#1a1206"/>' +
  '<path d="M58 -4Q86 8 78 36Q74 50 84 62M50 10Q66 30 54 56" fill="none" stroke="#e6b64a" stroke-width="1.4" stroke-linecap="round"/>';
export function ryuScene() {
  var pts = catmull([[132, 640], [70, 618], [30, 540], [44, 440], [120, 360], [250, 320], [350, 260], [430, 170]], 16);
  var wf = function (t) { return 30 * (1 - t * .75); };
  var body = ribbon(pts, wf);
  var s = '<defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".4" stop-color="#d9a33c"/><stop offset=".7" stop-color="#8a5a12"/><stop offset="1" stop-color="#f2c862"/></linearGradient>' +
    '<pattern id="sc" width="9" height="7" patternUnits="userSpaceOnUse"><path d="M0 7A4.5 4.5 0 0 1 9 7" fill="none" stroke="#5a3a08" stroke-opacity=".5" stroke-width=".9"/></pattern>' +
    '<radialGradient id="pg"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#bff3df"/><stop offset="1" stop-color="#4fc3a1" stop-opacity="0"/></radialGradient></defs>';
  s += '<circle cx="300" cy="640" r="80" fill="url(#pg)" fill-opacity=".6"/><circle cx="300" cy="640" r="15" fill="#eafff6"/><path d="M285 632Q290 606 300 596Q310 606 315 632" fill="#bff3df" fill-opacity=".5"/>';
  var fins = '', n = pts.length;
  for (var i = 2; i < n - 4; i += 3) { var a = pts[i], b = pts[i + 2], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = wf(i / (n - 1)) / 2; fins += 'M' + f(a[0] + dy / l * w) + ' ' + f(a[1] - dx / l * w) + 'L' + f(a[0] + dy / l * (w + 10) - dx / l * 5) + ' ' + f(a[1] - dx / l * (w + 10) - dy / l * 5) + 'L' + f(b[0] + dy / l * w) + ' ' + f(b[1] - dx / l * w) + 'Z'; }
  s += '<path d="' + fins + '" fill="#4fc3a1" fill-opacity=".75"/><path d="' + body + '" fill="url(#rg)"/><path d="' + body + '" fill="url(#sc)"/>';
  // garra
  s += '<g transform="translate(64 600) rotate(20)" fill="url(#rg)" stroke="#5a3a08" stroke-width=".8"><path d="M-6 0L6 0 8 22 -8 22Z"/><path d="M-8 22L-18 34 -12 24ZM-2 23L-4 38 2 24ZM6 22L12 36 9 22Z"/></g>';
  s += '<g transform="translate(130 640) scale(1.15)">' + DRAGON_HEAD + '</g>';
  s += cloudSwirl(250, 230, 2, "#bff3df", .45) + cloudSwirl(-20, 470, 2.2, "#bff3df", .4) + cloudSwirl(40, 820, 2.8, "#bff3df", .5) + cloudSwirl(270, 830, 2.4, "#bff3df", .4) + cloudSwirl(330, 400, 1.6, "#bff3df", .35);
  return svg(s, 400, 860);
}
var RYU_PTS;
var RYU_D;
var RYU_EM;

// ---------- 祭 Matsuri: farolillos chōchin y puestos de feria al anochecer ----------
function chochin(x, y, s, c) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><circle cx="0" cy="18" r="26" fill="' + c + '" fill-opacity=".18"/><path d="M0 -6V0" stroke="#2a1a14" stroke-width="1.2"/><rect x="-7" y="0" width="14" height="4" rx="1" fill="#1d1712"/>' +
    '<path d="M-7 4C-15 8 -15 28 -7 32H7C15 28 15 8 7 4Z" fill="' + c + '"/><path d="M-11 10H11M-12.5 16H12.5M-12.5 22H12.5M-11 28H11" stroke="#00000033" stroke-width=".8"/>' +
    '<rect x="-7" y="32" width="14" height="4" rx="1" fill="#1d1712"/><path d="M-1 36V42M1 36V42" stroke="#d9452b" stroke-width=".8"/></g>';
}
export function matsuriScene() {
  var s = '';
  [[0, 330, 400, 370, 8], [0, 560, 400, 600, 8]].forEach(function (L, li) {
    s += '<path d="M' + L[0] + ' ' + L[1] + 'Q200 ' + L[3] + ' ' + L[2] + ' ' + L[1] + '" fill="none" stroke="#2a1a14" stroke-width="1.2"/>';
    for (var i = 0; i < L[4]; i++) { var t = (i + .5) / L[4], x = L[0] + (L[2] - L[0]) * t, y = (1 - t) * (1 - t) * L[1] + 2 * t * (1 - t) * L[3] + t * t * L[1]; s += chochin(x, y + 5, li ? 1 : .7, (i + li) % 3 === 2 ? "#fff3dc" : "#e8553a"); }
  });
  // puestos (yatai) con noren
  [[0, 160], [150, 110], [270, 140]].forEach(function (y, k) {
    var x = y[0], w = y[1], b = 860, h = 120;
    s += '<rect x="' + x + '" y="' + (b - h) + '" width="' + w + '" height="' + h + '" fill="#1a0f1c"/><path d="M' + (x - 8) + ' ' + (b - h) + 'L' + (x + w / 2) + ' ' + (b - h - 30) + 'L' + (x + w + 8) + ' ' + (b - h) + 'Z" fill="#120a14"/>' +
      '<rect x="' + (x + 6) + '" y="' + (b - h + 30) + '" width="' + (w - 12) + '" height="40" fill="#ffb05c" fill-opacity=".85"/>';
    for (var n = 0; n < Math.floor(w / 26); n++) s += '<rect x="' + (x + 8 + n * 26) + '" y="' + (b - h) + '" width="22" height="26" fill="' + (n % 2 ? "#e8553a" : "#f4ead8") + '"/>';
  });
  return svg(s, 400, 860);
}
var MATSURI_D = "M27 3H37V7H41V11.5C51 15 54.5 24 54.5 33S51 51 41 54.5V59H37V62H27V59H23V54.5C13 51 9.5 42 9.5 33S13 15 23 11.5V7H27Z";
var MATSURI_FIELD = "M23 14.5H41C49 18 51.5 25 51.5 33S49 48 41 51.5H23C15 48 12.5 41 12.5 33S15 18 23 14.5Z";
var MATSURI_GOLD;
var MATSURI_EM = '<g fill="none" stroke-width="1" stroke-opacity=".9"><path d="M13.5 21H50.5M12.6 27H51.4M12.6 39H51.4M13.5 45H50.5"/></g>';
// ---------- だるま Daruma: muñecos de la perseverancia (七転び八起き) ----------
var DARUMA_BODY = "M32 4C47 4 56 18 56 36 56 52 46 61 32 61 18 61 8 52 8 36 8 18 17 4 32 4Z";
var DARUMA_FACE = "M32 14.5C42.5 14.5 48.5 21 48.5 30 48.5 39.5 41 44.5 32 44.5 23 44.5 15.5 39.5 15.5 30 15.5 21 21.5 14.5 32 14.5Z";
function darumaFace(eyes) {
  return '<path d="M18 23Q22 17.5 29 21.5Q23 20.5 19.5 25ZM46 23Q42 17.5 35 21.5Q41 20.5 44.5 25Z" fill="#1a1412"/>' +
    '<circle cx="25" cy="29" r="4.2" fill="#fff" stroke="#1a1412" stroke-width="1"/><circle cx="39" cy="29" r="4.2" fill="#fff" stroke="#1a1412" stroke-width="1"/>' +
    (eyes > 0 ? '<circle cx="25" cy="29" r="2.6" fill="#1a1412"/>' : '') + (eyes > 1 ? '<circle cx="39" cy="29" r="2.6" fill="#1a1412"/>' : '') +
    '<path d="M32 33.5C28 33.5 22 35 19.5 39.5 24 37.5 28 37 32 38.2 36 37 40 37.5 44.5 39.5 42 35 36 33.5 32 33.5Z" fill="#1a1412"/>';
}
function daruma(x, y, s, col, eyes) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ') translate(-32 -61)"><ellipse cx="32" cy="61" rx="22" ry="3" fill="#000" fill-opacity=".12"/>' +
    '<path d="' + DARUMA_BODY + '" fill="' + col + '"/><path d="M14 22C18 10 28 6 36 7 26 10 18 16 14 22Z" fill="#fff" fill-opacity=".28"/>' +
    '<path d="' + DARUMA_FACE + '" fill="#fbf6ec"/>' + darumaFace(eyes) +
    '<path d="M20 50Q32 56 44 50M24 55Q32 58 40 55" fill="none" stroke="#e8b84a" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="51" r="2.2" fill="#e8b84a"/></g>';
}
export function darumaScene() {
  var s = '<g opacity=".13">' + daruma(200, 900, 7.6, "#c42a2a", 1) + '</g>';
  // estantería del templo con daruma de todos los tamaños
  s += '<rect x="0" y="732" width="400" height="10" fill="#8a5a34"/><rect x="0" y="742" width="400" height="4" fill="#6a4226"/>';
  [[36, 732, .9, "#e8553a", 1], [96, 732, 1.2, "#b8222a", 2], [164, 732, .75, "#f06a4a", 1], [222, 732, 1, "#d23a2a", 1], [292, 732, .8, "#e8b84a", 2], [356, 732, 1.1, "#9a1a22", 0]].forEach(function (d) { s += daruma(d[0], d[1], d[2], d[3], d[4]); });
  [[50, 860, 1.9, "#c42a2a", 1], [170, 860, 1.4, "#e8553a", 2], [280, 860, 1.7, "#d23a2a", 1], [384, 860, 1.3, "#9a1a22", 1]].forEach(function (d) { s += daruma(d[0], d[1], d[2], d[3], d[4]); });
  // cuerdas de deseos (omikuji) arriba a los lados
  return svg(s, 400, 860);
}
var DARUMA_EXTRA = '<path d="M18 23Q22 17.5 29 21.5Q23 20.5 19.5 25ZM46 23Q42 17.5 35 21.5Q41 20.5 44.5 25Z" fill="#1a1412"/><circle cx="25" cy="29" r="3.6" fill="#fff" stroke="#1a1412" stroke-width=".9"/><circle cx="39" cy="29" r="3.6" fill="#fff" stroke="#1a1412" stroke-width=".9"/><circle cx="25" cy="29" r="2.2" fill="#1a1412"/>' +
  '<path d="M32 33.5C28 33.5 22 35 19.5 39.5 24 37.5 28 37 32 38.2 36 37 40 37.5 44.5 39.5 42 35 36 33.5 32 33.5Z" fill="#1a1412"/>';

// ---------- 七夕 Tanabata: la fiesta de las estrellas, bambú con deseos de papel ----------
function tanzakuBranch(x, y, sc, flip, sd) {
  var r = seeded(sd), cols = ["#ff8fb1", "#ffd86b", "#7fe0ff", "#b6f09a", "#c9a6ff", "#ffffff", "#ff9a5a"];
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')">';
  s += '<path d="M0 0Q30 -120 90 -330" stroke="#5f9a6a" stroke-width="7" fill="none"/>';
  for (var k = 0; k < 7; k++) { var t = .2 + k * .11, bx = 30 * t * 2 + t * t * 60, by = -330 * t; s += '<path d="M' + f(bx) + ' ' + f(by) + 'h-2v-2h4z" fill="#3f7a4a"/>'; var len = 40 + r() * 40, dir = k % 2 ? 1 : -1; s += '<path d="M' + f(bx) + ' ' + f(by) + 'Q' + f(bx + dir * len * .5) + ' ' + f(by - 18) + ' ' + f(bx + dir * len) + ' ' + f(by + 6) + '" stroke="#5f9a6a" stroke-width="2" fill="none"/>';
    for (var j = 0; j < 4; j++) { var lx = bx + dir * len * (.3 + j * .22), ly = by - 6 + j * 3; s += '<path d="M' + f(lx) + ' ' + f(ly) + 'q' + (dir * 10) + ' 8 ' + (dir * 4) + ' 22q' + (-dir * 8) + ' -10 ' + (-dir * 4) + ' -22z" fill="#7cbf6a" fill-opacity=".85"/>';
      if (j % 2 === 0) s += '<path d="M' + f(lx) + ' ' + f(ly) + 'v8" stroke="#e6e0d0" stroke-width=".6"/><rect x="' + f(lx - 3.5) + '" y="' + f(ly + 8) + '" width="7" height="22" fill="' + cols[(r() * cols.length) | 0] + '" transform="rotate(' + f((r() - .5) * 18) + ' ' + f(lx) + ' ' + f(ly + 8) + ')"/>'; }
  }
  // farolillo de papel fukinagashi
  s += '<g transform="translate(70 -250)"><path d="M0 0v6" stroke="#e6e0d0" stroke-width=".8"/><circle cx="0" cy="14" r="9" fill="#ff8fb1"/>';
  for (var q = 0; q < 7; q++) s += '<path d="M' + (-7 + q * 2.3) + ' 21q' + ((q % 2 ? 3 : -3)) + ' 20 0 44" stroke="' + cols[q] + '" stroke-width="2.2" fill="none"/>';
  return s + '</g></g>';
}
export function tanabataScene() {
  var r = seeded(23), s = '<defs><linearGradient id="mw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#e6dcff" stop-opacity=".22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="st"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff6d0" stop-opacity=".8"/><stop offset="1" stop-color="#fff6d0" stop-opacity="0"/></radialGradient></defs>';
  // la Vía Láctea en diagonal
  s += '<path d="M-60 520L420 40 480 140 0 640Z" fill="url(#mw)"/>';
  for (var i = 0; i < 260; i++) { var t = r(), w = (r() - .5) * (r() * 120); var x = -40 + t * 480 + w * .7, y = 600 - t * 520 + w * .7; s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(.4 + r() * 1.2) + '" fill="#fff" fill-opacity="' + f(.3 + r() * .6) + '"/>'; }
  // Orihime (Vega) y Hikoboshi (Altair) a cada lado del río
  s += '<circle cx="80" cy="330" r="22" fill="url(#st)"/><circle cx="80" cy="330" r="3" fill="#fff"/><circle cx="320" cy="460" r="22" fill="url(#st)"/><circle cx="320" cy="460" r="3" fill="#fff"/>';
  s += tanzakuBranch(-10, 860, 1.25, false, 3) + tanzakuBranch(410, 870, 1.1, true, 8);
  return svg(s, 400, 860);
}
var TANA_D;
var TANA_FIELD;
var TANA_FLOWERS;
// ---------- 招き猫 Maneki: el gato de la suerte que llama a la fortuna ----------
var MANEKI_D = "M14 22L17 5 27 13Q32 12 37 13L47 5 50 22Q53 30 48 36L50 40Q54 48 52 56L54 61H10L12 56Q10 48 14 40L16 36Q11 30 14 22Z M14.5 45L6 45 3.5 30Q3.5 24.5 8.5 24.5 13.5 24.5 13.5 30L13 40Z";
var MANEKI_FIELD = "M15.5 37Q32 43.5 48.5 37L49.2 41.2Q32 47.8 14.8 41.2Z M18.6 9.5L25 14.2 18.2 18Z M45.4 9.5L39 14.2 45.8 18Z";
function maneki(x, y, s, flip) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ') translate(-32 -61)">' +
    '<path d="' + MANEKI_D + '" fill="#fffdf8" stroke="#d8cbb6" stroke-width=".8"/><path d="' + MANEKI_FIELD + '" fill="#d8392b"/>' +
    '<path d="M21 26Q24 23.5 27 26M37 26Q40 23.5 43 26" fill="none" stroke="#2a1a12" stroke-width="1.2" stroke-linecap="round"/><path d="M30.5 29.5H33.5L32 31Z" fill="#e98fa0"/><path d="M32 31Q30 33 28 32M32 31Q34 33 36 32M17 29H25M17 31.5 25 30.5M39 29H47M39 30.5 47 31.5" fill="none" stroke="#2a1a12" stroke-width=".6"/>' +
    '<ellipse cx="22" cy="20" rx="4" ry="2.5" fill="#f2a14a" fill-opacity=".8"/><ellipse cx="43" cy="44" rx="5" ry="3.5" fill="#2a2a2a" fill-opacity=".75"/>' +
    '<circle cx="32" cy="45" r="3.4" fill="#e8b84a"/><path d="M29 45H35" stroke="#8a611a" stroke-width=".6"/>' +
    '<ellipse cx="40" cy="54" rx="6" ry="8" fill="#e8b84a" stroke="#8a611a" stroke-width=".6"/><path d="M37 50H43M37 53H43M37 56H43" stroke="#8a611a" stroke-width=".5"/></g>';
}
function koban(x, y, s, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + s + ')"><ellipse rx="10" ry="14" fill="#e8b84a" stroke="#8a611a" stroke-width="1"/><ellipse rx="7.5" ry="11" fill="none" stroke="#fff3c4" stroke-opacity=".6" stroke-width=".8"/><path d="M-5 -4H5M-5 0H5M-5 4H5" stroke="#8a611a" stroke-width=".8"/></g>'; }
export function manekiScene() {
  var s = '';
  // gradas con cientos de gatitos, como en el templo Gōtoku-ji
  for (var row = 0; row < 4; row++) { var y = 640 + row * 46, n = 9 - (row % 2); s += '<rect x="0" y="' + (y + 1) + '" width="400" height="6" fill="#c9a77a" fill-opacity="' + (.35 + row * .12) + '"/>'; for (var c = 0; c < n; c++) s += '<g opacity="' + (.35 + row * .14) + '">' + maneki(24 + c * 44 + (row % 2) * 22, y, .55, c % 2) + '</g>'; }
  // omamori colgando a los lados
  [[18, 230, "#d8392b"], [382, 300, "#e8b84a"], [16, 470, "#e98fb1"], [384, 520, "#d8392b"]].forEach(function (o) { s += '<path d="M' + o[0] + ' 0V' + o[1] + '" stroke="#c99a3a" stroke-opacity=".5" stroke-width="1"/><g transform="translate(' + o[0] + ' ' + o[1] + ')"><path d="M-8 0H8V22L0 26 -8 22Z" fill="' + o[2] + '"/><path d="M-5 4H5M-5 8H5" stroke="#fff3c4" stroke-width="1"/><path d="M-2 26V36M2 26V36" stroke="' + o[2] + '" stroke-width="1.4"/></g>'; });
  s += '<rect x="150" y="826" width="230" height="34" rx="10" fill="#c0321f"/><path d="M150 836H380" stroke="#e8b84a" stroke-width="2"/><circle cx="160" cy="830" r="4" fill="#e8b84a"/><circle cx="370" cy="830" r="4" fill="#e8b84a"/>';
  s += maneki(268, 828, 2.9, false) + maneki(70, 846, 1.6, true);
  var r = seeded(31); for (var i = 0; i < 9; i++) s += koban(130 + r() * 60 + (i % 3) * 10, 846 - (i % 3) * 8 - r() * 6, .8, (r() - .5) * 90);
  return svg(s, 400, 860);
}
export function kobanTile() { var s = '';
  [[100, 30, 20], [24, 110, -15], [170, 130, 35], [120, 190, -5]].forEach(function (p) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')" fill="#d8a0a0" fill-opacity=".16"><ellipse cx="0" cy="3" rx="5" ry="4"/><circle cx="-5" cy="-3" r="2"/><circle cx="-1.7" cy="-5.5" r="2"/><circle cx="1.7" cy="-5.5" r="2"/><circle cx="5" cy="-3" r="2"/></g>'; }); [[30, 30, 15], [130, 90, -20], [70, 150, 30], [170, 180, 5]].forEach(function (p) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')"><ellipse rx="10" ry="14" fill="none" stroke="#c99a3a" stroke-opacity=".18" stroke-width="1.2"/><path d="M-5 -4H5M-5 0H5M-5 4H5" stroke="#c99a3a" stroke-opacity=".14"/></g>'; }); return svg(s, 200, 200); }
var RYU_PEARL;
var TANA_RIBBONS;

export function init() {
  HANABI_D = (function () { var s = star(16, 31, 16.5, 32, 32, 0); return s; })();
  HANABI_FIELD = ellipseD(32, 32, 13.5, 13.5);
  HANABI_EM = (function () { var s = '<g fill="none" stroke-width=".9" stroke-linecap="round">'; for (var k = 0; k < 16; k++) { var a = k * 22.5 - 90, p = arcPt(32, 32, 16.5, a), q = arcPt(32, 32, 27, a); s += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(q[0]) + ' ' + f(q[1]) + '"/>'; } return s + '</g>'; })();
  HANABI_SPARK = (function () { var s = '', cols = ["#ff8fb1", "#7fe0ff", "#ffd86b", "#c9b2ff"]; for (var k = 0; k < 12; k++) { var a = k * 30 * Math.PI / 180; for (var j = 1; j <= 3; j++) s += '<circle cx="' + f(32 + Math.cos(a) * j * 3.6) + '" cy="' + f(32 + Math.sin(a) * j * 3.6) + '" r="' + (j * .45 + .3) + '" fill="' + cols[k % 4] + '"/>'; } return s + '<circle cx="32" cy="32" r="1.6" fill="#fff6d0"/>'; })();
  AJISAI_D = AJISAI_PTS.map(function (p, i) { return floretPath(p[0], p[1], p[2], (i * 23) % 90) + ellipseD(p[0], p[1], p[2] * .55, p[2] * .55); }).join("");
  AJISAI_FIELD = AJISAI_PTS.map(function (p, i) { return floretPath(p[0], p[1], p[2] * .7, (i * 23) % 90); }).join("");
  ONSEN_D = ribbon(curvePts(function (t) { return [20 + Math.sin(t * 6.3) * 3, 35 - t * 31]; }, 24), function (t) { return 5.2 - t * 3.4; }) +
    ribbon(curvePts(function (t) { return [32 - Math.sin(t * 6.3) * 3, 34 - t * 32]; }, 24), function (t) { return 5.6 - t * 3.6; }) +
    ribbon(curvePts(function (t) { return [44 + Math.sin(t * 6.3) * 3, 35 - t * 31]; }, 24), function (t) { return 5.2 - t * 3.4; }) +
    "M5 37Q32 32 59 37Q58 60 32 61 6 60 5 37Z";
  // Medalla: dragón enroscado (丸龍) alrededor de la perla
  RYU_PTS = curvePts(function (t) { var a = (-90 + t * 290) * Math.PI / 180, r = 21.5 - t * 6; return [32 + Math.cos(a) * r, 34 + Math.sin(a) * r]; }, 60);
  RYU_D = (function () {
    var s = ribbon(RYU_PTS, function (t) { return 10 - t * 8; });
    for (var i = 6; i < 56; i += 5) { var a = RYU_PTS[i], b = RYU_PTS[i + 3], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), w = (10 - i / 60 * 8) / 2; s += 'M' + f(a[0] - dy / l * w * .7) + ' ' + f(a[1] + dx / l * w * .7) + 'L' + f(a[0] - dy / l * (w + 3.6) + dx / l * 2) + ' ' + f(a[1] + dx / l * (w + 3.6) + dy / l * 2) + 'L' + f(b[0] - dy / l * w * .7) + ' ' + f(b[1] + dx / l * w * .7) + 'Z'; }
    // cabeza mirando a la izquierda (hacia abajo, a la perla) y cuernos
    return s + "M36 8.5L33 3.5 27 4 20 5.5 13.5 8.5 11 12.5 14.5 14 12.5 17 17.5 17.5 21 16 25 18.5 31 17 36 15Z M30 4.5L37 -0.5 34.5 5.5ZM33 5.5L41.5 2 37.5 7.5Z";
  })();
  RYU_EM = (function () { var s = '<g fill="none" stroke-width=".6" stroke-opacity=".8">'; for (var i = 6; i < 58; i += 3) { var p = RYU_PTS[i], q = RYU_PTS[i + 1], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), w = (10 - i / 60 * 8) / 2 * .75; s += '<path d="M' + f(p[0] + dy / l * w) + ' ' + f(p[1] - dx / l * w) + 'Q' + f(q[0] + dx / l * 1.4) + ' ' + f(q[1] + dy / l * 1.4) + ' ' + f(p[0] - dy / l * w) + ' ' + f(p[1] + dx / l * w) + '"/>'; } return s + '</g><circle cx="22.5" cy="9.8" r="1.2"/><path d="M12 13Q8 18 10 24M14.5 15.5Q12 21 15 26" fill="none" stroke-width=".7"/>'; })();
  MATSURI_GOLD = (function () {
    var s = '';
    for (var k = 0; k < 3; k++) { s += '<path d="M0 -8.4A8.4 8.4 0 0 1 7.27 4.2 4.2 4.2 0 0 0 0 0 4.2 4.2 0 0 1 0 -8.4Z" transform="translate(32 33) rotate(' + (k * 120) + ')"/>'; }
    return s;
  })();
  TANA_D = ellipseD(32, 15, 12, 12) + (function () { var s = ""; for (var q = 0; q < 6; q++) { var x0 = 23 + q * 3.6; s += ribbon(curvePts(function (t) { return [x0 + Math.sin(t * 5 + q) * 2.2 + (q - 2.5) * t * 2.2, 25 + t * 37]; }, 16), function (t) { return 3.2 - t * 1.4; }); } return s; })() + "M30.5 0H33.5V4H30.5Z";
  TANA_FIELD = ellipseD(32, 15, 9.4, 9.4);
  TANA_FLOWERS = (function () { var s = '', c = ["#ff8fb1", "#ffd86b", "#ffffff", "#ffb3cf"]; [[32, 15, 3], [26, 11, 2.4], [38, 11, 2.4], [26, 19.5, 2.4], [38, 19.5, 2.4], [32, 7.5, 2], [32, 22.5, 2], [23.5, 15, 2], [40.5, 15, 2]].forEach(function (p, i) { s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + (p[2] / 4) + ')">' + '<path d="M0 -4C1.5 -4 1.5 -1.5 0 0 -1.5 -1.5 -1.5 -4 0 -4ZM4 0C4 1.5 1.5 1.5 0 0 1.5 -1.5 4 -1.5 4 0ZM0 4C-1.5 4 -1.5 1.5 0 0 1.5 1.5 1.5 4 0 4ZM-4 0C-4 -1.5 -1.5 -1.5 0 0 -1.5 1.5 -4 1.5 -4 0Z" fill="' + c[i % 4] + '"/></g>'; }); return s; })();
  SHAPES.coin = function (c) { return '<ellipse cx="12" cy="12" rx="7.5" ry="10.5" fill="' + c + '" stroke="#8a611a" stroke-width=".8"/><path d="M8.5 9H15.5M8.5 12H15.5M8.5 15H15.5" stroke="#8a611a" stroke-width=".6"/>'; };
  // perla del dragón: esfera de jade con su llama, encima del cuerpo
  RYU_PEARL = (function () { var p = [32, 36, 6.4]; return '<defs><radialGradient id="pr" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#c9f5e3"/><stop offset=".85" stop-color="#3fae8a"/><stop offset="1" stop-color="#1f6a52"/></radialGradient></defs>' +
    '<g fill="url(#g)" filter="url(#rel)"><path d="M' + (p[0] - p[2] - 1.5) + ' ' + p[1] + 'Q' + (p[0] - p[2] - 3) + ' ' + (p[1] - p[2] - 4) + ' ' + p[0] + ' ' + (p[1] - p[2] - 6) + 'Q' + (p[0] + p[2] + 3) + ' ' + (p[1] - p[2] - 4) + ' ' + (p[0] + p[2] + 1.5) + ' ' + p[1] + 'Z"/></g>' +
    '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] + .8) + '" fill="url(#g)" filter="url(#rel)"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="url(#pr)"/><ellipse cx="' + (p[0] - 2) + '" cy="' + (p[1] - 2.4) + '" rx="1.8" ry="1.1" fill="#fff" opacity=".9"/>'; })();
  // cintas de colores del fukinagashi (Tanabata), en esmalte por encima del metal
  TANA_RIBBONS = (function () { var cols = ["#ff8fb1", "#ffd86b", "#7fe0ff", "#b6f09a", "#c9a6ff", "#ff9a5a"], s = ''; for (var q = 0; q < 6; q++) { var x0 = 23 + q * 3.6; s += '<path d="' + ribbon(curvePts(function (t) { return [x0 + Math.sin(t * 5 + q) * 2.2 + (q - 2.5) * t * 2.2, 27 + t * 33]; }, 16), function (t) { return 1.5 - t * .7; }) + '" fill="' + cols[q] + '" fill-opacity=".9"/>'; } return s; })();
  METAL.vermilion = ["#ffe2d6", "#f2876a", "#d9452b", "#8a2414", "#e8664a", "#5a160c"];
  Object.assign(MEDALS, {
    hanabi: { metal: "gold", shape: HANABI_D, fieldPath: HANABI_FIELD, enamel: "#141a4a", enamelExtra: HANABI_SPARK, em: HANABI_EM },
    inari: { metal: "pearl", shape: INARI_D, fieldPath: INARI_FIELD, enamel: "#d23a22",
      em: '<path d="M27 46Q32 49 37 46M23 40Q27 41 29 44M41 40Q37 41 35 44" fill="none" stroke-width=".8"/>', gold: '<circle cx="32" cy="11.5" r="1.5"/><circle cx="32" cy="57" r=".9"/>' },
    ajisai: { metal: "silver", shape: AJISAI_D, fieldPath: AJISAI_FIELD, enamel: "#7d8fe0",
      enamelExtra: '<rect width="64" height="64" fill="url(#aj)"/><defs><linearGradient id="aj" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a6b6ff"/><stop offset=".5" stop-color="#8f7fe6" stop-opacity=".6"/><stop offset="1" stop-color="#e6a6d6"/></linearGradient></defs>',
      em: AJISAI_PTS.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.1"/>'; }).join("") },
    onsen: { metal: "copper", shape: ONSEN_D, fieldPath: ONSEN_FIELD, enamel: "#3fa3a0",
      enamelExtra: '<path d="M12 46H52M16 51H48" stroke="#c9f2ee" stroke-opacity=".6" stroke-width="1"/>' },
    ryu: { metal: "gold", shape: RYU_D, noField: true, em: RYU_EM, over: RYU_PEARL },
    matsuri: { metal: "lacquer", shape: MATSURI_D, fieldPath: MATSURI_FIELD, enamel: "#d9452b", em: MATSURI_EM, gold: MATSURI_GOLD },
    daruma: { metal: "vermilion", shape: DARUMA_BODY, fieldPath: DARUMA_FACE, enamel: "#fbf6ec", enamelExtra: DARUMA_EXTRA,
      gold: '<path d="M18 50Q32 57 46 50" fill="none" stroke-width="1.6" stroke-linecap="round"/><path d="M22 55.5Q32 59 42 55.5" fill="none" stroke-width="1.2" stroke-linecap="round"/><circle cx="32" cy="51.5" r="2.4"/><path d="M14 40Q12 46 15 50M50 40Q52 46 49 50" fill="none" stroke-width="1" stroke-linecap="round"/>' },
    tanabata: { metal: "silver", shape: TANA_D, fieldPath: TANA_FIELD, enamel: "#2a2f7a", enamelExtra: TANA_FLOWERS, over: TANA_RIBBONS,
      gold: '<path d="' + star(5, 3.4, 1.4, 49, 9, 0) + '"/><path d="' + star(5, 2.6, 1.1, 14, 6, 0) + '"/>' },
    maneki: { metal: "pearl", shape: MANEKI_D, fieldPath: MANEKI_FIELD, enamel: "#d8392b",
      em: '<path d="M21 26Q24 23.5 27 26M37 26Q40 23.5 43 26M32 31Q30 33 28 32M32 31Q34 33 36 32M17 29H25M39 29H47" fill="none" stroke-width=".8" stroke-linecap="round"/>',
      gold: '<circle cx="32" cy="45.5" r="3.2"/><ellipse cx="41" cy="53.5" rx="5" ry="6.5"/><path d="M6.5 30v-3M9 29.5v-4M11.5 30v-3" fill="none" stroke-width=".9"/>' }
  });
}
