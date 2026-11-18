/* 町 Machi y 芸者 Geisha (y alta de las paletas nuevas) */
import { KOI_INK_DEFS } from "./koi.js";
import { MEDALS, f, rectAt, star } from "../medals.js";
import { MINCHO } from "./varias.js";
import { akibaBack2, akibaFx2, shibuyaBack2, shibuyaFx2 } from "./akiba-shibuya.js";
import { brushPath } from "./edo.js";
import { catmull, ellipseD } from "../scenes-v5.js";
import { seeded, svg, washi } from "../shapes.js";
function insertPal(afterId, obj) { var P = window.KANAME_PALETTES, i = P.length - 1; for (var k = 0; k < P.length; k++) if (P[k].id === afterId) i = k; P.splice(i + 1, 0, obj); }
// Animación SMIL dentro del SVG: la variante k se ve durante su franja de n
export function smilCycle(n, k, dur) { var v = [], kt = []; for (var i = 0; i < n; i++) { v.push(i === k ? 1 : 0); kt.push(f(i / n)); } return '<animate attributeName="opacity" values="' + v.join(";") + '" keyTimes="' + kt.join(";") + '" calcMode="discrete" dur="' + dur + 's" repeatCount="indefinite"/>'; }
export var SANS = "Hiragino Sans, Noto Sans CJK JP, sans-serif";

// ---------- chicas anime para las pantallas (retrato 100×130) ----------
function animeGirl(o) {
  var H = o.hair, HD = o.hairD || H, s = '<rect width="100" height="130" fill="' + o.bg + '"/>';
  s += '<circle cx="82" cy="22" r="40" fill="' + o.bg2 + '" fill-opacity=".55"/><circle cx="12" cy="104" r="32" fill="' + o.bg2 + '" fill-opacity=".4"/>';
  [[14, 20, 5], [88, 62, 4], [18, 62, 3], [80, 112, 4]].forEach(function (p) { s += '<path d="' + star(4, p[2], p[2] * .25, p[0], p[1], 0) + '" fill="#fff" fill-opacity=".9"/>'; });
  if (o.style === "twin") s += '<path d="M24 40C6 50 2 96 10 126 18 112 22 80 30 60Z" fill="' + HD + '"/><path d="M76 40C94 50 98 96 90 126 82 112 78 80 70 60Z" fill="' + HD + '"/>';
  if (o.style === "long") s += '<path d="M22 50C15 90 15 118 19 134H81C85 118 85 90 78 50Z" fill="' + HD + '"/>';
  if (o.style === "pony") s += '<path d="M70 30C94 26 100 62 90 100 86 76 82 56 72 46Z" fill="' + HD + '"/>';
  s += '<path d="M44 78H56V95H44Z" fill="#f2cbbb"/><path d="M14 134C16 108 30 94 50 94S84 108 86 134Z" fill="' + o.outfit + '"/><path d="M38 95L50 112 62 95Z" fill="#fff"/><path d="M44 104L50 110 56 104 50 117Z" fill="' + o.tie + '"/>';
  s += '<path d="M30 52C30 76 40 87 50 87S70 76 70 52C70 36 60 30 50 30S30 36 30 52Z" fill="#ffe6da"/>';
  s += '<ellipse cx="36.5" cy="71" rx="5" ry="2.4" fill="#ff8fa8" fill-opacity=".55"/><ellipse cx="63.5" cy="71" rx="5" ry="2.4" fill="#ff8fa8" fill-opacity=".55"/>';
  [40, 60].forEach(function (ex) {
    s += '<ellipse cx="' + ex + '" cy="63" rx="6.4" ry="8.4" fill="#fff"/><ellipse cx="' + ex + '" cy="64" rx="5.6" ry="7.6" fill="' + o.eye + '"/><ellipse cx="' + ex + '" cy="66" rx="3.6" ry="4.6" fill="' + o.eyeD + '"/>' +
      '<ellipse cx="' + ex + '" cy="69.5" rx="3.6" ry="2.2" fill="#fff" fill-opacity=".35"/><circle cx="' + (ex - 2) + '" cy="60" r="2.3" fill="#fff"/><circle cx="' + (ex + 2.2) + '" cy="67.5" r="1" fill="#fff"/>' +
      '<path d="M' + (ex - 7.5) + ' 57Q' + ex + ' 51.5 ' + (ex + 7.5) + ' 57" fill="none" stroke="#2a1a2a" stroke-width="2.4" stroke-linecap="round"/>';
  });
  s += '<path d="M33 49Q37 46.5 41 47.5M59 47.5Q63 46.5 67 49" fill="none" stroke="' + HD + '" stroke-width="1.2" stroke-linecap="round"/>';
  s += o.smile ? '<path d="M45 76Q50 82 55 76Q50 78 45 76Z" fill="#c8405a"/>' : '<path d="M47 77Q50 79 53 77" fill="none" stroke="#c8405a" stroke-width="1.2" stroke-linecap="round"/>';
  s += '<path d="M27 56C24 30 36 18 50 18S76 30 73 56C70 46 67 41 63 47C62 39 57 36 54 45C51 36 46 36 44 45C41 38 37 41 36 48C33 44 30 48 27 56Z" fill="' + H + '"/>';
  s += '<path d="M36 26Q46 20 58 23" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>';
  if (o.style === "twin") s += '<circle cx="26" cy="34" r="5" fill="' + o.tie + '"/><circle cx="74" cy="34" r="5" fill="' + o.tie + '"/>';
  if (o.ears) s += '<path d="M30 30L27 11 42 22Z" fill="' + H + '"/><path d="M70 30L73 11 58 22Z" fill="' + H + '"/><path d="M31 26L30 16 38 22Z" fill="#ffb8c8"/><path d="M69 26L70 16 62 22Z" fill="#ffb8c8"/>';
  if (o.bow) s += '<path d="M62 20L73 13 75 27ZM62 20L53 11 51 24Z" fill="' + o.tie + '"/><circle cx="62" cy="20" r="2.6" fill="' + o.tie + '"/>';
  if (o.text) s += '<text x="50" y="127" font-family="' + SANS + '" font-weight="900" font-size="13" text-anchor="middle" fill="#fff" stroke="' + o.tie + '" stroke-width="2.4" paint-order="stroke">' + o.text + '</text>';
  return s;
}
function adScreen(o) {
  var s = '<rect width="100" height="130" fill="' + o.bg + '"/>';
  if (o.rings) for (var k = 0; k < 5; k++) s += '<circle cx="50" cy="56" r="' + (10 + k * 12) + '" fill="none" stroke="' + o.fg + '" stroke-opacity="' + f(.85 - k * .15) + '" stroke-width="5"/>';
  if (o.can) s += '<rect x="34" y="22" width="32" height="70" rx="6" fill="' + o.can + '"/><rect x="34" y="40" width="32" height="20" fill="' + o.bg + '"/><text x="50" y="55" font-family="' + SANS + '" font-weight="900" font-size="10" text-anchor="middle" fill="#fff">炭酸</text><ellipse cx="50" cy="23" rx="16" ry="4" fill="#d8dce2"/><path d="M40 28V88" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>';
  if (o.pad) s += '<path d="M18 62C18 48 30 44 40 48H60C70 44 82 48 82 62 82 80 72 86 64 78L58 72H42L36 78C28 86 18 80 18 62Z" fill="' + o.fg + '"/><path d="M30 60H42M36 54V66" stroke="' + o.bg + '" stroke-width="3.4"/><circle cx="63" cy="57" r="3" fill="' + o.bg + '"/><circle cx="70" cy="63" r="3" fill="' + o.bg + '"/>';
  s += '<text x="50" y="' + (o.ty || 120) + '" font-family="' + SANS + '" font-weight="900" font-size="' + (o.ts || 21) + '" text-anchor="middle" fill="' + (o.tc || "#fff") + '">' + o.text + '</text>';
  return s;
}
var GIRLS;
var ADS;
export var LED_DEFS = '<pattern id="led" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 .2H2.4M.2 0V2.4" stroke="#000" stroke-opacity=".3" stroke-width=".5"/></pattern>' +
  '<linearGradient id="ledsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>';
