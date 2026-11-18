/* 秋葉原 Akihabara y 渋谷 Shibuya: escenas en 3D */
import { LED_DEFS, SANS, smilCycle } from "./machi-geisha.js";
import { MEDALS, f, star } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
// Cámara: proyecta puntos del mundo (metros) a la pantalla 400×860. pitch > 0 mira hacia abajo; yaw gira a la derecha.
export function makeCam(C, pitch, yaw, F, cx, cy) {
  var cp = Math.cos(pitch), sp = Math.sin(pitch), cw = Math.cos(yaw), sw = Math.sin(yaw);
  return function (x, y, z) {
    var dx = x - C[0], dy = y - C[1], dz = z - C[2], rx = dx * cw - dz * sw, rz = dx * sw + dz * cw;
    var yc = dy * cp + rz * sp, zc = Math.max(.05, -dy * sp + rz * cp);
    return [cx + F * rx / zc, cy - F * yc / zc, zc];
  };
}
export function poly(P, pts) { return 'M' + pts.map(function (p) { var q = P(p[0], p[1], p[2]); return f(q[0]) + ' ' + f(q[1]); }).join('L') + 'Z'; }
// matriz afín que lleva un rectángulo local (w×h) al cuadrilátero de esquinas a (arriba-izq), b (arriba-der), c (abajo-izq)
function quadMat(P, a, b, c, w, h) { var A = P(a[0], a[1], a[2]), B = P(b[0], b[1], b[2]), Cc = P(c[0], c[1], c[2]); return 'matrix(' + [(B[0] - A[0]) / w, (B[1] - A[1]) / w, (Cc[0] - A[0]) / h, (Cc[1] - A[1]) / h, A[0], A[1]].map(function (v) { return f(v); }).join(' ') + ')'; }
function ledScreen2(id, mat, w, h, variants, dur, shift, top) {
  var k0 = Math.max(w / 100, h / 160), ox = (w - 100 * k0) / 2, oy = top ? 0 : (h - 160 * k0) / 2, n = variants.length;
  var s = '<g transform="' + mat + '"><defs><clipPath id="' + id + '"><rect width="' + w + '" height="' + h + '"/></clipPath></defs><g clip-path="url(#' + id + ')"><g transform="translate(' + f(ox) + ' ' + f(oy) + ') scale(' + f(k0) + ')">';
  variants.forEach(function (v, k) { var kk = (k + shift) % n; s += '<g opacity="' + (kk === 0 ? 1 : 0) + '">' + (n > 1 ? smilCycle(n, kk, dur) : '') + v + '</g>'; });
  return s + '</g><rect width="' + w + '" height="' + h + '" fill="url(#led)"/><rect width="' + w + '" height="' + h + '" fill="url(#ledsh)"/></g><rect width="' + w + '" height="' + h + '" fill="none" stroke="#06030a" stroke-width="' + f(Math.max(w, h) / 60) + '"/></g>';
}