// Pantalla LED que va cambiando de imagen (variantes de 100×130 ajustadas y recortadas a la pantalla)
function ledScreen(id, q, variants, dur, shift) {
  var x = q[0], y = q[1], w = q[2], h = q[3], k0 = Math.max(w / 100, h / 130), ox = (w - 100 * k0) / 2, oy = (h - 130 * k0) / 2, n = variants.length;
  var s = '<g transform="translate(' + x + ' ' + y + ') skewY(' + q[4] + ')"><defs><clipPath id="' + id + '"><rect width="' + w + '" height="' + h + '"/></clipPath></defs><g clip-path="url(#' + id + ')"><g transform="translate(' + f(ox) + ' ' + f(oy) + ') scale(' + f(k0) + ')">';
  variants.forEach(function (v, k) { var kk = (k + shift) % n; s += '<g opacity="' + (kk === 0 ? 1 : 0) + '">' + smilCycle(n, kk, dur) + v + '</g>'; });
  return s + '</g><rect width="' + w + '" height="' + h + '" fill="url(#led)"/><rect width="' + w + '" height="' + h + '" fill="url(#ledsh)"/></g><rect width="' + w + '" height="' + h + '" fill="none" stroke="#07040c" stroke-width="2.4"/></g>';
}
function screenGlow(q) { return '<g transform="translate(' + q[0] + ' ' + q[1] + ') skewY(' + q[4] + ')"><rect x="-12" y="-12" width="' + (q[2] + 24) + '" height="' + (q[3] + 24) + '" fill="' + q[5] + '" fill-opacity=".7" filter="url(#agl)"/></g>'; }