// ---------- ilustraciones anime detalladas para las pantallas (100×160) ----------
function girl2(o) {
  var id = o.id, s = '<defs><linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.bg1 + '"/><stop offset="1" stop-color="' + o.bg2 + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.hairL + '"/><stop offset=".4" stop-color="' + o.hair + '"/><stop offset="1" stop-color="' + o.hairD + '"/></linearGradient>' +
    '<linearGradient id="' + id + 'e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + o.eyeD + '"/><stop offset=".55" stop-color="' + o.eye + '"/><stop offset="1" stop-color="' + o.eyeL + '"/></linearGradient>' +
    '<radialGradient id="' + id + 's" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fff1ea"/><stop offset="1" stop-color="#ffd9cc"/></radialGradient>' +
    '<pattern id="' + id + 'p" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.2" fill="#fff" fill-opacity=".3"/></pattern></defs>';
  s += '<rect width="100" height="160" fill="url(#' + id + 'b)"/><rect width="100" height="160" fill="url(#' + id + 'p)"/>';
  s += '<circle cx="84" cy="20" r="30" fill="#fff" fill-opacity=".18"/><circle cx="10" cy="120" r="26" fill="#fff" fill-opacity=".14"/>';
  [[12, 18, 6], [90, 64, 4.4], [14, 70, 3.4], [86, 128, 5], [70, 10, 3]].forEach(function (p) { s += '<path d="' + star(4, p[2], p[2] * .22, p[0], p[1], 0) + '" fill="#fff"/>'; });
  [[86, 92], [16, 100]].forEach(function (p) { s += '<path d="M' + p[0] + ' ' + (p[1] + 5) + 'C' + (p[0] - 7) + ' ' + (p[1] - 1) + ' ' + (p[0] - 3) + ' ' + (p[1] - 6) + ' ' + p[0] + ' ' + (p[1] - 2) + 'C' + (p[0] + 3) + ' ' + (p[1] - 6) + ' ' + (p[0] + 7) + ' ' + (p[1] - 1) + ' ' + p[0] + ' ' + (p[1] + 5) + 'Z" fill="' + o.acc + '" fill-opacity=".8"/>'; });
  var HF = 'url(#' + id + 'h)';
  // pelo de detrás
  if (o.style === "twin") s += '<path d="M28 34C6 40 -2 80 4 120 8 140 16 156 10 160 26 150 26 120 22 96 20 74 26 56 34 46Z" fill="' + HF + '"/><path d="M72 34C94 40 102 80 96 120 92 140 84 156 90 160 74 150 74 120 78 96 80 74 74 56 66 46Z" fill="' + HF + '"/>' +
    '<path d="M14 60C10 90 12 120 16 144M86 60C90 90 88 120 84 144M20 56C16 86 18 112 22 136M80 56C84 86 82 112 78 136" fill="none" stroke="' + o.hairD + '" stroke-width=".8" stroke-opacity=".7"/>';
  else s += '<path d="M20 48C10 90 8 130 12 160H88C92 130 90 90 80 48C78 26 64 14 50 14S22 26 20 48Z" fill="' + HF + '"/><path d="M18 80C16 110 18 140 20 160M82 80C84 110 82 140 80 160M24 70C22 100 24 130 26 160M76 70C78 100 76 130 74 160" fill="none" stroke="' + o.hairD + '" stroke-width=".8" stroke-opacity=".7"/>';
  // ropa
  s += '<path d="M43 88H57V106C54 109 46 109 43 106Z" fill="#f6cdbf"/><path d="M43 92Q50 98 57 92V96Q50 101 43 96Z" fill="#e8b0a2"/>';
  if (o.outfit === "maid") s += '<path d="M8 160C10 126 26 108 50 106S90 126 92 160Z" fill="#1c1622"/><path d="M34 120H66L70 160H30Z" fill="#fff"/><path d="M30 160Q34 156 38 160Q42 156 46 160Q50 156 54 160Q58 156 62 160Q66 156 70 160" fill="#fff" stroke="#e8e0ea" stroke-width=".6"/>' +
    '<path d="M30 106Q40 116 50 112Q60 116 70 106L72 112Q60 124 50 118Q40 124 28 112Z" fill="#fff" stroke="#e8e0ea" stroke-width=".6"/><path d="M44 114L50 120 56 114 50 126Z" fill="' + o.acc + '"/><circle cx="50" cy="120" r="2.4" fill="' + o.acc + '"/>';
  else if (o.outfit === "hoodie") s += '<path d="M8 160C10 124 26 106 50 104S90 124 92 160Z" fill="' + o.cloth + '"/><path d="M30 108C34 122 66 122 70 108" fill="none" stroke="' + o.hairD + '" stroke-opacity=".3" stroke-width="3"/><path d="M42 114V136M58 114V136" stroke="#fff" stroke-width="1.6"/><circle cx="42" cy="137" r="1.8" fill="#fff"/><circle cx="58" cy="137" r="1.8" fill="#fff"/>' +
    '<path d="M24 104C18 96 20 86 28 84H34C30 90 30 98 34 104Z" fill="#2a2a34"/><path d="M76 104C82 96 80 86 72 84H66C70 90 70 98 66 104Z" fill="#2a2a34"/><path d="M30 92Q50 70 70 92" fill="none" stroke="#2a2a34" stroke-width="3"/><circle cx="27" cy="94" r="3" fill="' + o.acc + '"/><circle cx="73" cy="94" r="3" fill="' + o.acc + '"/>';
  else s += '<path d="M8 160C10 126 26 108 50 106S90 126 92 160Z" fill="#fbfbfd"/><path d="M30 108L50 134 70 108 86 120 66 142 50 152 34 142 14 120Z" fill="' + o.cloth + '"/><path d="M20 122L34 138M80 122L66 138" stroke="#fff" stroke-width="1.4"/>' +
    '<path d="M50 134L38 126 40 144ZM50 134L62 126 60 144Z" fill="' + o.acc + '"/><circle cx="50" cy="134" r="3" fill="' + o.acc + '"/>';
  // cara
  s += '<path d="M29 50C29 76 40 93 50 93S71 76 71 50C71 32 61 26 50 26S29 32 29 50Z" fill="url(#' + id + 's)"/>';
  s += '<path d="M30 52C38 57 62 57 70 52L70 57C62 62 38 62 30 57Z" fill="#f2bfb2" fill-opacity=".65"/>';
  // ojos (izquierdo y su reflejo)
  var eye = '<path d="M31 63C33 55 45 54 47 62C46 71 41 75 39 75S32 71 31 63Z" fill="#fff"/><ellipse cx="39.5" cy="65.5" rx="6.6" ry="8.6" fill="url(#' + id + 'e)"/><ellipse cx="39.5" cy="65.5" rx="6.6" ry="8.6" fill="none" stroke="' + o.eyeD + '" stroke-width=".8"/>' +
    '<ellipse cx="39.5" cy="66.5" rx="3.2" ry="4.6" fill="#1a0a1a" fill-opacity=".8"/><path d="M34.5 70Q39.5 74 44.5 70" fill="none" stroke="' + o.eyeL + '" stroke-width="1.4" stroke-opacity=".9"/>' +
    '<ellipse cx="36.6" cy="61" rx="2.6" ry="3.4" fill="#fff"/><circle cx="42.6" cy="69.6" r="1.3" fill="#fff"/><circle cx="43.4" cy="62" r=".8" fill="#fff"/>' +
    '<path d="M29.4 60C32 52 44 50 48.6 58L49.4 56C45 48 31 49 28.6 58Z" fill="#2a1626"/><path d="M29.6 60L26.4 62.6 29.6 57.4Z" fill="#2a1626"/><path d="M33 52.4L31.4 50M37 51.4L36 48.8M42 51.6L42.4 49" stroke="#2a1626" stroke-width=".8"/>' +
    '<path d="M33.6 73.4Q39 75.6 45 72" fill="none" stroke="#6a3a4a" stroke-width=".7"/><path d="M32.4 48.4Q38 45.6 45 47.4" fill="none" stroke="' + o.hairD + '" stroke-width="1.2" stroke-linecap="round"/>';
  s += eye + '<g transform="translate(100 0) scale(-1 1)">' + eye + '</g>';
  s += '<ellipse cx="34" cy="77" rx="6" ry="2.6" fill="#ff8fa8" fill-opacity=".5"/><ellipse cx="66" cy="77" rx="6" ry="2.6" fill="#ff8fa8" fill-opacity=".5"/><path d="M31 77l1.6 -2.4M34 77l1.6 -2.4M37 77l1.6 -2.4M63 77l1.6 -2.4M66 77l1.6 -2.4M69 77l1.6 -2.4" stroke="#f06a8a" stroke-width=".6"/>';
  s += '<path d="M50 73l-.8 2" stroke="#e0a090" stroke-width=".8" stroke-linecap="round"/>';
  s += o.mouth === "cat" ? '<path d="M45 81q2.5 2.6 5 0q2.5 2.6 5 0" fill="none" stroke="#8a2a3a" stroke-width="1" stroke-linecap="round"/>' : '<path d="M44.6 80Q50 87.4 55.4 80Q50 81.6 44.6 80Z" fill="#a8304a"/><path d="M47 83.4Q50 85.6 53 83.4Q50 82.4 47 83.4Z" fill="#ff8fa8"/>';
  // flequillo y mechones
  s += '<path d="M26 34C20 52 22 80 26 104 28 90 30 70 34 52Z" fill="' + HF + '"/><path d="M74 34C80 52 78 80 74 104 72 90 70 70 66 52Z" fill="' + HF + '"/>';
  s += '<path d="M25 58C21 30 35 14 50 14S79 30 75 58C73 48 69 42 65 39C65 47 63 54 60 58C58 48 56 41 54 37C52 45 50 52 47 57C46 47 44 40 42 37C40 45 37 52 34 57C33 49 31 44 29 42C27 48 26 53 25 58Z" fill="' + HF + '"/>';
  s += '<path d="M42 37C40 30 46 22 50 18M54 37C56 30 54 22 50 18M65 39C64 30 60 24 56 20M29 42C30 34 34 26 40 22" fill="none" stroke="' + o.hairD + '" stroke-width=".7" stroke-opacity=".8"/>';
  s += '<path d="M31 30Q37 24 42 27Q46 22 50 25Q55 21 59 26Q64 23 69 29" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2.2" stroke-linecap="round"/>';
  s += '<path d="M50 14C47 6 52 2 56 4 52 6 51 10 52 14Z" fill="' + HF + '"/>';
  // accesorios
  if (o.style === "twin") s += '<path d="M24 34L30 26 34 36ZM76 34L70 26 66 36Z" fill="' + o.acc + '"/><circle cx="28" cy="32" r="3.2" fill="' + o.acc + '"/><circle cx="72" cy="32" r="3.2" fill="' + o.acc + '"/>';
  if (o.ears) s += '<path d="M28 30L24 6 44 20Z" fill="' + HF + '"/><path d="M72 30L76 6 56 20Z" fill="' + HF + '"/><path d="M30 25L28 12 39 20Z" fill="#ffb8cc"/><path d="M70 25L72 12 61 20Z" fill="#ffb8cc"/>';
  if (o.outfit === "maid") s += '<path d="M28 26Q50 12 72 26L70 30Q50 18 30 30Z" fill="#fff" stroke="#e8e0ea" stroke-width=".6"/><path d="M32 24Q36 18 40 22Q44 16 50 20Q56 16 60 22Q64 18 68 24" fill="#fff" stroke="#e8e0ea" stroke-width=".6"/>';
  if (o.clip) s += '<path d="' + star(5, 4.6, 2, 66, 40, 0) + '" fill="' + o.acc + '" stroke="#fff" stroke-width=".6"/>';
  if (o.text) s += '<rect x="0" y="140" width="100" height="20" fill="' + o.acc + '" fill-opacity=".9"/><text x="50" y="155" font-family="' + SANS + '" font-weight="900" font-size="13" text-anchor="middle" fill="#fff">' + o.text + '</text>';
  return s;
}
var GIRLS2;
function ad2(o) { // anuncios grandes (100×160)
  var s = '<rect width="100" height="160" fill="' + o.bg + '"/>';
  if (o.burst) for (var k = 0; k < 16; k++) { var a = k / 16 * Math.PI * 2; s += '<path d="M50 70L' + f(50 + Math.cos(a) * 90) + ' ' + f(70 + Math.sin(a) * 90) + 'L' + f(50 + Math.cos(a + .2) * 90) + ' ' + f(70 + Math.sin(a + .2) * 90) + 'Z" fill="' + o.fg + '" fill-opacity=".35"/>'; }
  if (o.can) s += '<rect x="30" y="26" width="40" height="88" rx="8" fill="#f4f6fa"/><rect x="30" y="50" width="40" height="30" fill="' + o.fg + '"/><text x="50" y="70" font-family="' + SANS + '" font-weight="900" font-size="11" text-anchor="middle" fill="#fff">' + o.can + '</text><ellipse cx="50" cy="27" rx="20" ry="5" fill="#c8ccd4"/><path d="M38 32V108" stroke="#fff" stroke-width="4" stroke-opacity=".6"/>' + [[22, 40], [80, 52], [24, 96], [78, 100]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="none" stroke="#fff" stroke-width="1.2"/>'; }).join("");
  if (o.pad) s += '<path d="M14 72C14 54 28 50 40 54H60C72 50 86 54 86 72 86 94 74 100 64 90L58 84H42L36 90C26 100 14 94 14 72Z" fill="' + o.fg + '"/><path d="M26 70H40M33 63V77" stroke="' + o.bg + '" stroke-width="4"/><circle cx="64" cy="66" r="3.6" fill="' + o.bg + '"/><circle cx="72" cy="73" r="3.6" fill="' + o.bg + '"/>';
  if (o.claw) s += '<path d="M50 10V52" stroke="#c8ccd4" stroke-width="3"/><path d="M40 52H60L64 70 58 66 54 74 50 64 46 74 42 66 36 70Z" fill="#c8ccd4"/><circle cx="50" cy="96" r="16" fill="' + o.fg + '"/><circle cx="44" cy="92" r="2" fill="#2a1a2a"/><circle cx="56" cy="92" r="2" fill="#2a1a2a"/><path d="M46 100Q50 104 54 100" fill="none" stroke="#2a1a2a" stroke-width="1.4"/><ellipse cx="38" cy="82" rx="5" ry="7" fill="' + o.fg + '"/><ellipse cx="62" cy="82" rx="5" ry="7" fill="' + o.fg + '"/>';
  return s + '<text x="50" y="' + (o.ty || 142) + '" font-family="' + SANS + '" font-weight="900" font-size="' + (o.ts || 20) + '" text-anchor="middle" fill="' + (o.tc || "#fff") + '" stroke="' + (o.tsk || "none") + '" stroke-width="2" paint-order="stroke">' + o.text + '</text>' + (o.sub ? '<text x="50" y="156" font-family="' + SANS + '" font-weight="700" font-size="8" text-anchor="middle" fill="' + (o.tc || "#fff") + '">' + o.sub + '</text>' : '');
}
var ADS2;

function gacha(x, y, sc, col, sd) {
  var rr = seeded(sd), o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><rect x="-4" y="-4" width="48" height="74" rx="5" fill="' + col + '" fill-opacity=".45" filter="url(#abl2)"/><rect width="40" height="66" rx="3" fill="' + col + '"/><rect x="3" y="3" width="34" height="30" rx="2" fill="#dff4ff" fill-opacity=".9"/>';
  for (var k = 0; k < 9; k++) { var cx = 8 + (k % 3) * 12 + rr() * 2, cy = 12 + Math.floor(k / 3) * 8.6 + rr() * 2; o += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="4.6" fill="' + ["#ff5aa0", "#5ad0ff", "#ffe05a", "#9aff7a", "#c78bff"][(rr() * 5) | 0] + '"/><path d="M' + f(cx - 4.6) + ' ' + f(cy) + 'H' + f(cx + 4.6) + '" stroke="#fff" stroke-width="1"/><circle cx="' + f(cx - 1.6) + '" cy="' + f(cy - 1.8) + '" r="1.1" fill="#fff"/>'; }
  return o + '<path d="M3 5H37" stroke="#fff" stroke-opacity=".7" stroke-width="2"/><rect x="3" y="36" width="34" height="8" fill="#fff"/><text x="20" y="42.6" font-family="' + SANS + '" font-weight="900" font-size="7" text-anchor="middle" fill="' + col + '">ガチャ</text>' +
    '<circle cx="14" cy="54" r="6" fill="#e9edf2" stroke="#8a8f99"/><path d="M10 54H18" stroke="#8a8f99" stroke-width="2.4"/><rect x="25" y="49" width="10" height="10" rx="2" fill="#1a1a22"/></g>';
}
var AKP = null;
function akCam() { return AKP || (AKP = makeCam([0.6, 2.4, -10], -0.15, 0, 330, 200, 470)); }
var AK_L = [[2, 13, 30, 0], [13, 25, 44, .8], [25, 38, 36, 0], [38, 52, 50, 1.2], [52, 66, 32, .4], [80, 100, 42, .6], [100, 128, 58, 0]];
var AK_R = [[2, 15, 48, 0], [15, 28, 34, 1], [28, 42, 54, .4], [42, 56, 38, 1.4], [56, 68, 28, .2], [80, 96, 46, .8], [96, 126, 62, 0]];
var AK_WORDS = ["アニメ", "ゲーム", "フィギュア", "カード", "ホビー", "コミック", "PCパーツ", "中古", "買取", "カラオケ", "メイド", "ガチャ", "模型", "グッズ", "免税", "電気", "同人", "ゲーセン"];
var NEON = ["#ff3d9a", "#ff5ac8", "#5ee0ff", "#ffd23f", "#ff4a3a", "#b48aff", "#3aff9a", "#ff8a3a"];
// pantallas grandes: [lado (-1 izq, 1 der, 0 frontal), z0, z1 (o x0,x1 si frontal), y0, y1, z frontal, variantes, duración, alineado arriba]
var AK_SCREENS2 = [[-1, 7, 18, 8, 24], [1, 10, 19, 5, 27, 0, 1], [1, 31, 40, 16, 28], [-1, 28, 37, 18, 30], [0, -7, 7, 22, 33, 101], [0, -11, -5.6, 13, 24, 47]];
function akWallX(side, b) { return side * (AKW_ + b[3]); }
var AKW_ = 11;
export function akibaBack2() {
  var P = akCam(), r = seeded(901), s = '<defs><linearGradient id="aks" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05030c"/><stop offset=".45" stop-color="#160a26"/><stop offset=".62" stop-color="#3a1240"/><stop offset="1" stop-color="#1a0818"/></linearGradient>' +
    '<filter id="abl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter><filter id="abl2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter><filter id="abl3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.2"/></filter></defs>';
  s += '<rect width="400" height="860" fill="url(#aks)"/>';
  for (var st = 0; st < 40; st++) s += '<circle cx="' + f(120 + r() * 160) + '" cy="' + f(r() * 300) + '" r="' + f(.3 + r() * .7) + '" fill="#fff" fill-opacity="' + f(.3 + r() * .5) + '"/>';
  // torres del fondo
  [[-9, 9, 150, 112, "#14122a"], [-26, -10, 170, 80, "#120f24"], [10, 24, 160, 92, "#16132c"], [24, 40, 190, 70, "#110e22"]].forEach(function (t) {
    s += '<path d="' + poly(P, [[t[0], 0, t[2]], [t[0], t[3], t[2]], [t[1], t[3], t[2]], [t[1], 0, t[2]]]) + '" fill="' + t[4] + '"/>';
    for (var y = 3; y < t[3] - 2; y += 3) for (var x = t[0] + .6; x < t[1] - .8; x += 1.4) if (r() > .35) s += '<path d="' + poly(P, [[x, y, t[2]], [x, y + 1.6, t[2]], [x + .8, y + 1.6, t[2]], [x + .8, y, t[2]]]) + '" fill="' + (r() > .3 ? "#cfe8ff" : "#ffe7b0") + '" fill-opacity="' + f(.3 + r() * .55) + '"/>';
    s += '<circle cx="' + f(P((t[0] + t[1]) / 2, t[3] + 3, t[2])[0]) + '" cy="' + f(P((t[0] + t[1]) / 2, t[3] + 3, t[2])[1]) + '" r="1.6" fill="#ff3a3a"/>';
  });
  // fachadas a ambos lados
  function building(side, b, bi) {
    var x = akWallX(side, b), z0 = b[0], z1 = b[1], h = b[2], o = '';
    var col = ["#22102e", "#1c0e2a", "#26123a", "#1e1030"][bi % 4];
    // cara frontal (escalón respecto al edificio anterior)
    o += '<path d="' + poly(P, [[x, 0, z0], [x, h, z0], [x + side * 6, h, z0], [x + side * 6, 0, z0]]) + '" fill="#2e1640"/>';
    o += '<path d="' + poly(P, [[x, 0, z0], [x, h, z0], [x, h, z1], [x, 0, z1]]) + '" fill="' + col + '"/>';
    // ventanas por plantas
    for (var y = 4.2; y < h - 1.5; y += 3.6) {
      o += '<path d="' + poly(P, [[x, y - .3, z0], [x, y - .1, z0], [x, y - .1, z1], [x, y - .3, z1]]) + '" fill="#3c2050"/>';
      for (var z = z0 + .4; z < z1 - .8; z += 1.9) { if (r() < .22) continue; var lit = r(); o += '<path d="' + poly(P, [[x, y + .6, z], [x, y + 2.4, z], [x, y + 2.4, z + 1.4], [x, y + .6, z + 1.4]]) + '" fill="' + (lit > .7 ? "#ffb8e8" : lit > .4 ? "#fff0d8" : lit > .2 ? "#9fd8ff" : "#2a1838") + '" fill-opacity="' + f(.55 + r() * .4) + '"/>'; }
    }
    o += '<path d="' + poly(P, [[x, h, z0], [x, h + .6, z0], [x, h + .6, z1], [x, h, z1]]) + '" fill="#4a2a5a"/>';
    // carteles en la fachada (horizontales) y luces de la planta baja
    o += '<path d="' + poly(P, [[x, 0, z0], [x, 3.4, z0], [x, 3.4, z1], [x, 0, z1]]) + '" fill="' + ["#ffd0ec", "#fff2dc", "#d8ecff"][bi % 3] + '" fill-opacity=".8"/>';
    for (var sg = 0; sg < 3; sg++) { var yy = 4 + r() * (h - 10), zz = z0 + r() * (z1 - z0 - 5), zl = 3 + r() * 3, c = NEON[(r() * NEON.length) | 0], word = AK_WORDS[(r() * AK_WORDS.length) | 0];
      var q = [[x, yy + 1.6, zz], [x, yy + 1.6, zz + zl], [x, yy, zz]];
      o += '<path d="' + poly(P, [[x, yy, zz], [x, yy + 1.6, zz], [x, yy + 1.6, zz + zl], [x, yy, zz + zl]]) + '" fill="' + c + '" fill-opacity=".6" filter="url(#abl2)"/><path d="' + poly(P, [[x, yy, zz], [x, yy + 1.6, zz], [x, yy + 1.6, zz + zl], [x, yy, zz + zl]]) + '" fill="#14081c" stroke="' + c + '" stroke-width="1"/>';
      o += '<text transform="' + quadMat(P, q[0], q[1], q[2], 100, 26) + '" x="50" y="20" font-family="' + SANS + '" font-weight="900" font-size="' + f(Math.min(22, 170 / word.length)) + '" text-anchor="middle" fill="#fff4fb" stroke="' + c + '" stroke-width="1.6" paint-order="stroke">' + word + '</text>'; }
    return o;
  }
  // de lejos a cerca
  var segs = [];
  AK_L.forEach(function (b, i) { segs.push([-1, b, i]); }); AK_R.forEach(function (b, i) { segs.push([1, b, i]); });
  segs.sort(function (a, b) { return b[1][0] - a[1][0]; }).forEach(function (sg) { s += building(sg[0], sg[1], sg[2]); });
  // brillo de las pantallas (detrás de ellas)
  AK_SCREENS2.forEach(function (q) { var c = q[0] === 0 ? [[q[1], q[4], q[5]], [q[2], q[4], q[5]], [q[2], q[3], q[5]], [q[1], q[3], q[5]]] : [[q[0] * AKW_, q[3], q[1]], [q[0] * AKW_, q[4], q[1]], [q[0] * AKW_, q[4], q[2]], [q[0] * AKW_, q[3], q[2]]]; s += '<path d="' + poly(P, c) + '" fill="' + NEON[(q[1] * 7 | 0) % NEON.length] + '" fill-opacity=".9" filter="url(#abl)"/>'; });
  // carteles verticales perpendiculares a la fachada (de cara a la cámara)
  var blades = [[-1, 12, 4, 22, "クレーンゲーム", "#ff3d9a"], [-1, 24, 8, 26, "フィギュア", "#b48aff"], [-1, 36, 6, 20, "ゲームセンター", "#ff5ac8"], [-1, 50, 10, 24, "コミック", "#5ee0ff"], [-1, 62, 6, 18, "カード", "#ffd23f"], [1, 26, 6, 24, "メイドカフェ♥", "#ff5ac8"], [1, 40, 8, 26, "アニメ専門店", "#ff4a3a"], [1, 54, 6, 18, "PCパーツ", "#3aff9a"], [1, 64, 8, 20, "秋葉原", "#ff3d9a"], [-1, 88, 10, 30, "ホビー天国", "#ffd23f"], [1, 88, 10, 30, "ガチャ", "#5ee0ff"]];
  blades.sort(function (a, b) { return b[1] - a[1]; }).forEach(function (bl) {
    var x0 = bl[0] * AKW_, x1 = bl[0] * (AKW_ - 2.2), z = bl[1], c = bl[5];
    var A = bl[0] < 0 ? [x0, bl[3], z] : [x1, bl[3], z], B = bl[0] < 0 ? [x1, bl[3], z] : [x0, bl[3], z], C = bl[0] < 0 ? [x0, bl[2], z] : [x1, bl[2], z], L = bl[3] - bl[2];
    s += '<path d="' + poly(P, [[x0, bl[2], z], [x0, bl[3], z], [x1, bl[3], z], [x1, bl[2], z]]) + '" fill="' + c + '" filter="url(#abl2)"/><path d="' + poly(P, [[x0, bl[2], z], [x0, bl[3], z], [x1, bl[3], z], [x1, bl[2], z]]) + '" fill="#fff8fd" stroke="' + c + '" stroke-width="1.4"/>';
    var len = bl[4].length, fs = Math.min(70, 1000 / len);
    s += '<g transform="' + quadMat(P, A, B, C, 100, L * 40) + '"><rect width="100" height="' + (L * 40) + '" fill="' + c + '" fill-opacity=".9"/><rect x="8" y="8" width="84" height="' + (L * 40 - 16) + '" fill="#fff" fill-opacity=".14"/><text x="50" y="' + f(fs * .2 + 20) + '" writing-mode="tb" font-family="' + SANS + '" font-weight="900" font-size="' + f(fs) + '" fill="#fff" stroke="#3a0a2a" stroke-width="3" paint-order="stroke">' + bl[4] + '</text></g>';
  });
  // puente del tren
  var bz = 73;
  s += '<path d="' + poly(P, [[-40, 6.2, bz], [-40, 10, bz], [40, 10, bz], [40, 6.2, bz]]) + '" fill="#1f5a48"/>';
  for (var bx = -40; bx < 40; bx += 2.2) s += '<path d="M' + P(bx, 6.4, bz).map(f).slice(0, 2).join(' ') + 'L' + P(bx + 2.2, 9.8, bz).map(f).slice(0, 2).join(' ') + 'M' + P(bx + 2.2, 6.4, bz).map(f).slice(0, 2).join(' ') + 'L' + P(bx, 9.8, bz).map(f).slice(0, 2).join(' ') + '" stroke="#3a8a70" stroke-width="1.2"/>';
  s += '<path d="' + poly(P, [[-40, 9.6, bz], [-40, 10.4, bz], [40, 10.4, bz], [40, 9.6, bz]]) + '" fill="#4aa088"/><path d="' + poly(P, [[-40, 6, bz], [-40, 6.6, bz], [40, 6.6, bz], [40, 6, bz]]) + '" fill="#123a30"/>';
  [-7.5, 7.5].forEach(function (px) { s += '<path d="' + poly(P, [[px - .5, 0, bz], [px - .5, 6.2, bz], [px + .5, 6.2, bz], [px + .5, 0, bz]]) + '" fill="#163a32"/>'; });
  for (var bl2 = -10; bl2 <= 10; bl2 += 2) { var lp = P(bl2, 6, bz); s += '<circle cx="' + f(lp[0]) + '" cy="' + f(lp[1]) + '" r="1.6" fill="#fff0c8"/>'; }
  // calle: calzada, aceras, paso de cebra y reflejos de neón
  s += '<path d="' + poly(P, [[-7, 0, -12], [-7, 0, 200], [7, 0, 200], [7, 0, -12]]) + '" fill="#120a16"/>';
  [-1, 1].forEach(function (sd) { s += '<path d="' + poly(P, [[sd * 7, 0, -12], [sd * 7, 0, 200], [sd * AKW_, 0, 200], [sd * AKW_, 0, -12]]) + '" fill="#2a1a2e"/><path d="' + poly(P, [[sd * 7, 0, -12], [sd * 7, 0, 200], [sd * 7.2, .15, 200], [sd * 7.2, .15, -12]]) + '" fill="#4a3a52"/>'; });
  for (var cw = -6.6; cw < 6.6; cw += 1.1) s += '<path d="' + poly(P, [[cw, 0, -1], [cw, 0, 2.5], [cw + .55, 0, 2.5], [cw + .55, 0, -1]]) + '" fill="#d8d0dc" fill-opacity=".8"/>';
  for (var dz = 12; dz < 120; dz += 6) s += '<path d="' + poly(P, [[-.1, 0, dz], [-.1, 0, dz + 3], [.1, 0, dz + 3], [.1, 0, dz]]) + '" fill="#e8e0d0" fill-opacity=".7"/>';
  [[-4, "#ff3d9a"], [4, "#5ee0ff"], [-1, "#ffd23f"], [2, "#ff5ac8"]].forEach(function (rf) { s += '<path d="' + poly(P, [[rf[0] - .8, 0, -8], [rf[0] - .8, 0, 60], [rf[0] + .8, 0, 60], [rf[0] + .8, 0, -8]]) + '" fill="' + rf[1] + '" fill-opacity=".22" filter="url(#abl)"/>'; });
  for (var wr = 0; wr < 70; wr++) { var wx = (r() - .5) * 13, wz = -8 + r() * 40, wl = 1 + r() * 4, c3 = NEON[(r() * NEON.length) | 0]; s += '<path d="' + poly(P, [[wx - .06, 0, wz], [wx - .06, 0, wz + wl], [wx + .06, 0, wz + wl], [wx + .06, 0, wz]]) + '" fill="' + c3 + '" fill-opacity="' + f(.2 + r() * .35) + '"/>'; }
  [[-3, -4], [3, 8]].forEach(function (m) { s += '<path d="' + poly(P, [[m[0] - .4, .01, m[1] - .4], [m[0] - .4, .01, m[1] + .4], [m[0] + .4, .01, m[1] + .4], [m[0] + .4, .01, m[1] - .4]]) + '" fill="#2a2030" stroke="#4a3a50"/>'; });
  // farolas y árboles de la calle
  [[-8.4, 16], [8.4, 22], [-8.4, 34], [8.4, 40], [-8.4, 52], [8.4, 58]].sort(function (a, b) { return b[1] - a[1]; }).forEach(function (t, i) {
    var b0 = P(t[0], 0, t[1]), sc = 330 / b0[2];
    if (i % 2) { s += '<path d="' + poly(P, [[t[0] - .08, 0, t[1]], [t[0] - .08, 6, t[1]], [t[0] + .08, 6, t[1]], [t[0] + .08, 0, t[1]]]) + '" fill="#2a2a34"/>'; var lp2 = P(t[0] - Math.sign(t[0]) * .8, 6, t[1]); s += '<circle cx="' + f(lp2[0]) + '" cy="' + f(lp2[1]) + '" r="' + f(sc * 1.4) + '" fill="#fff0c8" fill-opacity=".35" filter="url(#abl2)"/><circle cx="' + f(lp2[0]) + '" cy="' + f(lp2[1]) + '" r="' + f(sc * .2) + '" fill="#fff8e8"/>'; }
    else { s += '<path d="' + poly(P, [[t[0] - .12, 0, t[1]], [t[0] - .12, 3, t[1]], [t[0] + .12, 3, t[1]], [t[0] + .12, 0, t[1]]]) + '" fill="#2a1a1a"/>'; var tp = P(t[0], 4.4, t[1]); for (var lv = 0; lv < 40; lv++) s += '<circle cx="' + f(tp[0] + (r() - .5) * sc * 3.4) + '" cy="' + f(tp[1] + (r() - .5) * sc * 2.6) + '" r="' + f(sc * (.3 + r() * .35)) + '" fill="' + ["#1a3a22", "#24502e", "#2e6a3a", "#5a3a6a"][(r() * 4) | 0] + '"/>'; }
  });
  // gente en las aceras y cruzando
  var ppl = [];
  for (var n = 0; n < 340; n++) { var side = r() > .5 ? 1 : -1, zz = n < 26 ? -5.5 + r() * 5 : n < 80 ? 0 + r() * 4 : 4 + Math.pow(r(), 1.3) * 56, xx = n < 26 ? (r() - .5) * 6.4 : n < 80 ? (r() - .5) * 12 : (r() < .35 ? (r() - .5) * 13 : side * (7.4 + r() * 3.2)); ppl.push([xx, zz]); }
  ppl.sort(function (a, b) { return b[1] - a[1]; }).forEach(function (p) {
    var hgt = 1.55 + r() * .3, ft = P(p[0], 0, p[1]), hd = P(p[0], hgt, p[1]), h = ft[1] - hd[1], w = h * .26, x = ft[0], top = hd[1];
    var cloth = ["#3a2a4a", "#4a3a5a", "#2a2a3a", "#6a4a6a", "#5a5a6a", "#8a6a8a", "#c8b8d0", "#2a3a5a"][(r() * 8) | 0], rim = NEON[(r() * NEON.length) | 0], hair = ["#1a1018", "#3a2418", "#5a3a2a", "#c8a070"][(r() * 4) | 0], stepL = (r() - .5) * w * .5;
    s += '<path d="M' + f(x - w * .3) + ' ' + f(ft[1]) + 'L' + f(x - w * .18 + stepL) + ' ' + f(top + h * .55) + 'H' + f(x - w * .02) + 'L' + f(x - w * .08) + ' ' + f(ft[1]) + 'ZM' + f(x + w * .08) + ' ' + f(ft[1]) + 'L' + f(x + w * .02) + ' ' + f(top + h * .55) + 'H' + f(x + w * .18 - stepL) + 'L' + f(x + w * .3) + ' ' + f(ft[1]) + 'Z" fill="#100a14"/>';
    s += '<path d="M' + f(x - w * .5) + ' ' + f(top + h * .58) + 'Q' + f(x - w * .55) + ' ' + f(top + h * .2) + ' ' + f(x) + ' ' + f(top + h * .17) + 'Q' + f(x + w * .55) + ' ' + f(top + h * .2) + ' ' + f(x + w * .5) + ' ' + f(top + h * .58) + 'Z" fill="' + cloth + '"/>';
    s += '<path d="M' + f(x + w * .46) + ' ' + f(top + h * .22) + 'Q' + f(x + w * .58) + ' ' + f(top + h * .4) + ' ' + f(x + w * .5) + ' ' + f(top + h * .58) + '" fill="none" stroke="' + rim + '" stroke-opacity=".85" stroke-width="' + f(Math.max(.6, h * .03)) + '"/>';
    s += '<circle cx="' + f(x) + '" cy="' + f(top + h * .09) + '" r="' + f(h * .085) + '" fill="#d8a898"/><path d="M' + f(x - h * .09) + ' ' + f(top + h * .1) + 'A' + f(h * .09) + ' ' + f(h * .09) + ' 0 0 1 ' + f(x + h * .09) + ' ' + f(top + h * .1) + 'Z" fill="' + hair + '"/>';
    if (r() > .7) s += '<rect x="' + f(x + w * .4) + '" y="' + f(top + h * .4) + '" width="' + f(w * .4) + '" height="' + f(h * .16) + '" rx="1" fill="' + rim + '" fill-opacity=".8"/>';
  });
  // máquinas de gachapon delante, a ambos lados
  [[-3.9, -5.4, 1], [1.7, -5.4, -1]].forEach(function (g) {
    for (var row = 0; row < 3; row++) for (var k = 0; k < 4; k++) { var x0 = g[0] + k * .55, y0 = row * .86, A = [x0, y0 + .86, g[1]], B = [x0 + .52, y0 + .86, g[1]], C = [x0, y0, g[1]];
      s += '<g transform="' + quadMat(P, A, B, C, 40, 66) + '">' + gacha(0, 0, 1, NEON[(k + row * 3 + (g[2] > 0 ? 0 : 4)) % NEON.length], k + row * 5 + (g[2] > 0 ? 0 : 20)) + '</g>'; }
  });
  return svg(s, 400, 860);
}
function akibaAnim2() {
  var P = akCam(), s = '<defs>' + LED_DEFS + '<linearGradient id="tb3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eceef4"/><stop offset="1" stop-color="#9ea2ae"/></linearGradient></defs>';
  var VAR = [[GIRLS2[0], ADS2[0], GIRLS2[3]], [GIRLS2[5], GIRLS2[1], GIRLS2[6]], [GIRLS2[2], ADS2[2]], [ADS2[3], GIRLS2[4], ADS2[1]], [GIRLS2[7], GIRLS2[0], ADS2[2]], [GIRLS2[6], ADS2[0]]];
  var DUR = [9, 10.5, 7, 8, 11, 6.4];
  AK_SCREENS2.forEach(function (q, i) {
    var A, B, C, w, h;
    if (q[0] === 0) { A = [q[1], q[4], q[5]]; B = [q[2], q[4], q[5]]; C = [q[1], q[3], q[5]]; w = (q[2] - q[1]) * 10; }
    else { var x = q[0] * AKW_; A = q[0] < 0 ? [x, q[4], q[1]] : [x, q[4], q[2]]; B = q[0] < 0 ? [x, q[4], q[2]] : [x, q[4], q[1]]; C = q[0] < 0 ? [x, q[3], q[1]] : [x, q[3], q[2]]; w = (q[2] - q[1]) * 10; }
    h = (q[4] - q[3]) * 10;
    s += ledScreen2("ak" + i, quadMat(P, A, B, C, w, h), w, h, VAR[i], DUR[i], i % 3, q[6]);
  });
  // tren por el puente cada 12 s
  var bz = 73, cars = '';
  for (var c = 0; c < 4; c++) { var x0 = c * 21; cars += '<path d="' + poly(P, [[x0, 10.4, bz], [x0, 13.8, bz], [x0 + 20.4, 13.8, bz], [x0 + 20.4, 10.4, bz]]) + '" fill="url(#tb3)"/><path d="' + poly(P, [[x0, 11.2, bz], [x0, 11.7, bz], [x0 + 20.4, 11.7, bz], [x0 + 20.4, 11.2, bz]]) + '" fill="#f2c230"/>'; for (var w2 = 0; w2 < 8; w2++) cars += '<path d="' + poly(P, [[x0 + 1 + w2 * 2.4, 12, bz], [x0 + 1 + w2 * 2.4, 13.2, bz], [x0 + 2.6 + w2 * 2.4, 13.2, bz], [x0 + 2.6 + w2 * 2.4, 12, bz]]) + '" fill="#fff4d0" fill-opacity=".9"/>'; }
  var a0 = P(-130, 12, bz), a1 = P(60, 12, bz), dx = a1[0] - a0[0];
  s += '<g transform="translate(' + f(a0[0] - P(0, 12, bz)[0]) + ' 0)"><g><animateTransform attributeName="transform" type="translate" values="0 0;' + f(dx) + ' 0;' + f(dx) + ' 0" keyTimes="0;0.4;1" dur="12s" repeatCount="indefinite"/>' + cars + '</g></g>';
  // rótulo luminoso con texto que corre (en el edificio del fondo)
  var A2 = [-7, 19.5, 101], B2 = [7, 19.5, 101], C2 = [-7, 17.5, 101];
  s += '<g transform="' + quadMat(P, A2, B2, C2, 280, 40) + '"><defs><clipPath id="tkr"><rect width="280" height="40"/></clipPath></defs><rect width="280" height="40" fill="#0a0410"/><g clip-path="url(#tkr)"><g><animateTransform attributeName="transform" type="translate" values="280 0;-720 0" dur="14s" repeatCount="indefinite"/><text x="0" y="30" font-family="' + SANS + '" font-weight="900" font-size="28" fill="#ff5ac8">ようこそ秋葉原へ ★ アニメ・ゲーム・ホビーの街 ★ 本日も営業中 ★</text></g></g><rect width="280" height="40" fill="url(#led)"/></g>';
  // luces que persiguen el borde de un cartel
  return svg(s, 400, 860);
}
export function akibaFx2(d, node) { d.appendChild(node("scene", "background-image:" + akibaAnim2())); d.appendChild(node("topshade")); }
var SBP = null;
function sbCam() { return SBP || (SBP = makeCam([-22, 52, -46], .7, .34, 400, 200, 320)); }
var SB_BOX = [ // [x0, x1, z0, z1, h, color, tipo]
  [-82, -24, 18, 60, 15, "#2a3042", "station"], [-20, 6, 22, 48, 42, "#2c2f40", "center"], [-22, 4, 52, 80, 64, "#262a3a", "tower"], [30, 68, 20, 50, 48, "#2a2e40", "right"], [48, 70, 56, 92, 82, "#b0b6c4", "cyl"],
  [24, 70, -64, -22, 30, "#262a38", "se"], [-90, -60, 70, 110, 70, "#1e2234", "far"], [8, 26, 96, 130, 95, "#1c2032", "far"], [78, 110, 30, 70, 60, "#1e2234", "far"], [-60, -30, 90, 130, 110, "#1a1e30", "far"], [30, 50, 120, 150, 120, "#1a1e30", "far"], [-120, -90, 20, 60, 40, "#1e2234", "far"]
];
var SB_SCREENS2 = [ // pantallas en caras que miran al sur (z0) o al oeste (x0): [box, cara, u0, u1, y0, y1]
  [1, "s", .06, .94, 30, 41], [2, "s", .15, .85, 48, 62], [3, "s", .1, .62, 26, 44], [4, "w", .2, .8, 40, 74], [0, "s", .62, .92, 10, 14.6], [3, "w", .3, .9, 30, 44]
];
function sbFaceQuad(b, face, u0, u1, y0, y1) { // devuelve A (arriba-izq), B (arriba-der), C (abajo-izq) en el mundo
  if (face === "s") { var xa = b[0] + (b[1] - b[0]) * u0, xb = b[0] + (b[1] - b[0]) * u1; return [[xa, y1, b[2]], [xb, y1, b[2]], [xa, y0, b[2]]]; }
  var za = b[3] - (b[3] - b[2]) * u0, zb = b[3] - (b[3] - b[2]) * u1; return [[b[0], y1, za], [b[0], y1, zb], [b[0], y0, za]];
}
export function shibuyaBack2() {
  var P = sbCam(), r = seeded(951), s = '<defs><linearGradient id="sbs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset=".35" stop-color="#121a3a"/><stop offset="1" stop-color="#1e2244"/></linearGradient>' +
    '<filter id="sbl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter><filter id="sbl2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>';
  s += '<rect width="400" height="860" fill="url(#sbs2)"/>';
  // suelo: aceras con losetas
  s += '<path d="' + poly(P, [[-160, 0, -120], [-160, 0, 220], [200, 0, 220], [200, 0, -120]]) + '" fill="#4e515c"/>';
  for (var g = -160; g < 200; g += 4) s += '<path d="M' + P(g, 0, -120).slice(0, 2).map(f).join(' ') + 'L' + P(g, 0, 220).slice(0, 2).map(f).join(' ') + '" stroke="#5a5d68" stroke-width=".5"/>';
  // calzadas
  var ROAD = "#25272e";
  s += '<path d="' + poly(P, [[-160, 0, -11], [-160, 0, 11], [200, 0, 11], [200, 0, -11]]) + '" fill="' + ROAD + '"/>';
  s += '<path d="' + poly(P, [[-11, 0, -120], [-11, 0, 11], [11, 0, 11], [11, 0, -120]]) + '" fill="' + ROAD + '"/>';
  s += '<path d="' + poly(P, [[-11, 0, 11], [16, 0, 120], [40, 0, 120], [11, 0, 11]]) + '" fill="' + ROAD + '"/>';
  // carriles, flechas y líneas de detención
  for (var dl = -160; dl < 200; dl += 9) if (dl < -22 || dl > 22) { s += '<path d="' + poly(P, [[dl, 0, -.2], [dl, 0, .2], [dl + 5, 0, .2], [dl + 5, 0, -.2]]) + '" fill="#e8c84a"/>'; s += '<path d="' + poly(P, [[dl, 0, 5.3], [dl, 0, 5.7], [dl + 4, 0, 5.7], [dl + 4, 0, 5.3]]) + '" fill="#e8e6dc"/><path d="' + poly(P, [[dl, 0, -5.7], [dl, 0, -5.3], [dl + 4, 0, -5.3], [dl + 4, 0, -5.7]]) + '" fill="#e8e6dc"/>'; }
  for (var dv = -120; dv < -22; dv += 9) s += '<path d="' + poly(P, [[-.2, 0, dv], [.2, 0, dv], [.2, 0, dv + 5], [-.2, 0, dv + 5]]) + '" fill="#e8c84a"/>';
  [[-23, -11, -22.4, 11], [22.4, -11, 23, 11]].forEach(function (l) { s += '<path d="' + poly(P, [[l[0], 0, l[1]], [l[0], 0, l[3]], [l[2], 0, l[3]], [l[2], 0, l[1]]]) + '" fill="#efeee8"/>'; });
  [[-30, -6], [30, 6]].forEach(function (a) { var x = a[0], z = a[1], dir = a[0] < 0 ? 1 : -1; s += '<path d="' + poly(P, [[x, 0, z - .5], [x + dir * 4, 0, z - .5], [x + dir * 4, 0, z - 1.4], [x + dir * 6, 0, z], [x + dir * 4, 0, z + 1.4], [x + dir * 4, 0, z + .5], [x, 0, z + .5]]) + '" fill="#efeee8" fill-opacity=".85"/>'; });
  // esquinas pintadas de rojo
  [[-24, -12, -11, -26], [11, -12, 24, -26], [-24, 12, -11, 26], [11, 12, 24, 26]].forEach(function (c) { s += '<path d="' + poly(P, [[c[0], 0, c[1]], [c[2], 0, c[1]], [c[2], 0, c[3]], [c[0], 0, c[3]]]) + '" fill="#b02e38" fill-opacity=".85"/>'; });
  // pasos de cebra
  var zb = '';
  function bar(cx, cz, ux, uz, L, W) { var nx = -uz, nz = ux; return poly(P, [[cx - nx * L / 2, .02, cz - nz * L / 2], [cx + nx * L / 2, .02, cz + nz * L / 2], [cx + nx * L / 2 + ux * W, .02, cz + nz * L / 2 + uz * W], [cx - nx * L / 2 + ux * W, .02, cz - nz * L / 2 + uz * W]]); }
  for (var t = -10.4; t < 10.4; t += 1.2) { zb += bar(-17, t, 0, 1, 6.4, .6) + bar(17, t, 0, 1, 6.4, .6) + bar(t, -17, 1, 0, 6.4, .6) + bar(t, 17, 1, 0, 6.4, .6); }
  [[[-11, -11], [11, 11]], [[11, -11], [-11, 11]]].forEach(function (dg) { var ax = dg[0][0], az = dg[0][1], vx = dg[1][0] - ax, vz = dg[1][1] - az, L = Math.hypot(vx, vz), ux = vx / L, uz = vz / L; for (var k = 2.4; k < L - 2.4; k += 1.2) zb += bar(ax + ux * k, az + uz * k, ux, uz, 5, .6); });
  s += '<path d="' + zb + '" fill="#f2f1ec"/>';
  // edificios (de lejos a cerca)
  var C0 = [-34, 92, -88];
  function face(pts, col, detail) { return '<path d="' + poly(P, pts) + '" fill="' + col + '"/>' + (detail || ''); }
  function windows(b, fc) { // ventanas en la cara sur (z0) u oeste (x0)
    var o = '', h = b[4];
    for (var y = 2.5; y < h - 1.5; y += 3.4) {
      if (fc === "s") for (var x = b[0] + .8; x < b[1] - 1.4; x += 2) { if (r() < .25) continue; o += '<path d="' + poly(P, [[x, y, b[2]], [x, y + 1.8, b[2]], [x + 1.2, y + 1.8, b[2]], [x + 1.2, y, b[2]]]) + '" fill="' + (r() > .45 ? "#ffd890" : r() > .3 ? "#cfe4ff" : "#3a3e52") + '" fill-opacity="' + f(.45 + r() * .5) + '"/>'; }
      else for (var z = b[2] + .8; z < b[3] - 1.4; z += 2) { if (r() < .25) continue; o += '<path d="' + poly(P, [[b[0], y, z], [b[0], y + 1.8, z], [b[0], y + 1.8, z + 1.2], [b[0], y, z + 1.2]]) + '" fill="' + (r() > .45 ? "#ffd890" : r() > .3 ? "#cfe4ff" : "#3a3e52") + '" fill-opacity="' + f(.4 + r() * .5) + '"/>'; }
    }
    return o;
  }
  SB_BOX.slice().sort(function (a, b) { return P((b[0] + b[1]) / 2, b[4] / 2, (b[2] + b[3]) / 2)[2] - P((a[0] + a[1]) / 2, a[4] / 2, (a[2] + a[3]) / 2)[2]; }).forEach(function (b) {
    var x0 = b[0], x1 = b[1], z0 = b[2], z1 = b[3], h = b[4], c = b[5];
    if (C0[0] < x0) s += face([[x0, 0, z0], [x0, h, z0], [x0, h, z1], [x0, 0, z1]], b[6] === "cyl" ? "#8a90a0" : "#1c2030", windows(b, "w"));
    if (C0[0] > x1) s += face([[x1, 0, z0], [x1, h, z0], [x1, h, z1], [x1, 0, z1]], "#1c2030");
    s += face([[x0, 0, z0], [x0, h, z0], [x1, h, z0], [x1, 0, z0]], c, windows(b, "s"));
    s += face([[x0, h, z0], [x0, h, z1], [x1, h, z1], [x1, h, z0]], "#3a3f52");
    for (var k = 0; k < 3; k++) { var rx = x0 + 2 + r() * (x1 - x0 - 5), rz = z0 + 2 + r() * (z1 - z0 - 5); s += face([[rx, h, rz], [rx, h + 2, rz], [rx + 3, h + 2, rz], [rx + 3, h, rz]], "#4a4f62"); }
    if (b[6] === "cyl") for (var v = 0; v < 12; v++) { var vz = z0 + (z1 - z0) * v / 12; s += '<path d="M' + P(x0, 0, vz).slice(0, 2).map(f).join(' ') + 'L' + P(x0, h, vz).slice(0, 2).map(f).join(' ') + '" stroke="#6a7080" stroke-width="1"/>'; }
    if (C0[0] < x0 || true) { var pc = P(x0, h + .5, z0); s += '<circle cx="' + f(pc[0]) + '" cy="' + f(pc[1]) + '" r="1.4" fill="#ff3a3a"/>'; }
    if (b[6] === "center") { // pila de rótulos de restaurantes en la fachada
      for (var sg = 0; sg < 10; sg++) { var yy = 3 + sg * 2.6, xs = x0 + 1 + (sg % 2) * 13, c2 = NEON[(sg * 3) % NEON.length]; s += '<path d="' + poly(P, [[xs, yy, z0 - .1], [xs, yy + 2, z0 - .1], [xs + 10, yy + 2, z0 - .1], [xs + 10, yy, z0 - .1]]) + '" fill="' + c2 + '" fill-opacity=".85"/>'; var q = [[xs, yy + 2, z0 - .1], [xs + 10, yy + 2, z0 - .1], [xs, yy, z0 - .1]]; s += '<text transform="' + quadMat(P, q[0], q[1], q[2], 100, 20) + '" x="50" y="15" font-family="' + SANS + '" font-weight="900" font-size="14" text-anchor="middle" fill="#fff">' + ["ラーメン", "居酒屋", "カフェ", "焼肉", "カラオケ", "寿司", "ゲーム", "書店", "服", "バー"][sg] + '</text>'; }
    }
    if (b[6] === "station") { s += face([[x0 - 2, 6, z0 - 3], [x0 - 2, 6.6, z0 - 3], [x1 + 2, 6.6, z0 - 3], [x1 + 2, 6, z0 - 3]], "#d8d6d0"); for (var gx = x0; gx < x1; gx += 1.6) s += '<path d="' + poly(P, [[gx, 1, z0], [gx, 13, z0], [gx + 1.2, 13, z0], [gx + 1.2, 1, z0]]) + '" fill="#ffe2a0" fill-opacity=".55"/>'; }
  });
  SB_SCREENS2.forEach(function (q, i) { var Q = sbFaceQuad(SB_BOX[q[0]], q[1], q[2], q[3], q[4], q[5]), D = [Q[0], Q[1], [Q[1][0] + Q[2][0] - Q[0][0], Q[2][1], Q[1][2] + Q[2][2] - Q[0][2]], Q[2]]; s += '<path d="' + poly(P, D) + '" fill="' + ["#ff3a5a", "#4ad0ff", "#ff7ad0", "#ffd23f", "#ffffff", "#7aff9a"][i] + '" fill-opacity=".8" filter="url(#sbl)"/>'; });
  // terminal de autobuses (suroeste)
  s += '<path d="' + poly(P, [[-50, 0, -64], [-50, 0, -18], [-14, 0, -18], [-14, 0, -64]]) + '" fill="#33353d"/>';
  [[-44, -56], [-40, -48], [-36, -40], [-32, -32], [-28, -24]].forEach(function (bs, i) {
    var x = bs[0], z = bs[1], L = 11, W = 2.5, H = 3.2, col = i % 2 ? "#e8e6e0" : "#c83a3a";
    s += face([[x, 0, z + W], [x, H, z + W], [x + L, H, z + W], [x + L, 0, z + W]], col) + face([[x + L, 0, z], [x + L, H, z], [x + L, H, z + W], [x + L, 0, z + W]], "#b8b8b4") + face([[x, H, z], [x, H, z + W], [x + L, H, z + W], [x + L, H, z]], "#d8d8d4") + face([[x, .4, z + W + .02], [x, .9, z + W + .02], [x + L, .9, z + W + .02], [x + L, .4, z + W + .02]], i % 2 ? "#3a8a5a" : "#f0f0ea");
    for (var w = 0; w < 6; w++) s += face([[x + .6 + w * 1.7, 1.6, z + W + .03], [x + .6 + w * 1.7, 2.7, z + W + .03], [x + 1.9 + w * 1.7, 2.7, z + W + .03], [x + 1.9 + w * 1.7, 1.6, z + W + .03]], "#2a3040") + face([[x + .8 + w * 1.7, 1.8, z + W + .04], [x + .8 + w * 1.7, 2.4, z + W + .04], [x + 1.7 + w * 1.7, 2.4, z + W + .04], [x + 1.7 + w * 1.7, 1.8, z + W + .04]], "#ffe8b8");
  });
  s += face([[-52, 5, -64], [-52, 5, -50], [-30, 5, -50], [-30, 5, -64]], "#8a8c94");
  // árboles en las esquinas
  [[-28, 16], [-28, 24], [26, -28], [34, -28], [-30, -24], [30, 14]].forEach(function (tr) { var c = P(tr[0], 4, tr[1]), sc = 460 / c[2]; for (var k = 0; k < 36; k++) s += '<circle cx="' + f(c[0] + (r() - .5) * sc * 4) + '" cy="' + f(c[1] + (r() - .5) * sc * 3) + '" r="' + f(sc * (.5 + r() * .5)) + '" fill="' + ["#1e3a26", "#2a4e30", "#3a6a3e", "#4a7a46"][(r() * 4) | 0] + '"/>'; });
  // coches parados en la calle del norte y del sur
  [[2, 30, 1], [6, 40, 1], [24, 80, 1], [-6, -30, -1], [5, -36, -1], [-5, -44, -1]].forEach(function (cr, i) { var x = cr[0], z = cr[1], col = ["#e8e6e0", "#2a2a30", "#c83a3a", "#3a4a6a", "#ffd23f", "#e8e6e0"][i]; s += face([[x - .9, .1, z - 2.2], [x - .9, .1, z + 2.2], [x + .9, .1, z + 2.2], [x + .9, .1, z - 2.2]], col) + face([[x - .9, 1.4, z - 1.2], [x - .9, 1.4, z + 1], [x + .9, 1.4, z + 1], [x + .9, 1.4, z - 1.2]], "#1a1c24"); var tl = P(x, .6, z - cr[2] * 2.3); s += '<circle cx="' + f(tl[0]) + '" cy="' + f(tl[1]) + '" r="2.2" fill="' + (cr[2] > 0 ? "#ff3a3a" : "#fff4c8") + '" filter="url(#sbl2)"/>'; });
  // gente esperando en las aceras (las esquinas están abarrotadas)
  var crowd = [];
  function spot(cx, cz, R, n) { for (var k = 0; k < n; k++) { var a = r() * 6.283, d = Math.sqrt(r()) * R; crowd.push([cx + Math.cos(a) * d, cz + Math.sin(a) * d]); } }
  spot(-19, -19, 6, 110); spot(19, -19, 6, 90); spot(-19, 19, 6, 120); spot(19, 19, 6, 100);
  for (var k2 = 0; k2 < 900; k2++) { var px = -60 + r() * 120, pz = -60 + r() * 110; if (Math.abs(pz) < 12 || Math.abs(px) < 12 || (px < -13 && pz < -17 && px > -50) || (pz > 18 && px > -24 && px < 70 && pz < 50)) continue; crowd.push([px, pz]); }
  spot(-14, -28, 3, 40); spot(14, -30, 3, 40); spot(-22, 14, 4, 60);
  crowd.sort(function (a, b) { return P(b[0], 0, b[1])[2] - P(a[0], 0, a[1])[2]; }).forEach(function (p) { s += sbPerson(P, p[0], p[1], r); });
  return svg(s, 400, 860);
}
function sbPerson(P, x, z, r) { var ft = P(x, 0, z), hd = P(x, 1.7, z), h = (ft[1] - hd[1]) * 1.9, w = h * .5, c = ["#1a1a22", "#2a2a35", "#3a3f4a", "#d8d4cc", "#5a6a80", "#8a3a3a", "#e8e4dc", "#1f2a3a", "#c9b08a"][(r() * 9) | 0]; return '<ellipse cx="' + f(ft[0]) + '" cy="' + f(ft[1] - h * .3) + '" rx="' + f(w * .5) + '" ry="' + f(h * .4) + '" fill="' + c + '"/><circle cx="' + f(ft[0]) + '" cy="' + f(ft[1] - h * .78) + '" r="' + f(w * .36) + '" fill="#121216"/>'; }
function shibuyaAnim2() {
  var P = sbCam(), r = seeded(961), s = '<defs>' + LED_DEFS + '</defs>';
  var VAR = [[ADS2[1], GIRLS2[7], ADS2[3]], [GIRLS2[3], ADS2[2], GIRLS2[1]], [GIRLS2[0], ADS2[0]], [GIRLS2[5], GIRLS2[2]], [ADS2[3], ADS2[1]], [GIRLS2[4], ADS2[2]]];
  SB_SCREENS2.forEach(function (q, i) { var Q = sbFaceQuad(SB_BOX[q[0]], q[1], q[2], q[3], q[4], q[5]); var w = Math.hypot(Q[1][0] - Q[0][0], Q[1][2] - Q[0][2]) * 10, h = (q[5] - q[4]) * 10; s += ledScreen2("sb" + i, quadMat(P, Q[0], Q[1], Q[2], w, h), w, h, VAR[i], [9, 10, 8, 11, 6, 7.4][i], i % 3, h / w > 1.3); });
  var CY = 'dur="26s" repeatCount="indefinite"';
  // coches por la avenida mientras la gente espera
  [[-7.5, 1, "#e8e6e0"], [-3, 1, "#c83a3a"], [3, -1, "#2a2a30"], [7.5, -1, "#ffd23f"], [-7.5, 1, "#3a4a6a"], [3, -1, "#e8e6e0"]].forEach(function (c, i) {
    var z = c[0], dir = c[1], xs = dir > 0 ? -110 - i * 18 : 150 + i * 18, xe = dir > 0 ? 150 : -110, A = P(xs, .7, z), B = P(xe, .7, z);
    var car = '<path d="' + poly(P, [[xs - 2.2, .1, z - .9], [xs - 2.2, .1, z + .9], [xs + 2.2, .1, z + .9], [xs + 2.2, .1, z - .9]]) + '" fill="' + c[2] + '"/><path d="' + poly(P, [[xs - 1.2, 1.4, z - .9], [xs - 1.2, 1.4, z + .9], [xs + 1, 1.4, z + .9], [xs + 1, 1.4, z - .9]]) + '" fill="#1a1c24"/>';
    var fl = P(xs + dir * 2.3, .6, z); car += '<circle cx="' + f(fl[0]) + '" cy="' + f(fl[1]) + '" r="2.4" fill="#fff6c8" filter="url(#sbl2)"/>';
    s += '<g opacity="1"><animate attributeName="opacity" values="1;0;1;0" keyTimes="0;0.28;0.52;0.78" calcMode="discrete" ' + CY + '/><g><animateTransform attributeName="transform" type="translate" values="0 0;' + f(B[0] - A[0]) + ' ' + f(B[1] - A[1]) + ';' + f(B[0] - A[0]) + ' ' + f(B[1] - A[1]) + ';0 0;' + f(B[0] - A[0]) + ' ' + f(B[1] - A[1]) + ';0 0" keyTimes="0;0.28;0.5;0.52;0.78;1" ' + CY + '/>' + car + '</g></g>';
  });
  // la multitud cruza en todas direcciones a la vez, espera al otro lado y vuelve
  var CR = [[[-17, -14], [-17, 14]], [[17, -14], [17, 14]], [[-14, -17], [14, -17]], [[-14, 17], [14, 17]], [[-12, -12], [12, 12]], [[12, -12], [-12, 12]]];
  CR.forEach(function (cr, ci) {
    [0, 1].forEach(function (side) {
      var A = side ? cr[1] : cr[0], B = side ? cr[0] : cr[1], vx = B[0] - A[0], vz = B[1] - A[1], L = Math.hypot(vx, vz), ux = vx / L, uz = vz / L;
      for (var sub = 0; sub < 4; sub++) {
        var back = 1 + sub * 1.6, cx = A[0] - ux * back, cz = A[1] - uz * back, pa = P(cx, 0, cz), pb = P(cx + vx, 0, cz + vz), dx = pb[0] - pa[0], dy = pb[1] - pa[1];
        var k0 = .29 + sub * .018 + ci * .003, k1 = .46 + sub * .022 + ci * .004, k2 = .79 + sub * .016, k3 = Math.min(.995, .955 + sub * .01);
        var g = '<g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;' + f(dx) + ' ' + f(dy) + ';' + f(dx) + ' ' + f(dy) + ';0 0;0 0" keyTimes="0;' + f(k0) + ';' + f(k1) + ';' + f(k2) + ';' + f(k3) + ';1" ' + CY + '/>';
        var pts = []; for (var n = 0; n < 9; n++) { var lat = (r() - .5) * 5, bk = (r() - .5) * 1.6; pts.push([cx - uz * lat + ux * bk, cz + ux * lat + uz * bk]); }
        pts.sort(function (a, b) { return P(b[0], 0, b[1])[2] - P(a[0], 0, a[1])[2]; }).forEach(function (p) { g += sbPerson(P, p[0], p[1], r); });
        s += g + '</g>';
      }
    });
  });
  return svg(s, 400, 860);
}
export function shibuyaFx2(d, node) { d.appendChild(node("scene", "background-image:" + shibuyaAnim2())); d.appendChild(node("topshade")); }
var _sbA;
// ---------- medallas nuevas ----------
var ARCADE_D = "M18 4H46L50 10V34L56 40V62H8V40L14 34V10Z";
var CROSS_D = "M32 2L62 32 32 62 2 32Z";

export function init() {
  GIRLS2 = [
    { id: "ga", bg1: "#ff9fd0", bg2: "#ff5fa8", hairL: "#ffd0ea", hair: "#ff8ac4", hairD: "#d0408a", eye: "#c04ad8", eyeL: "#ffb0f0", eyeD: "#4a0a6a", style: "twin", outfit: "sailor", cloth: "#2a3a7a", acc: "#ff3f8a", text: "新作アニメ" },
    { id: "gb", bg1: "#bfe6ff", bg2: "#6ab4ff", hairL: "#e0f4ff", hair: "#8ac4ff", hairD: "#3a74d0", eye: "#3a9aff", eyeL: "#b0e4ff", eyeD: "#0a2a6a", style: "long", outfit: "maid", acc: "#4a8aff", mouth: "cat" },
    { id: "gc", bg1: "#fff0b8", bg2: "#ffb84a", hairL: "#fff2b8", hair: "#ffd060", hairD: "#d08a20", eye: "#ff7a3a", eyeL: "#ffd0a0", eyeD: "#6a2a0a", style: "long", outfit: "hoodie", cloth: "#ff7aa8", acc: "#ff4a6a", clip: 1, text: "発売中" },
    { id: "gd", bg1: "#e4d0ff", bg2: "#a070ff", hairL: "#f0e4ff", hair: "#b48aff", hairD: "#6a40c0", eye: "#ff5aa0", eyeL: "#ffc0dc", eyeD: "#5a0a3a", style: "long", outfit: "sailor", cloth: "#1a1a2a", acc: "#b48aff", ears: 1 },
    { id: "ge", bg1: "#c8ffe8", bg2: "#5ad8b0", hairL: "#e0fff4", hair: "#5ad8b8", hairD: "#1a9a80", eye: "#2ac0ff", eyeL: "#b0f0ff", eyeD: "#0a3a6a", style: "twin", outfit: "hoodie", cloth: "#ffffff", acc: "#2ad8a8", mouth: "cat" },
    { id: "gf", bg1: "#ffc8d8", bg2: "#ff6a8a", hairL: "#6a5a6a", hair: "#3a2a3a", hairD: "#140a14", eye: "#ff3a5a", eyeL: "#ffb0c0", eyeD: "#4a0a1a", style: "long", outfit: "maid", acc: "#ff3a6a", text: "メイドカフェ" },
    { id: "gg", bg1: "#ffd6f0", bg2: "#ff8ad8", hairL: "#fff0fa", hair: "#ffc0e8", hairD: "#e070b8", eye: "#7a5aff", eyeL: "#d0c0ff", eyeD: "#2a0a6a", style: "twin", outfit: "maid", acc: "#ff5ac8", ears: 1 },
    { id: "gh", bg1: "#b8f0ff", bg2: "#4ab8e8", hairL: "#fff", hair: "#e8f0ff", hairD: "#9ab0d8", eye: "#4a6aff", eyeL: "#c0d0ff", eyeD: "#0a1a5a", style: "long", outfit: "sailor", cloth: "#ff4a6a", acc: "#ff4a6a", clip: 1, text: "限定" }
  ].map(girl2);
  ADS2 = [
    ad2({ bg: "#1a0a2a", fg: "#ff4fb0", burst: 1, claw: 1, text: "クレーンゲーム", ts: 13, sub: "1回100円" }),
    ad2({ bg: "#e8243c", fg: "#c81a30", can: "ソーダ", text: "新発売", sub: "冷たいうちに" }),
    ad2({ bg: "#0a1a3a", fg: "#5ee0ff", pad: 1, burst: 1, text: "新作ゲーム", ts: 16, sub: "今日発売" }),
    ad2({ bg: "#ffe03f", fg: "#ff8a00", burst: 1, text: "大セール", tc: "#1a1a1a", ts: 24, sub: "全品30%オフ" })
  ];
  // el filtro de brillo que usan las luces animadas de Shibuya
  _sbA = shibuyaAnim2;
  Object.assign(MEDALS, {
    akihabara: { metal: "silver", shape: ARCADE_D, fieldPath: "M19 13H45V33H19Z", enamel: "#ff3d9a",
      enamelExtra: '<path d="M27 20C27 17 31 16 32 19 33 16 37 17 37 20 37 24 32 27 32 28 32 27 27 24 27 20Z" fill="#fff"/><path d="M19 15H45M19 19H45M19 23H45M19 27H45M19 31H45" stroke="#000" stroke-opacity=".18" stroke-width=".6"/><text x="32" y="31.4" font-family="' + SANS + '" font-weight="900" font-size="3.6" text-anchor="middle" fill="#fff">GAME</text>',
      em: '<path d="M14 40H50M18 46H46" fill="none" stroke-width="1"/><path d="M20 6H44" fill="none" stroke-width="1.2"/>',
      over: '<rect x="20" y="5.4" width="24" height="3.6" rx="1" fill="#5ee0ff"/><circle cx="22" cy="44" r="3.4" fill="#ff3a4a"/><path d="M22 44V38" stroke="#2a2a30" stroke-width="1.4"/><circle cx="22" cy="37.6" r="2" fill="#ff3a4a"/><circle cx="36" cy="44" r="2.4" fill="#ffd23f"/><circle cx="43" cy="42" r="2.4" fill="#3aff9a"/><circle cx="43" cy="47.4" r="2.4" fill="#5ee0ff"/>' },
    shibuya: { metal: "gun", shape: CROSS_D, fieldPath: "M32 7L57 32 32 57 7 32Z", enamel: "#1c1e26",
      enamelExtra: (function () { var o = '<g fill="#f2f1ec">'; for (var t = -16; t <= 16; t += 3.4) { o += '<rect x="' + f(32 + t - .9) + '" y="20" width="1.8" height="5"/><rect x="' + f(32 + t - .9) + '" y="39" width="1.8" height="5"/><rect x="20" y="' + f(32 + t - .9) + '" width="5" height="1.8"/><rect x="39" y="' + f(32 + t - .9) + '" width="5" height="1.8"/>'; }
        for (var k = -11; k <= 11; k += 2.6) { o += '<rect x="' + f(32 + k - .8) + '" y="' + f(32 + k - 2.4) + '" width="1.6" height="4.8" transform="rotate(-45 ' + f(32 + k) + ' ' + f(32 + k) + ')"/><rect x="' + f(32 + k - .8) + '" y="' + f(32 - k - 2.4) + '" width="1.6" height="4.8" transform="rotate(45 ' + f(32 + k) + ' ' + f(32 - k) + ')"/>'; }
        return o + '</g><g fill="#c8303a"><path d="M32 9L36 13 32 17 28 13Z"/><path d="M55 32L51 36 47 32 51 28Z"/><path d="M32 55L28 51 32 47 36 51Z"/><path d="M9 32L13 28 17 32 13 36Z"/></g>'; })(),
      gold: '<circle cx="32" cy="32" r="1.6"/>' }
  });
  patchPal("akihabara", { bg: "#1a0820", surface: "#260c30", raised: "#331240", hairline: "#5a2470", text: "#fff2fb", muted: "#f0bce0", faint: "#a87aa8", accent: "#ff3d9a", status: "#5ee0ff", surfA: "ea", grad: "#1a0820",
    pantone: "Inspirada en PANTONE Pink Glo 13-2808 y Raspberry Rose 18-2333 (el rosa de los neones), con Blue Atoll 16-4535 (pantallas)" });
  patchPal("shibuya", { bg: "#0b1020", surface: "#131a2c", raised: "#1b2438", hairline: "#33405c", text: "#f4f6fb", muted: "#b8c2d8", faint: "#7a86a0", accent: "#e8333a", status: "#ffd23f", surfA: "ea", grad: "#0b1020",
    pantone: "Inspirada en PANTONE Fiery Red 18-1664 (la gran pantalla y las esquinas), Classic Blue 19-4052 (la noche) y Bright White 11-0601 (las cebras)" });
}