function mBush(x, y, R, sd, cols) { var rr = seeded(sd), o = ''; cols = cols || ["#4f7a3a", "#6a9444", "#3f6a30", "#8ab456"]; for (var i = 0; i < 26; i++) { var a = rr() * 6.283, d = Math.sqrt(rr()) * R; o += '<circle cx="' + f(x + Math.cos(a) * d) + '" cy="' + f(y + Math.sin(a) * d * .7) + '" r="' + f(R * .28 + rr() * R * .2) + '" fill="' + cols[(rr() * cols.length) | 0] + '"/>'; } return o; }
function machiBack() {
  var r = seeded(401), s = '<defs><linearGradient id="msk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f9bcf"/><stop offset=".33" stop-color="#a9cfe6"/><stop offset=".6" stop-color="#f1e2c6"/><stop offset="1" stop-color="#f6d9a6"/></linearGradient>' +
    '<radialGradient id="msun" cx=".9" cy=".4" r=".7"><stop offset="0" stop-color="#fff1c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff1c8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="mrd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d8a86"/><stop offset="1" stop-color="#55545a"/></linearGradient></defs>';
  s += '<rect width="400" height="860" fill="url(#msk)"/><rect width="400" height="860" fill="url(#msun)"/>';
  function cloud(x, y, sc) { var L = [[0, 0, 30], [34, -12, 34], [70, -2, 28], [100, 8, 20], [48, 10, 30]], o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">'; L.forEach(function (c) { o += '<circle cx="' + c[0] + '" cy="' + (c[1] + 5) + '" r="' + c[2] + '" fill="#e6d6c2"/>'; }); L.forEach(function (c) { o += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (c[2] - 2) + '" fill="#fffaf2"/>'; }); return o + '</g>'; }
  s += cloud(170, 240, .9) + cloud(320, 300, .55) + cloud(30, 190, .6);
  // bloques de pisos al fondo
  [[30, 74, 380, "#cbc3b4"], [96, 62, 340, "#d7d0c2"], [150, 46, 300, "#c2bbad"], [192, 48, 250, "#dcd7cf"], [236, 60, 170, "#c9d1d8", 1], [300, 62, 280, "#ddd5c6"], [354, 60, 330, "#cfc6b6"]].forEach(function (b) {
    var x = b[0], w = b[1], top = b[2], c = b[3];
    s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (590 - top) + '" fill="' + c + '"/>';
    if (b[4]) { s += '<rect x="' + x + '" y="' + (top - 10) + '" width="' + w + '" height="10" fill="#aab4bc"/>'; for (var gx = x + 4; gx < x + w - 4; gx += 8) s += '<rect x="' + gx + '" y="' + (top + 6) + '" width="5" height="' + (584 - top) + '" fill="#86a8c6" fill-opacity=".75"/>'; }
    else { for (var fy = top + 10; fy < 585; fy += 13) { s += '<rect x="' + x + '" y="' + fy + '" width="' + w + '" height="2.4" fill="#8f877a" fill-opacity=".6"/>'; for (var wx = x + 5; wx < x + w - 8; wx += 11) s += '<rect x="' + wx + '" y="' + (fy + 4) + '" width="7" height="6" fill="' + (r() > .82 ? "#ffe2a8" : "#6f7c8a") + '" fill-opacity=".8"/>'; }
      s += '<rect x="' + (x + 6) + '" y="' + (top - 8) + '" width="12" height="8" fill="#9a958b"/><path d="M' + (x + w - 10) + ' ' + top + 'V' + (top - 16) + 'M' + (x + w - 16) + ' ' + (top - 12) + 'H' + (x + w - 4) + '" stroke="#6f6a62"/>'; }
    s += '<rect x="' + f(x + w * .6) + '" y="' + top + '" width="' + f(w * .4) + '" height="' + (590 - top) + '" fill="#fff4d8" fill-opacity=".3"/><rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (590 - top) + '" fill="none" stroke="#8f877a" stroke-opacity=".5"/>';
  });
  [[0, 60, 522], [62, 70, 536], [200, 60, 530], [262, 70, 520], [330, 80, 542]].forEach(function (h) { var x = h[0], w = h[1], y = h[2]; s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (592 - y) + '" fill="#efe7d8"/><path d="M' + (x - 6) + ' ' + y + 'L' + (x + w / 2) + ' ' + (y - 18) + 'L' + (x + w + 6) + ' ' + y + 'Z" fill="#6f7e90"/><rect x="' + (x + 8) + '" y="' + (y + 10) + '" width="14" height="10" fill="#7b8794"/><rect x="' + (x + w - 24) + '" y="' + (y + 12) + '" width="12" height="9" fill="#ffe2a8" fill-opacity=".7"/>'; });
  s += mBush(160, 548, 26, 3) + mBush(250, 540, 22, 4) + mBush(384, 538, 24, 5);
  // vías
  s += '<rect x="0" y="588" width="400" height="18" fill="#9a8f80"/><path d="M0 596H400M0 602H400" stroke="#4a4540" stroke-width="2"/>';
  // calle en perspectiva, sombras largas y marcas
  s += '<path d="M136 606H300L420 860H-20Z" fill="url(#mrd)"/><path d="M136 606H300L304 616H132Z" fill="#b8b2a8"/>';
  s += '<path d="M230 640H300L390 860H270Z" fill="#f6d9a6" fill-opacity=".2"/><path d="M288 690L304 690 110 860H70Z" fill="#26262c" fill-opacity=".28"/><path d="M330 740L350 740 230 860H190Z" fill="#26262c" fill-opacity=".22"/>';
  s += '<path d="M150 612H156L92 860H70Z" fill="#f2efe8" fill-opacity=".9"/>';
  [["止", 744, 24], ["ま", 792, 30], ["れ", 850, 40]].forEach(function (c) { s += '<text transform="translate(262 ' + c[1] + ') scale(1 .55)" font-family="' + SANS + '" font-weight="900" font-size="' + c[2] + '" text-anchor="middle" fill="#f2efe8" fill-opacity=".85">' + c[0] + '</text>'; });
  // muro de bloques con seto (izquierda) y fachada con persiana (derecha)
  s += '<path d="M-10 590L134 602V622L40 860H-10Z" fill="#b9ae9c"/>';
  for (var bl = 0; bl < 8; bl++) s += '<path d="M-10 ' + (622 + bl * 30) + 'L' + (122 - bl * 12) + ' ' + (626 + bl * 29) + '" stroke="#9a8f7c" stroke-width="1.2"/>';
  s += mBush(24, 584, 34, 7, ["#3f6a30", "#4f7a3a", "#6a9444"]) + mBush(100, 594, 22, 8, ["#3f6a30", "#4f7a3a", "#6a9444"]);
  s += '<path d="M410 420L364 470V642L410 860Z" fill="#d9cdb8"/>';
  for (var sr = 0; sr < 26; sr++) s += '<path d="M366 ' + (560 + sr * 9) + 'L410 ' + (548 + sr * 12) + '" stroke="#b8ab94" stroke-width="1"/>';
  s += '<rect x="372" y="480" width="30" height="20" fill="#e8e2d6" stroke="#9a907c"/><circle cx="384" cy="490" r="7" fill="none" stroke="#9a907c"/>';
  return svg(s, 400, 860);
}
function trainCar(x, y, L) {
  var o = '<rect x="' + x + '" y="' + (y - 6) + '" width="' + L + '" height="8" rx="3" fill="#8f9298"/>';
  [.2, .5, .8].forEach(function (t) { o += '<rect x="' + f(x + L * t - 14) + '" y="' + (y - 12) + '" width="28" height="7" rx="2" fill="#a7aab0"/>'; });
  o += '<rect x="' + x + '" y="' + y + '" width="' + L + '" height="64" rx="5" fill="url(#tb)"/><rect x="' + x + '" y="' + (y + 6) + '" width="' + L + '" height="3" fill="#2e8b6e"/><rect x="' + x + '" y="' + (y + 40) + '" width="' + L + '" height="8" fill="#2e8b6e"/><rect x="' + x + '" y="' + (y + 48) + '" width="' + L + '" height="2" fill="#7fc6a8"/>';
  var doors = [.1, .36, .62, .88];
  for (var i = 0; i < 3; i++) { var a = x + L * doors[i] + 14, b = x + L * doors[i + 1] - 14; o += '<rect x="' + f(a) + '" y="' + (y + 14) + '" width="' + f(b - a) + '" height="22" rx="2" fill="url(#tw)"/><path d="M' + f((a + b) / 2) + ' ' + (y + 14) + 'V' + (y + 36) + '" stroke="#c9c6bd" stroke-width="2"/>'; }
  doors.forEach(function (t) { var dx = x + L * t - 12; o += '<rect x="' + f(dx) + '" y="' + (y + 8) + '" width="24" height="54" fill="#cfccc3" stroke="#8f8c84"/><rect x="' + f(dx + 3) + '" y="' + (y + 14) + '" width="8" height="18" rx="1.5" fill="url(#tw)"/><rect x="' + f(dx + 13) + '" y="' + (y + 14) + '" width="8" height="18" rx="1.5" fill="url(#tw)"/><path d="M' + f(dx + 12) + ' ' + (y + 8) + 'V' + (y + 62) + '" stroke="#8f8c84"/>'; });
  o += '<rect x="' + x + '" y="' + (y + 62) + '" width="' + L + '" height="7" fill="#3a3d44"/>';
  [.18, .82].forEach(function (t) { var bx = x + L * t; o += '<rect x="' + f(bx - 22) + '" y="' + (y + 66) + '" width="44" height="6" fill="#2a2c30"/><circle cx="' + f(bx - 12) + '" cy="' + (y + 72) + '" r="5" fill="#1a1a1e"/><circle cx="' + f(bx + 12) + '" cy="' + (y + 72) + '" r="5" fill="#1a1a1e"/>'; });
  return o + '<rect x="' + x + '" y="' + y + '" width="' + L + '" height="64" rx="5" fill="none" stroke="#8f8c84" stroke-width="1.2"/>';
}
// El tren cruza el paso a nivel cada 16 s (las barreras bajan y las luces parpadean mientras pasa)
var M_CYCLE = 'dur="16s" repeatCount="indefinite"';
function machiTrain() {
  var s = '<defs><linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1efe8"/><stop offset=".6" stop-color="#d6d3ca"/><stop offset="1" stop-color="#b9b6ad"/></linearGradient><linearGradient id="tw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a94aa"/><stop offset=".5" stop-color="#3a4a5a"/><stop offset="1" stop-color="#9ab4c8"/></linearGradient><clipPath id="tcl"><rect x="0" y="470" width="364" height="134"/></clipPath></defs>';
  var cars = ''; for (var c = 0; c < 4; c++) cars += trainCar(c * 214, 526, 210);
  s += '<g clip-path="url(#tcl)"><g><animateTransform attributeName="transform" type="translate" values="-500 0;420 0;420 0;-900 0;-900 0;-500 0" keyTimes="0;0.22;0.6;0.6;0.92;1" ' + M_CYCLE + '/>' + cars + '</g></g>';
  return svg(s, 400, 860);
}
function bicycle(x, y, sc) {
  var o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" fill="none" stroke="#2a2a2e" stroke-width="3" stroke-linecap="round"><circle cx="20" cy="50" r="24"/><circle cx="92" cy="50" r="24"/>';
  for (var k = 0; k < 8; k++) { var a = k * .785; o += '<path d="M' + f(20 + Math.cos(a) * 23) + ' ' + f(50 + Math.sin(a) * 23) + 'L' + f(20 - Math.cos(a) * 23) + ' ' + f(50 - Math.sin(a) * 23) + 'M' + f(92 + Math.cos(a) * 23) + ' ' + f(50 + Math.sin(a) * 23) + 'L' + f(92 - Math.cos(a) * 23) + ' ' + f(50 - Math.sin(a) * 23) + '" stroke-width=".6"/>'; }
  return o + '<path d="M20 50L44 14H78L92 50M44 14L56 50 78 14M56 50H20M38 6H52M78 14L82 2H92"/><rect x="84" y="-12" width="22" height="14" fill="#3a3a40" stroke-width="2"/></g>';
}
function machiFront() {
  var r = seeded(411), s = '';
  // postes de la luz y maraña de cables
  s += '<rect x="292" y="200" width="7" height="400" fill="#9a958b"/><rect x="278" y="240" width="34" height="3" fill="#6f6a62"/><rect x="282" y="256" width="10" height="14" rx="2" fill="#8e928f"/>';
  var W = '';
  for (var i = 0; i < 9; i++) W += '<path d="M-10 ' + (100 + i * 6) + 'Q30 ' + (112 + i * 6) + ' 66 ' + (118 + i * 5) + 'Q180 ' + (150 + i * 8) + ' 296 ' + (236 + i * 4) + '"/>';
  for (var j = 0; j < 5; j++) W += '<path d="M66 ' + (150 + j * 6) + 'Q240 ' + (200 + j * 8) + ' 420 ' + (160 + j * 14) + '"/>';
  for (var k2 = 0; k2 < 4; k2++) W += '<path d="M296 ' + (240 + k2 * 5) + 'Q350 ' + (252 + k2 * 6) + ' 420 ' + (236 + k2 * 10) + '"/>';
  s += '<g fill="none" stroke="#2a2a2e" stroke-width=".9">' + W + '</g>';
  s += '<rect x="58" y="40" width="16" height="780" fill="#b0aba1"/><rect x="68" y="40" width="6" height="780" fill="#8e897f"/><rect x="28" y="118" width="76" height="5" fill="#6f6a62"/><rect x="34" y="148" width="64" height="4" fill="#6f6a62"/><rect x="38" y="164" width="16" height="24" rx="3" fill="#8e928f"/><rect x="58" y="320" width="16" height="30" fill="#e8e2d6"/><text x="66" y="340" font-family="' + SANS + '" font-size="7" text-anchor="middle" fill="#3a3a3a">一丁目</text>';
  // árbol arriba a la izquierda
  s += '<path d="M-10 330C30 280 60 220 120 170 160 140 200 120 250 104" fill="none" stroke="#3a2e22" stroke-width="7"/><path d="M80 210C110 240 150 250 190 252M40 280C70 300 110 300 140 292" fill="none" stroke="#3a2e22" stroke-width="3.4"/>';
  var CL = [[30, 50, 90], [130, 30, 80], [210, 80, 66], [60, 190, 74], [160, 180, 60], [258, 50, 46], [10, 290, 46]], lv = '';
  for (var l = 0; l < 900; l++) { var c = CL[(r() * CL.length) | 0], a = r() * 6.283, d = Math.sqrt(r()) * c[2], lx = c[0] + Math.cos(a) * d, ly = c[1] + Math.sin(a) * d * .75, lit = (lx - c[0]) + (c[1] - ly) > c[2] * .2 ? 1 : 0;
    lv += '<ellipse cx="' + f(lx) + '" cy="' + f(ly) + '" rx="' + f(5 + r() * 4) + '" ry="' + f(2.4 + r() * 1.6) + '" transform="rotate(' + f(r() * 180) + ' ' + f(lx) + ' ' + f(ly) + ')" fill="' + (lit ? ["#7aa040", "#a8c85a", "#cde08a"][(r() * 3) | 0] : ["#2f4a24", "#3f6230", "#4f7a36"][(r() * 3) | 0]) + '"/>'; }
  s += lv;
  // señal de prohibido aparcar
  s += '<rect x="116" y="494" width="4" height="120" fill="#9a958b"/><circle cx="118" cy="486" r="15" fill="#2a5bb5" stroke="#d8312a" stroke-width="4.4"/><path d="M107 475L129 497" stroke="#d8312a" stroke-width="4"/><rect x="100" y="504" width="36" height="12" fill="#fbfbf8" stroke="#3a3a3a" stroke-width=".8"/><text x="118" y="513" font-family="' + SANS + '" font-size="6.4" text-anchor="middle" fill="#1a1a1a">自転車を除く</text>';
  // paso a nivel: poste a rayas, cruz de San Andrés, luces y cartel
  var px = 322;
  s += '<rect x="' + (px - 4) + '" y="380" width="8" height="262" fill="#1a1a1a"/>';
  for (var sy = 384; sy < 640; sy += 16) s += '<rect x="' + (px - 4) + '" y="' + sy + '" width="8" height="8" fill="#f2c230"/>';
  s += '<g transform="translate(' + px + ' 398)">' + [32, -32].map(function (rot) { var g = '<g transform="rotate(' + rot + ')"><rect x="-38" y="-6" width="76" height="12" fill="#f2c230" stroke="#1a1a1a" stroke-width="1.2"/>'; for (var q = -34; q < 38; q += 12) g += '<rect x="' + q + '" y="-6" width="6" height="12" fill="#1a1a1a"/>'; return g + '</g>'; }).join("") + '<path d="M0 -9L9 0 0 9 -9 0Z" fill="#f2c230" stroke="#1a1a1a"/></g>';
  s += '<rect x="' + (px - 34) + '" y="448" width="68" height="5" fill="#1a1a1a"/>';
  [px - 24, px + 24].forEach(function (lx2) { s += '<circle cx="' + lx2 + '" cy="462" r="12" fill="#1a1a1a"/><circle cx="' + lx2 + '" cy="462" r="8.4" fill="#5a1a1a"/><path d="M' + (lx2 - 13) + ' 452Q' + lx2 + ' 444 ' + (lx2 + 13) + ' 452" fill="#1a1a1a"/>'; });
  s += '<rect x="' + (px - 26) + '" y="488" width="52" height="18" fill="#fbfbf8" stroke="#1a1a1a" stroke-width="1.6"/><text x="' + px + '" y="501.5" font-family="' + SANS + '" font-weight="800" font-size="11" text-anchor="middle" fill="#1a1a1a">踏切注意</text>';
  [[300, 572, 16, 40], [132, 580, 12, 32]].forEach(function (g) { s += '<rect x="' + g[0] + '" y="' + g[1] + '" width="' + g[2] + '" height="' + g[3] + '" fill="#f2c230"/>'; for (var q2 = 0; q2 < g[3]; q2 += 8) s += '<path d="M' + g[0] + ' ' + (g[1] + q2 + 6) + 'L' + (g[0] + g[2]) + ' ' + (g[1] + q2) + '" stroke="#1a1a1a" stroke-width="3"/>'; });
  // bicicleta, macetas y luz de tarde
  s += bicycle(-4, 760, 1);
  for (var p2 = 0; p2 < 4; p2++) s += '<rect x="' + (350 + p2 * 13) + '" y="' + (706 + p2 * 32) + '" width="18" height="20" fill="#4a4038"/>' + mBush(359 + p2 * 13, 700 + p2 * 32, 14, 20 + p2, ["#3f6a30", "#5e8a3a", "#7aa040"]);
  s += '<path d="M420 100L280 860H350L420 320Z" fill="#fff4d6" fill-opacity=".1"/><defs><linearGradient id="mtop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6efe2" stop-opacity=".92"/><stop offset=".6" stop-color="#f6efe2" stop-opacity=".6"/><stop offset="1" stop-color="#f6efe2" stop-opacity="0"/></linearGradient></defs><rect width="400" height="120" fill="url(#mtop)"/>';
  return svg(s, 400, 860);
}
function machiSignal() {
  var px = 322, s = '<defs><radialGradient id="mlg"><stop offset="0" stop-color="#ff4a3a" stop-opacity=".9"/><stop offset="1" stop-color="#ff4a3a" stop-opacity="0"/></radialGradient></defs>';
  s += '<g><animate attributeName="opacity" values="1;0;1" keyTimes="0;0.24;0.86" calcMode="discrete" ' + M_CYCLE + '/>';
  [[px - 24, 0], [px + 24, 1]].forEach(function (l) { s += '<g opacity="' + (l[1] ? 0 : 1) + '"><animate attributeName="opacity" values="' + (l[1] ? "0;1" : "1;0") + '" keyTimes="0;0.5" calcMode="discrete" dur="1s" repeatCount="indefinite"/><circle cx="' + l[0] + '" cy="462" r="28" fill="url(#mlg)"/><circle cx="' + l[0] + '" cy="462" r="8.4" fill="#ff3a2a"/><circle cx="' + (l[0] - 2.6) + '" cy="459" r="2.4" fill="#ffd0c8"/></g>'; });
  s += '</g>';
  function arm(x, y, dir, len, up) {
    var v = [0, 0, up, up, 0, 0].map(function (a) { return a + ' ' + x + ' ' + y; }).join(";"), g = '<g><animateTransform attributeName="transform" type="rotate" values="' + v + '" keyTimes="0;0.23;0.28;0.86;0.9;1" ' + M_CYCLE + '/>';
    for (var q = 0; q < len; q += 12) g += '<rect x="' + (dir > 0 ? x + q : x - q - 12) + '" y="' + (y - 2.5) + '" width="12" height="5" fill="' + ((q / 12) % 2 ? "#1a1a1a" : "#f2c230") + '"/>';
    return g + '</g>';
  }
  s += arm(306, 584, -1, 84, 80) + arm(140, 590, 1, 84, -80);
  return svg(s, 400, 860);
}
function machiFx(d, node) {
  d.appendChild(node("scene", "background-image:" + machiTrain()));
  d.appendChild(node("scene", "background-image:" + machiFront()));
  d.appendChild(node("scene", "background-image:" + machiSignal()));
}
var G_TRN = "M150 468C208 516 282 598 356 676C376 698 372 724 348 732C298 748 236 744 188 726C150 714 112 714 82 718L98 600Z";
var G_KIM = "M118 302C106 330 100 380 98 430C94 520 80 620 62 700C100 716 160 720 210 708C206 620 196 520 186 440C184 400 178 340 166 302Z";
var G_SLV = "M114 308C98 332 88 372 86 420C84 450 90 470 104 476C120 480 130 470 130 450L132 330Z";
var G_SLV2 = "M164 306C182 330 192 380 190 432L172 442C170 392 164 342 158 314Z";
var G_OBI = "M100 400C122 395 160 393 184 398L186 434C160 429 122 431 100 437Z";
function gFlower(x, y, r0, c, cc) { var o = ''; for (var k = 0; k < 5; k++) { var a = k * 1.2566 - 1.5708; o += '<circle cx="' + f(x + Math.cos(a) * r0) + '" cy="' + f(y + Math.sin(a) * r0) + '" r="' + f(r0 * .8) + '" fill="' + c + '"/>'; } return o + '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r0 * .55) + '" fill="' + (cc || "#c9a24a") + '"/>'; }
function gPlum(x, y, r0) { var o = ''; for (var k = 0; k < 5; k++) { var a = k * 1.2566 - 1.5708; o += '<circle cx="' + f(x + Math.cos(a) * r0) + '" cy="' + f(y + Math.sin(a) * r0) + '" r="' + f(r0 * .78) + '"/>'; } return o; }
function kimonoPattern(r, x0, y0, w, h) {
  var o = '<g filter="url(#wash)">';
  for (var i = 0; i < 8; i++) o += '<ellipse cx="' + f(x0 + r() * w) + '" cy="' + f(y0 + r() * h) + '" rx="' + f(20 + r() * 40) + '" ry="' + f(14 + r() * 30) + '" fill="' + (r() > .4 ? "#a81c2a" : "#2f6a6a") + '" fill-opacity="' + f(.5 + r() * .4) + '"/>';
  o += '</g>';
  for (var j = 0; j < 50; j++) o += gFlower(x0 + r() * w, y0 + r() * h, 1.6 + r() * 3, ["#e8d6b0", "#c9a24a", "#e47a8a", "#f4efe4", "#7fb2a8"][(r() * 5) | 0], "#c9a24a");
  for (var k = 0; k < 140; k++) o += '<circle cx="' + f(x0 + r() * w) + '" cy="' + f(y0 + r() * h) + '" r="' + f(.4 + r() * .9) + '" fill="#e8c878" fill-opacity="' + f(.4 + r() * .5) + '"/>';
  for (var a = 0; a < 20; a++) { var cx = x0 + r() * w, cy = y0 + h * .55 + r() * h * .45; o += '<path d="M' + f(cx - 8) + ' ' + f(cy) + 'a8 8 0 0 1 16 0M' + f(cx - 5) + ' ' + f(cy) + 'a5 5 0 0 1 10 0" fill="none" stroke="#9fc4c0" stroke-opacity=".6" stroke-width=".8"/>'; }
  return o;
}
function geishaScene() {
  var r = seeded(501), INKG = "#2a1a16";
  var s = '<defs>' + KOI_INK_DEFS +
    '<filter id="gfib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".5 .02" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .3 0 0 0 0 .16 0 0 0 .16 0"/></filter>' +
    '<filter id="gspk" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="4" seed="21"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .28 0 0 0 0 .12 0 0 0 1.8 -1"/></filter>' +
    '<pattern id="mnd" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M1 15V1H15V13H4V4H12V10H7" fill="none" stroke="#6e5a3a" stroke-width="1.3"/></pattern>' +
    '<pattern id="kan" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#a8182a"/><circle cx="2.5" cy="2.5" r="1.3" fill="#6e0c18"/><circle cx="2.5" cy="2.5" r=".45" fill="#f3d6c8"/></pattern>' +
    '<clipPath id="gk1"><path d="' + G_KIM + '"/></clipPath><clipPath id="gk2"><path d="' + G_TRN + '"/></clipPath><clipPath id="gk3"><path d="' + G_SLV + '"/></clipPath><clipPath id="gk4"><path d="' + G_OBI + '"/></clipPath></defs>';
  s += '<rect width="400" height="860" fill="#e6d4ac"/><rect width="400" height="860" filter="url(#gfib)"/>';
  s += '<g filter="url(#wash)">' + [[80, 200, 120, 90, "#c9a564", .35], [320, 600, 140, 110, "#b88a4a", .3], [200, 820, 220, 60, "#a8783a", .4], [40, 520, 90, 140, "#8fb2a8", .5], [360, 260, 80, 60, "#cdb07a", .35], [90, 120, 70, 50, "#7fb2a8", .45]].map(function (e) { return '<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="' + e[2] + '" ry="' + e[3] + '" fill="' + e[4] + '" fill-opacity="' + e[5] + '"/>'; }).join("") + '</g>';
  s += '<path d="M-10 580C10 480 40 440 70 410 90 390 110 370 130 390 150 410 170 450 190 480V580Z" fill="#6f9a90" fill-opacity=".45" filter="url(#wash)"/>';
  // marco de grecas
  s += '<rect x="22" y="54" width="364" height="16" fill="url(#mnd)" opacity=".85"/><path d="M22 52H386M22 72H386" stroke="#6e5a3a" stroke-width="1.2"/>';
  s += '<rect x="8" y="54" width="16" height="590" fill="url(#mnd)" opacity=".85"/><path d="M6 54V644M26 74V644" stroke="#6e5a3a" stroke-width="1.2"/>';
  // casa con celosía
  s += '<g filter="url(#pnt)"><path d="M232 446L404 408V420L244 456Z" fill="#3a3028"/><path d="M244 456L404 420V580H250Z" fill="#b89a6a" fill-opacity=".45"/>';
  for (var lx = 250; lx < 404; lx += 8) s += '<path d="M' + lx + ' ' + f(456 - (lx - 244) * .225) + 'V580" stroke="#3a3028" stroke-width=".9"/>';
  for (var ly = 470; ly < 580; ly += 11) s += '<path d="M250 ' + ly + 'L404 ' + (ly - 6) + '" stroke="#3a3028" stroke-width=".7"/>';
  s += '</g>';
  // ciruelo en flor
  var trunk = catmull([[412, 640], [384, 540], [356, 440], [336, 350], [312, 270], [300, 200]], 8);
  s += '<path d="' + brushPath(trunk, 12, 5, false) + '" fill="#4a3a2a" fill-opacity=".9" filter="url(#pnt)"/>';
  var brs = [[[356, 440], [300, 410], [246, 388], [200, 340]], [[336, 350], [280, 300], [236, 262], [196, 230]], [[312, 270], [330, 190], [360, 140], [396, 110]], [[300, 200], [260, 150], [220, 130]], [[384, 540], [340, 520], [300, 520]]];
  brs.forEach(function (b, i) { s += '<path d="' + brushPath(catmull(b, 6), 4 - i * .3, i + 10) + '" fill="#4a3a2a" filter="url(#pnt)"/>'; });
  var fl = '';
  brs.forEach(function (b) { catmull(b, 6).forEach(function (p, j) { if (j % 2) return; for (var k = 0; k < 12; k++) { var a = r() * 6.283, dd = r() * 22; fl += '<circle cx="' + f(p[0] + Math.cos(a) * dd) + '" cy="' + f(p[1] + Math.sin(a) * dd * .7) + '" r="' + f(1 + r() * 2.2) + '" fill="' + ["#c41e3a", "#e0445e", "#f07a8e", "#a8182e"][(r() * 4) | 0] + '" fill-opacity="' + f(.6 + r() * .4) + '"/>'; } }); });
  for (var hh = 0; hh < 10; hh++) { var hx = 200 + r() * 180, hy = 150 + r() * 200, hl = 40 + r() * 70; fl += '<path d="M' + f(hx) + ' ' + f(hy) + 'q' + f(r() * 6 - 3) + ' ' + f(hl * .5) + ' ' + f(r() * 8 - 4) + ' ' + f(hl) + '" fill="none" stroke="#5a4030" stroke-width=".7"/>'; for (var q = 0; q < 6; q++) fl += '<circle cx="' + f(hx + (r() - .5) * 4) + '" cy="' + f(hy + q * hl / 6 + 4) + '" r="' + f(1.2 + r()) + '" fill="#c41e3a"/>'; }
  s += '<g filter="url(#pnt)">' + fl + '</g>';
  // matas con flores
  var sh = '';
  for (var b2 = 0; b2 < 8; b2++) { var bx = 240 + r() * 170, by = 600 + r() * 150; for (var k2 = 0; k2 < 30; k2++) { var a2 = r() * 6.283, d2 = Math.sqrt(r()) * 26; sh += '<ellipse cx="' + f(bx + Math.cos(a2) * d2) + '" cy="' + f(by + Math.sin(a2) * d2 * .6) + '" rx="' + f(2 + r() * 3) + '" ry="' + f(1.4 + r() * 2) + '" fill="' + ["#2f3a2a", "#4a5a3a", "#3a4a40"][(r() * 3) | 0] + '" fill-opacity=".8"/>'; } }
  for (var pf = 0; pf < 16; pf++) sh += gFlower(260 + r() * 140, 620 + r() * 140, 3.4 + r() * 2, r() > .5 ? "#4a3a8a" : "#c9a24a", "#e8d6b0");
  for (var gr = 0; gr < 30; gr++) { var gx = 20 + r() * 120, gy = 740 + r() * 70; sh += '<path d="M' + f(gx) + ' ' + f(gy) + 'q' + f(r() * 6 - 3) + ' -12 ' + f(r() * 10 - 5) + ' -24" fill="none" stroke="#4a5a3a" stroke-width="1"/>'; }
  s += '<g filter="url(#pnt)">' + sh + '</g>';
  s += '<g transform="translate(228 300)"><rect width="18" height="18" rx="1.5" fill="#b0322a" fill-opacity=".85"/><text x="9" y="13.6" font-family="' + MINCHO + '" font-size="12" text-anchor="middle" fill="#efe6d2">芸</text></g>';
  // ---- la geisha ----
  var fig = '<path d="' + G_TRN + '" fill="#1b2130"/><g clip-path="url(#gk2)">' + kimonoPattern(r, 100, 470, 280, 280) + '</g><path d="' + G_TRN + '" fill="none" stroke="' + INKG + '" stroke-width="1"/>';
  fig += '<path d="' + G_SLV2 + '" fill="#8a1424" stroke="' + INKG + '" stroke-width=".8"/>';
  fig += '<path d="' + G_KIM + '" fill="#1e2230"/><g clip-path="url(#gk1)">' + kimonoPattern(r, 60, 300, 160, 430) + '<path d="M60 610C100 628 160 636 220 616V740H60Z" fill="#a8182a" fill-opacity=".55" filter="url(#wash)"/></g><path d="' + G_KIM + '" fill="none" stroke="' + INKG + '" stroke-width="1"/>';
  fig += '<path d="M62 700C70 660 84 600 94 540L106 542C100 610 94 670 94 712Z" fill="#c4202e"/><path d="M62 700C100 716 160 720 210 708L212 718C160 730 98 728 58 710Z" fill="#c4202e"/>';
  var spots = ''; for (var sp = 0; sp < 40; sp++) spots += '<ellipse cx="' + f(100 + r() * 86) + '" cy="' + f(396 + r() * 40) + '" rx="' + f(1.2 + r() * 2) + '" ry="' + f(1 + r() * 1.4) + '" fill="#6a4a2a" fill-opacity=".85"/>';
  fig += '<path d="' + G_OBI + '" fill="#c9a85a"/><g clip-path="url(#gk4)">' + spots + '</g><path d="M100 418C130 414 160 413 186 416" stroke="#a8182a" stroke-width="2.2" fill="none"/><path d="' + G_OBI + '" fill="none" stroke="' + INKG + '" stroke-width=".9"/>';
  fig += '<path d="M178 394C198 382 222 390 222 410C222 430 204 442 182 436Z" fill="#c9a85a" stroke="' + INKG + '" stroke-width=".9"/><path d="M186 400C200 396 212 402 212 412" fill="none" stroke="#8a6a3a"/>';
  var sf = ''; for (var s2 = 0; s2 < 8; s2++) sf += gFlower(90 + r() * 40, 330 + r() * 140, 2.4 + r() * 1.6, "#e8c878", "#f4efe4");
  fig += '<path d="' + G_SLV + '" fill="url(#kan)"/><g clip-path="url(#gk3)">' + sf + '</g><path d="' + G_SLV + '" fill="none" stroke="' + INKG + '" stroke-width="1"/>';
  fig += '<path d="M100 470C95 476 97 485 104 485 111 485 113 478 108 472Z" fill="#fbf3ec" stroke="#c9b8a8" stroke-width=".6"/>';
  fig += '<path d="M126 288C130 300 140 304 152 300L150 284H130Z" fill="#fbf3ec"/><path d="M120 300L140 322 160 300" fill="none" stroke="#f4efe4" stroke-width="7"/><path d="M118 302L140 326 162 302" fill="none" stroke="#c4202e" stroke-width="3"/>';
  fig += '<g fill="#1c1614"><ellipse cx="164" cy="276" rx="12" ry="8"/><ellipse cx="152" cy="252" rx="22" ry="15"/><ellipse cx="146" cy="234" rx="15" ry="9"/><ellipse cx="166" cy="261" rx="11" ry="12"/></g>';
  fig += '<ellipse cx="136" cy="270" rx="12.5" ry="16" transform="rotate(-12 136 270)" fill="#fbf3ec" stroke="#c9b8a8" stroke-width=".6"/>';
  fig += '<path d="M124 262C122 248 132 240 144 242 154 244 160 252 158 262 152 254 142 252 134 254 128 256 126 260 124 262Z" fill="#1c1614"/><ellipse cx="125" cy="262" rx="4.6" ry="8.6" fill="#1c1614"/>';
  fig += '<path d="M136 238Q146 232 156 238M140 248Q150 244 158 250M150 258Q160 256 168 262" fill="none" stroke="#5a4a44" stroke-width="1"/>';
  fig += '<path d="M127 268q3.5 -1.6 7 0" fill="none" stroke="#2a1a16" stroke-width="1.1"/><path d="M126 262q4 -2.4 8 -1" fill="none" stroke="#2a1a16" stroke-width=".8"/><ellipse cx="129" cy="280" rx="2.2" ry="1.3" fill="#c41e2e"/><ellipse cx="132" cy="274" rx="3" ry="1.6" fill="#f2b0b0" fill-opacity=".5"/>';
  var kz = ''; for (var kk = 0; kk < 22; kk++) { var ka = r() * 6.283, kd = Math.sqrt(r()) * 9; kz += '<circle cx="' + f(160 + Math.cos(ka) * kd) + '" cy="' + f(238 + Math.sin(ka) * kd * .8) + '" r="' + f(1.4 + r() * 1.8) + '" fill="' + (r() > .4 ? "#c41e2e" : "#e04a5a") + '"/>'; }
  fig += kz + '<path d="M134 232L182 222M138 240L186 236" stroke="#c9a24a" stroke-width="1.6"/><circle cx="182" cy="222" r="2.2" fill="#c9a24a"/><circle cx="186" cy="236" r="2.2" fill="#e8c878"/>';
  for (var dg = 0; dg < 4; dg++) { var dx0 = 172 + dg * 3, dl = 16 + dg * 4; fig += '<path d="M' + dx0 + ' 244V' + (244 + dl) + '" stroke="#c9a24a" stroke-width=".6"/><circle cx="' + dx0 + '" cy="' + (244 + dl) + '" r="1.4" fill="#c41e2e"/>'; }
  s += '<g filter="url(#pnt)">' + fig + '</g>';
  // envejecimiento: manchas de óxido, motas y bordes quemados
  s += '<rect width="400" height="860" filter="url(#gspk)" opacity=".45"/>';
  for (var m = 0; m < 220; m++) s += '<circle cx="' + f(r() * 400) + '" cy="' + f(r() * 860) + '" r="' + f(.4 + r() * 1.8) + '" fill="#7a4a22" fill-opacity="' + f(.15 + r() * .45) + '"/>';
  s += '<path d="M0 0H400V8C360 14 330 6 290 12 250 18 210 8 170 14 130 20 90 10 50 16 30 18 10 12 0 14Z" fill="#5a4630" fill-opacity=".7" filter="url(#wash)"/><path d="M0 860H400V826C360 814 320 832 280 820 240 808 200 826 160 816 120 806 80 824 40 812 20 808 0 816 0 816Z" fill="#2a2018" filter="url(#wash)"/>';
  return svg(s, 400, 860);
}
var KUSHI_D;
var FUMI_D;
var HACHI_D;

export function init() {
  GIRLS = [
    { bg: "#ffd1e8", bg2: "#ff8fc8", hair: "#ff7ab8", hairD: "#e0509a", eye: "#c04ad8", eyeD: "#6a1a8a", style: "twin", outfit: "#ffffff", tie: "#ff3f8a", smile: 1, text: "新作" },
    { bg: "#c9ecff", bg2: "#7ad0ff", hair: "#7ab8ff", hairD: "#4a86e0", eye: "#3a9aff", eyeD: "#1a3a8a", style: "long", outfit: "#2a3a6a", tie: "#ff4a6a", bow: 1 },
    { bg: "#fff1c9", bg2: "#ffd27a", hair: "#ffcf5a", hairD: "#e0a02a", eye: "#ff8a3a", eyeD: "#8a3a0a", style: "pony", outfit: "#ff6a4a", tie: "#ffffff", smile: 1, text: "発売中" },
    { bg: "#e4d6ff", bg2: "#b48aff", hair: "#b48aff", hairD: "#7a5ae0", eye: "#ff5aa0", eyeD: "#8a1a4a", style: "long", outfit: "#1a1a2a", tie: "#b48aff", smile: 1, ears: 1 },
    { bg: "#d6ffe8", bg2: "#7affb8", hair: "#4ad8a8", hairD: "#2aa07a", eye: "#2ac0ff", eyeD: "#0a4a7a", style: "twin", outfit: "#ffffff", tie: "#2ad8a8", bow: 1 },
    { bg: "#ffd6e2", bg2: "#ff7aa0", hair: "#3a2a3a", hairD: "#1a121a", eye: "#ff4a5a", eyeD: "#6a0a1a", style: "long", outfit: "#ffffff", tie: "#1a1a2a", smile: 1, text: "メイド" }
  ].map(animeGirl);
  ADS = [
    adScreen({ bg: "#1a0a2a", fg: "#ff4fb0", rings: 1, text: "ゲーム" }),
    adScreen({ bg: "#e8243c", can: "#ffffff", text: "ソーダ", ts: 22 }),
    adScreen({ bg: "#0a1a3a", fg: "#5ee0ff", pad: 1, text: "新作ゲーム", ts: 15 }),
    adScreen({ bg: "#ffe03f", fg: "#1a1a1a", rings: 1, text: "セール", tc: "#1a1a1a" }),
    adScreen({ bg: "#ffffff", fg: "#ff2a7a", rings: 1, text: "渋谷", tc: "#ff2a7a", ts: 26 })
  ];
  // ---------- Medallas ----------
  KUSHI_D = (function () { var p = "M6 38C6 18 18 8 32 8S58 18 58 38V43H6Z"; for (var i = 0; i < 17; i++) p += "M" + (7 + i * 3) + " 42H" + (9 + i * 3) + "V58Q" + (8 + i * 3) + " 60 " + (7 + i * 3) + " 58Z"; return p; })();
  FUMI_D = rectAt(13, 9, .6, 46, 9) + rectAt(13, 35, -.6, 46, 9) + "M29.5 22H34.5V58H29.5ZM22 56H42V62H22ZM16 41H48V45H16Z" + ellipseD(18, 48, 6, 6) + ellipseD(46, 48, 6, 6);
  HACHI_D = "M9 23C9 21 12 19 17 18C20 15 22 13 23 8L26 3C28 6 30 9 31 12C34 14 37 17 39 21C42 26 48 30 52 35C56 40 57 47 56 55V56H59V62H6V56H14C15 50 17 44 18 39C16 35 15 31 14 28C12 27 10 25 9 23Z" + ellipseD(51, 29, 5.4, 4.4);
  Object.assign(MEDALS, {
    machi: { metal: "gun", shape: FUMI_D, fieldPath: rectAt(15, 10.4, .6, 42, 4.6) + rectAt(15, 33.6, -.6, 42, 4.6), enamel: "#f2c230",
      enamelExtra: '<g stroke="#1a1a1a" stroke-width="2.6">' + [0, 8, 16, 24, 32, 40, 48, 56].map(function (x) { return '<path d="M' + x + ' 0L' + (x + 20) + ' 64"/>'; }).join("") + '</g>',
      over: '<circle cx="18" cy="48" r="3.8" fill="#e2321f"/><circle cx="17" cy="46.8" r="1.2" fill="#ffd0c8"/><circle cx="46" cy="48" r="3.8" fill="#e2321f"/><circle cx="45" cy="46.8" r="1.2" fill="#ffd0c8"/>' },
    geisha: { metal: "lacquer", shape: KUSHI_D, fieldPath: "M12 36C12 22 21 14 32 14S52 22 52 36Z", enamel: "#a8261c",
      enamelExtra: '<path d="M14 34C22 30 28 24 34 20 40 17 46 18 50 22" fill="none" stroke="#3a1a10" stroke-width="1.4"/>',
      gold: gPlum(24, 27, 2.6) + gPlum(38, 20, 2.2) + gPlum(46, 28, 2) + '<path d="M8 41H56" fill="none" stroke-width="1"/>' },
    akihabara: { metal: "silver", shape: ellipseD(32, 33, 27, 27), fieldPath: ellipseD(32, 33, 22.5, 22.5), enamel: "#ff6fb0",
      enamelExtra: '<rect x="0" y="33" width="64" height="31" fill="#eef4fb"/><ellipse cx="24" cy="22" rx="7" ry="3.6" fill="#fff" fill-opacity=".6" transform="rotate(-30 24 22)"/><path d="' + star(5, 6, 2.6, 32, 45, 0) + '" fill="#ffd84a"/>',
      em: '<path d="M7 33H57" fill="none" stroke-width="3.4"/>', gold: '<circle cx="32" cy="33" r="3.6"/>' },
    shibuya: { metal: "bronze", shape: HACHI_D, noField: true,
      em: '<path d="M21 40C21 46 22 50 23 55M36 44C40 48 44 52 46 56M28 7L29.5 12" fill="none" stroke-width="1"/><circle cx="18.5" cy="18" r="1.1"/>' }
  });
  // ---------- Paletas ----------
  insertPal("koi", { id: "machi", jp: "町", name: "Machi", days: 10, accent: "#2e8b6e", light: true, surfA: "c4",
    bg: "#f2e8d6", surface: "#fffaf0", raised: "#f3e8d4", hairline: "#dccbaa", text: "#24221c", muted: "#615a4c", faint: "#9a907c", status: "#2e8b6e",
    again: "#c0485a", hard: "#a06a24", good: "#3f8a5e", easy: "#3474a6",
    grad: "linear-gradient(180deg, #6ea6d4 0%, #bcd8e8 40%, #f4e3c4 70%, #d9c7a6 100%)", scene: machiBack, fx: machiFx, glow: "rgba(255,200,120,.2)",
    amb: [{ kind: "fall", shape: "leaf", colors: ["#7fa84a", "#a8c45a", "#5e8a3a"], n: 5, size: [9, 14], dur: [14, 22], o: 0.8 }],
    burst: { shapes: ["dot", "star", "leaf"], colors: ["#ffd27a", "#2e8b6e", "#ffffff", "#f2c230"] },
    pantone: "Inspirada en PANTONE Marigold 14-1050 (luz de tarde) y Arcadia 16-5533 (la franja verde del tren)" });
  insertPal("ajisai", { id: "geisha", jp: "芸者", name: "Geisha", days: 14, accent: "#b3243a", light: true, surfA: "d4",
    bg: "#ecdfc4", surface: "#f8f0dd", raised: "#efe2c6", hairline: "#d2bc90", text: "#2a1a16", muted: "#6a4e3e", faint: "#9c8268", status: "#9a1f2e",
    again: "#a8382c", hard: "#8a6420", good: "#4a6b3a", easy: "#34557a",
    grad: "#e6d4ac", tile: washi(), tileSize: "220px 220px", font: "Yuji Syuku", scene: geishaScene, glow: "rgba(179,36,58,.12)",
    amb: [{ kind: "fall", shape: "petal", colors: ["#c41e3a", "#e0445e", "#f07a8e"], n: 8, size: [7, 11], dur: [14, 22], o: 0.75 }],
    burst: { shapes: ["petal", "petal", "dot"], colors: ["#c41e3a", "#e0445e", "#c9a24a", "#1e2230"] },
    pantone: "Inspirada en PANTONE True Red 19-1664 (kimono), Deep Teal 19-4914 (estampado) y Sand Dollar 13-1106 (papel envejecido)" });
  insertPal("yoru", { id: "akihabara", jp: "秋葉原", name: "Akihabara", days: 93, accent: "#ff4fb0", surfA: "e8",
    bg: "#140a22", surface: "#1f1233", raised: "#2a1844", hairline: "#4a2a6e", text: "#fff2fb", muted: "#e6bce8", faint: "#9a7aaa", status: "#5ee0ff",
    grad: "#140a22", scene: akibaBack2, fx: akibaFx2, glow: "rgba(255,79,176,.22)",
    burst: { shapes: ["star", "star", "dot"], colors: ["#ff4fb0", "#5ee0ff", "#ffd84a", "#b48aff", "#ffffff"] },
    pantone: "Inspirada en PANTONE Pink Yarrow 17-2034 (neón rosa), Blue Atoll 16-4535 (neón azul) y Ultra Violet 18-3838 (noche)" });
  insertPal("akihabara", { id: "shibuya", jp: "渋谷", name: "Shibuya", days: 96, accent: "#ff4a5a", surfA: "e8",
    bg: "#0c1220", surface: "#141c2e", raised: "#1c263c", hairline: "#33415e", text: "#f4f6fb", muted: "#b8c2d8", faint: "#7a86a0", status: "#ffd23f",
    grad: "#0c1220", scene: shibuyaBack2, fx: shibuyaFx2, glow: "rgba(255,74,90,.2)",
    burst: { shapes: ["dot", "star", "dot"], colors: ["#ff4a5a", "#ffd23f", "#4ad0ff", "#ffffff"] },
    pantone: "Inspirada en PANTONE Fiery Red 18-1664 (pantallas y esquinas) y Classic Blue 19-4052 (noche)" });
}
