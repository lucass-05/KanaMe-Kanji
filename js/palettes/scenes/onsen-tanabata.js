/* 温泉 Onsen (rotenburo en 3D) y 七夕 Tanabata (luna, luciérnagas) */
import { MINCHO } from "./varias.js";
import { f } from "../medals.js";
import { makeCam, poly } from "./akiba-shibuya.js";
import { seeded, svg } from "../shapes.js";
var ONP = null;
function onCam() { return ONP || (ONP = makeCam([0, 3.4, -1.6], .3, 0, 380, 200, 520)); }
function onsenScene3() {
  var P = onCam(), r = seeded(1201), s = '<defs>' +
    '<linearGradient id="os3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a66"/><stop offset=".5" stop-color="#7a8aa6"/><stop offset="1" stop-color="#b8c4d4"/></linearGradient>' +
    '<radialGradient id="ow3" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#8ae0e6"/><stop offset=".6" stop-color="#3aa6b4"/><stop offset="1" stop-color="#1a6a7a"/></radialGradient>' +
    '<radialGradient id="olg3"><stop offset="0" stop-color="#ffd59a" stop-opacity=".9"/><stop offset=".35" stop-color="#ffb35e" stop-opacity=".35"/><stop offset="1" stop-color="#ffb35e" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="oin3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf8a"/><stop offset="1" stop-color="#c8783a"/></linearGradient>' +
    '<filter id="obl3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="obl4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>' +
    '<filter id="osn" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter></defs>';
  s += '<rect width="400" height="860" fill="url(#os3)"/>';
  // bosque al fondo: árboles desnudos nevados y cedros
  function bare(x, y, len, a, dpt, w) { if (dpt === 0) return ''; var x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, o = '<path d="M' + f(x) + ' ' + f(y) + 'L' + f(x2) + ' ' + f(y2) + '" stroke="#3a3a44" stroke-width="' + f(w) + '" stroke-linecap="round"/>'; if (dpt < 4 && r() > .4) o += '<path d="M' + f(x) + ' ' + f(y - w * .6) + 'L' + f(x2) + ' ' + f(y2 - w * .6) + '" stroke="#f4f7fa" stroke-width="' + f(w * .6) + '" stroke-linecap="round"/>'; return o + bare(x2, y2, len * .74, a - .3 - r() * .35, dpt - 1, w * .66) + bare(x2, y2, len * .74, a + .28 + r() * .35, dpt - 1, w * .66); }
  s += '<g opacity=".75">' + bare(250, 470, 80, -1.6, 7, 4.4) + bare(330, 470, 90, -1.5, 7, 5) + bare(170, 470, 70, -1.7, 7, 3.6) + bare(395, 460, 80, -1.8, 7, 4.4) + bare(60, 470, 70, -1.55, 6, 3.4) + '</g>';
  function cedar(x, base, h, w) { var o = '<rect x="' + f(x - 3) + '" y="' + f(base - h) + '" width="6" height="' + f(h) + '" fill="#2a2420"/>'; for (var k = 0; k < 9; k++) { var yy = base - h * .25 - k * h * .085, ww = w * (1 - k * .09); o += '<path d="M' + f(x - ww) + ' ' + f(yy) + 'Q' + f(x) + ' ' + f(yy - h * .1) + ' ' + f(x + ww) + ' ' + f(yy) + 'L' + f(x + ww * .3) + ' ' + f(yy - h * .06) + 'H' + f(x - ww * .3) + 'Z" fill="#20302c"/><path d="M' + f(x - ww * .9) + ' ' + f(yy - 2) + 'Q' + f(x - ww * .2) + ' ' + f(yy - h * .1) + ' ' + f(x + ww * .7) + ' ' + f(yy - 3) + 'Q' + f(x) + ' ' + f(yy - h * .05) + ' ' + f(x - ww * .9) + ' ' + f(yy - 2) + 'Z" fill="#f2f5f8"/>'; } return o; }
  [[110, 480, 300, 34], [30, 500, 420, 50], [80, 490, 360, 42], [150, 476, 240, 28], [-20, 510, 460, 56], [200, 470, 180, 22]].forEach(function (c) { s += cedar(c[0], c[1], c[2], c[3]); });
  s += '<path d="M-10 470C80 456 200 462 410 452V860H-10Z" fill="#dfe7f0"/>';
  // ladera nevada con rocas y lucecitas (izquierda)
  s += '<path d="M-10 600C10 500 60 470 120 476 160 480 180 500 186 540L170 620H-10Z" fill="#e8eef4" filter="url(#osn)"/><path d="M-10 560C30 510 80 494 140 500" fill="none" stroke="#c9d4e0" stroke-width="8" filter="url(#osn)"/>';
  [[30, 540, 24, 14], [90, 506, 20, 12], [140, 520, 16, 10], [60, 574, 26, 15], [10, 596, 20, 12]].forEach(function (k) { s += '<ellipse cx="' + k[0] + '" cy="' + k[1] + '" rx="' + k[2] + '" ry="' + k[3] + '" fill="#5a5450"/><ellipse cx="' + (k[0] - k[2] * .25) + '" cy="' + (k[1] - k[3] * .3) + '" rx="' + (k[2] * .5) + '" ry="' + (k[3] * .4) + '" fill="#7a726a"/><path d="M' + (k[0] - k[2]) + ' ' + (k[1] - 2) + 'Q' + k[0] + ' ' + (k[1] - k[3] * 1.7) + ' ' + (k[0] + k[2]) + ' ' + (k[1] - 2) + 'Q' + k[0] + ' ' + (k[1] - k[3] * .7) + ' ' + (k[0] - k[2]) + ' ' + (k[1] - 2) + 'Z" fill="#f6f8fb"/>'; });
  [[56, 556], [118, 514], [20, 610]].forEach(function (l) { s += '<circle cx="' + l[0] + '" cy="' + l[1] + '" r="22" fill="url(#olg3)"/><circle cx="' + l[0] + '" cy="' + l[1] + '" r="2.4" fill="#fff4d8"/>'; });
  // cabaña de madera con el ventanal encendido (derecha)
  var Pc = function (x, y, z) { return P(x - 1.6, y, z - 1.4); };
  var c0 =Pc(2.2, 0, 10), c1 =Pc(9, 0, 10), c2 =Pc(2.2, 3, 10), c3 =Pc(9, 3, 10);
  s += '<path d="' + poly(Pc, [[2.2, 0, 10], [2.2, 3.1, 10], [9, 3.1, 10], [9, 0, 10]]) + '" fill="#4a3426"/>';
  for (var pl = 0; pl < 22; pl++) { var px = 2.2 + pl * .31; s += '<path d="M' +Pc(px, 0, 10).slice(0, 2).map(f).join(' ') + 'L' +Pc(px, 3.1, 10).slice(0, 2).map(f).join(' ') + '" stroke="#33241a" stroke-width="1.1"/>'; }
  s += '<path d="' + poly(Pc, [[3, .2, 9.98], [3, 2.5, 9.98], [8.4, 2.5, 9.98], [8.4, .2, 9.98]]) + '" fill="url(#oin3)"/>';
  // interior: banco, cojines, mesa y bombillas colgando
  s += '<path d="' + poly(Pc, [[3.4, .2, 9.97], [3.4, .8, 9.97], [6, .8, 9.97], [6, .2, 9.97]]) + '" fill="#8a5a34"/><path d="' + poly(Pc, [[3.6, .8, 9.96], [3.6, 1.3, 9.96], [4.4, 1.3, 9.96], [4.4, .8, 9.96]]) + '" fill="#f3e6d0"/><path d="' + poly(Pc, [[4.6, .8, 9.96], [4.6, 1.3, 9.96], [5.4, 1.3, 9.96], [5.4, .8, 9.96]]) + '" fill="#f3e6d0"/><path d="' + poly(Pc, [[6.4, .2, 9.97], [6.4, .9, 9.97], [7.8, .9, 9.97], [7.8, .2, 9.97]]) + '" fill="#6a4426"/>';
  [4, 5.4, 6.8, 7.8].forEach(function (bx) { var t =Pc(bx, 2.5, 9.96), b =Pc(bx, 2.1, 9.96); s += '<path d="M' + f(t[0]) + ' ' + f(t[1]) + 'L' + f(b[0]) + ' ' + f(b[1]) + '" stroke="#3a2a1e" stroke-width=".8"/><circle cx="' + f(b[0]) + '" cy="' + f(b[1] + 3) + '" r="10" fill="url(#olg3)"/><circle cx="' + f(b[0]) + '" cy="' + f(b[1] + 3) + '" r="2.6" fill="#fff6d8"/>'; });
  [4.8, 6.6].forEach(function (mx) { s += '<path d="M' +Pc(mx, .2, 9.95).slice(0, 2).map(f).join(' ') + 'L' +Pc(mx, 2.5, 9.95).slice(0, 2).map(f).join(' ') + '" stroke="#3a2a1e" stroke-width="3"/>'; });
  s += '<path d="' + poly(Pc, [[3, .2, 9.95], [3, 2.5, 9.95], [8.4, 2.5, 9.95], [8.4, .2, 9.95]]) + '" fill="none" stroke="#2a1e16" stroke-width="3"/>';
  s += '<path d="' + poly(Pc, [[3, 2.5, 9.94], [3, 1.6, 9.94], [8.4, 2.5, 9.94]]) + '" fill="#fff" fill-opacity=".08"/>';
  // farolillos de pared y tejado con nieve gruesa
  [[2.6, 2.4], [8.8, 2.4]].forEach(function (w) { var p =Pc(w[0], w[1], 9.95); s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="22" fill="url(#olg3)"/><rect x="' + f(p[0] - 3) + '" y="' + f(p[1] - 4) + '" width="6" height="8" rx="1.4" fill="#ffe2a8"/>'; });
  s += '<path d="' + poly(Pc, [[1.6, 3.1, 9.4], [1.6, 3.6, 9.4], [9.6, 3.6, 9.4], [9.6, 3.1, 9.4]]) + '" fill="#2a1e16"/>';
  s += '<path d="M' +Pc(1.4, 3.5, 9.3).slice(0, 2).map(f).join(' ') + 'Q' +Pc(5.5, 4.6, 9.3).slice(0, 2).map(f).join(' ') + ' ' +Pc(9.8, 3.6, 9.3).slice(0, 2).map(f).join(' ') + 'L' +Pc(9.8, 4.3, 11).slice(0, 2).map(f).join(' ') + 'L' +Pc(1.4, 4.3, 11).slice(0, 2).map(f).join(' ') + 'Z" fill="#f6f9fc" filter="url(#osn)"/>';
  s += '<path d="M' +Pc(1.4, 3.5, 9.3).slice(0, 2).map(f).join(' ') + 'Q' +Pc(5.5, 3.9, 9.3).slice(0, 2).map(f).join(' ') + ' ' +Pc(9.8, 3.6, 9.3).slice(0, 2).map(f).join(' ') + '" fill="none" stroke="#c4d0de" stroke-width="3"/>';
  // cubo de madera y barril
  var bk =Pc(8.6, 0, 9.4); s += '<rect x="' + f(bk[0] - 9) + '" y="' + f(bk[1] - 18) + '" width="18" height="18" rx="2" fill="#5a3a24"/><path d="M' + f(bk[0] - 9) + ' ' + f(bk[1] - 12) + 'h18M' + f(bk[0] - 9) + ' ' + f(bk[1] - 5) + 'h18" stroke="#2a1a10" stroke-width="1.6"/>';
  // terraza de losas delante de la cabaña
  s += '<path d="' + poly(Pc, [[1.4, 0, 9.4], [9.8, 0, 9.4], [9.8, 0, 6], [3.2, 0, 6.8]]) + '" fill="#9a948a"/>';
  // la poza: agua turquesa transparente con piedras en el fondo y reflejos cálidos
  var ring = [];
  for (var k = 0; k <= 36; k++) { var a = k / 36 * Math.PI * 2, rr = 1 + .12 * Math.sin(a * 3 + 1) + .08 * Math.sin(a * 5); ring.push([-.7 + Math.cos(a) * 3.7 * rr, -.05, 4.7 + Math.sin(a) * 2.4 * rr]); }
  var poolD = poly(P, ring);
  s += '<defs><clipPath id="opc3"><path d="' + poolD + '"/></clipPath></defs><path d="' + poolD + '" fill="url(#ow3)"/><g clip-path="url(#opc3)">';
  for (var st = 0; st < 50; st++) { var sx = -4.4 + r() * 7.4, sz = 2.2 + r() * 5, sp = P(sx, -.6, sz), sr = (14 + r() * 26) * 380 / sp[2] / 30; s += '<ellipse cx="' + f(sp[0]) + '" cy="' + f(sp[1]) + '" rx="' + f(sr) + '" ry="' + f(sr * .55) + '" fill="' + ["#2a7a86", "#3a8a92", "#4a9aa0", "#5aa8ac"][(r() * 4) | 0] + '" fill-opacity=".6" filter="url(#obl3)"/><ellipse cx="' + f(sp[0] - sr * .2) + '" cy="' + f(sp[1] - sr * .2) + '" rx="' + f(sr * .5) + '" ry="' + f(sr * .25) + '" fill="#9ae4e8" fill-opacity=".35"/>'; }
  for (var rf = 0; rf < 70; rf++) { var rx = .4 + r() * 2.8, rz = 4.6 + r() * 2.6, rp = P(rx, -.05, rz); s += '<path d="M' + f(rp[0]) + ' ' + f(rp[1]) + 'h' + f(3 + r() * 9) + '" stroke="#ffd59a" stroke-opacity="' + f(.35 + r() * .5) + '" stroke-width="1.8" stroke-linecap="round"/>'; }
  for (var wv = 0; wv < 20; wv++) { var wx = -4.4 + r() * 7.4, wz = 2.4 + r() * 4.6, wp = P(wx, -.05, wz); s += '<path d="M' + f(wp[0]) + ' ' + f(wp[1]) + 'q8 -3 16 0" fill="none" stroke="#d9fbff" stroke-opacity=".5" stroke-width="1.2"/>'; }
  s += '<path d="' + poolD + '" fill="none" stroke="#1a5a66" stroke-width="10" filter="url(#obl3)"/></g>';
  // rocas del borde con nieve (de lejos a cerca)
  ring.slice(0, 36).map(function (p, i) { return [p, i]; }).sort(function (a, b) { return P(b[0][0], 0, b[0][2])[2] - P(a[0][0], 0, a[0][2])[2]; }).forEach(function (q) {
    var p = q[0], i = q[1], pp = P(p[0], .15, p[2]), sc = 380 / pp[2], rw = (.3 + r() * .16) * sc, rh = rw * (.5 + r() * .2), col = ["#5a5650", "#6b655c", "#4a4743", "#7a7368", "#625a50"][i % 5];
    s += '<ellipse cx="' + f(pp[0]) + '" cy="' + f(pp[1]) + '" rx="' + f(rw) + '" ry="' + f(rh) + '" fill="' + col + '"/><ellipse cx="' + f(pp[0] - rw * .25) + '" cy="' + f(pp[1] - rh * .15) + '" rx="' + f(rw * .45) + '" ry="' + f(rh * .35) + '" fill="#fff" fill-opacity=".12"/>';
    if (r() > .25) s += '<path d="M' + f(pp[0] - rw * .9) + ' ' + f(pp[1] - rh * .3) + 'Q' + f(pp[0]) + ' ' + f(pp[1] - rh * 1.6) + ' ' + f(pp[0] + rw * .85) + ' ' + f(pp[1] - rh * .35) + 'Q' + f(pp[0]) + ' ' + f(pp[1] - rh * .55) + ' ' + f(pp[0] - rw * .9) + ' ' + f(pp[1] - rh * .3) + 'Z" fill="#f6f9fc"/>';
  });
  // tarimas redondas de madera con farolillos andon (delante)
  function stump(x, z, R) { var o = '', top = [], side = [];
    for (var k = 0; k <= 24; k++) { var a = k / 24 * Math.PI * 2; top.push([x + Math.cos(a) * R, .45, z + Math.sin(a) * R]); }
    for (var q = 0; q < 24; q++) { var A = top[q], B = top[q + 1]; o += '<path d="' + poly(P, [A, B, [B[0], 0, B[2]], [A[0], 0, A[2]]]) + '" fill="' + (Math.cos(q / 24 * Math.PI * 2) > 0 ? '#5a3822' : '#6e4628') + '" stroke="#4a2e1c" stroke-width=".6"/>'; }
    o += '<path d="' + poly(P, top) + '" fill="#a8764a" stroke="#6a4426" stroke-width="1.4"/>';
    for (var g = 1; g < 5; g++) { var ring2 = []; for (var k2 = 0; k2 <= 24; k2++) { var a2 = k2 / 24 * Math.PI * 2; ring2.push([x + Math.cos(a2) * R * g / 5, .451, z + Math.sin(a2) * R * g / 5]); } o += '<path d="' + poly(P, ring2) + '" fill="none" stroke="#7a5030" stroke-width="1"/>'; }
    return o; }
  function andon(x, z, sc) { var b = P(x, .45, z), t = P(x, .45 + .55 * sc, z), w = (b[1] - t[1]) * .7;
    return '<circle cx="' + f(b[0]) + '" cy="' + f((b[1] + t[1]) / 2) + '" r="' + f(w * 3.2) + '" fill="url(#olg3)"/><rect x="' + f(b[0] - w / 2) + '" y="' + f(t[1]) + '" width="' + f(w) + '" height="' + f(b[1] - t[1]) + '" fill="#fff2d0" stroke="#3a2a1e" stroke-width="' + f(w * .12) + '"/><path d="M' + f(b[0] - w / 2) + ' ' + f(t[1] + (b[1] - t[1]) * .33) + 'h' + f(w) + 'M' + f(b[0] - w / 2) + ' ' + f(t[1] + (b[1] - t[1]) * .66) + 'h' + f(w) + '" stroke="#e8c88a" stroke-width="' + f(w * .06) + '"/><rect x="' + f(b[0] - w * .6) + '" y="' + f(t[1] - w * .14) + '" width="' + f(w * 1.2) + '" height="' + f(w * .16) + '" fill="#3a2a1e"/>'; }
  s += stump(-1.6, 1.25, .3) + andon(-1.6, 1.25, .62) + stump(-1.05, .85, .24) + '<g>' + (function () { var b = P(-1.05, .45, .85), w = 8; return '<circle cx="' + f(b[0]) + '" cy="' + f(b[1] - 8) + '" r="30" fill="url(#olg3)"/><rect x="' + f(b[0] - w) + '" y="' + f(b[1] - 18) + '" width="' + (w * 2) + '" height="18" rx="3" fill="#ffe8b8" stroke="#3a2a1e" stroke-width="1.6"/>'; })() + '</g>' + stump(1.55, 1.3, .3) + andon(1.55, 1.3, .64);
  // nieve del primer plano, mullida
  s += '<path d="M-10 860V790C30 776 70 784 110 800 150 786 190 796 220 812 260 800 310 806 350 790 380 782 410 790 410 860Z" fill="#f4f7fa" filter="url(#osn)"/><path d="M-10 806C40 792 90 802 130 816M240 822C290 810 340 814 410 800" fill="none" stroke="#cad6e2" stroke-width="6" filter="url(#osn)"/>';
  for (var sb = 0; sb < 12; sb++) s += '<ellipse cx="' + f(r() * 400) + '" cy="' + f(826 + r() * 34) + '" rx="' + f(20 + r() * 40) + '" ry="' + f(8 + r() * 10) + '" fill="#e2e9f1"/>';
  return svg(s, 400, 860);
}
// vapor que sube del agua
function onsenFx3(d, node) { for (var k = 0; k < 4; k++) d.appendChild(node("steam", "left:" + (14 + k * 18) + "%;bottom:28vh;animation-delay:" + (-k * 3.6) + "s;animation-duration:" + (12 + k * 1.6) + "s")); }

function tanabataExtra() {
  var r = seeded(1301), s = '<defs><radialGradient id="tmo"><stop offset="0" stop-color="#fffbe8"/><stop offset=".7" stop-color="#fff1c8"/><stop offset="1" stop-color="#f6dca0"/></radialGradient><radialGradient id="tmg"><stop offset=".5" stop-color="#fff2c0" stop-opacity=".35"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="tlg"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient><linearGradient id="trv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2058" stop-opacity="0"/><stop offset=".3" stop-color="#1a2058" stop-opacity=".85"/><stop offset="1" stop-color="#0c1034"/></linearGradient></defs>';
  // luna llena con halo y manchas
  s += '<circle cx="316" cy="150" r="120" fill="url(#tmg)"/><circle cx="316" cy="150" r="46" fill="url(#tmo)"/><g fill="#e8d4a0" fill-opacity=".45"><ellipse cx="300" cy="140" rx="12" ry="8"/><ellipse cx="326" cy="166" rx="9" ry="6"/><ellipse cx="330" cy="134" rx="6" ry="4"/></g>';
  // nubes finas delante de la luna
  s += '<path d="M230 196C260 186 300 192 340 186S400 190 420 186V196C390 202 350 198 310 204S250 204 230 196Z" fill="#c9c0f0" fill-opacity=".35"/><path d="M-10 260C40 250 90 256 140 250V258C90 266 40 262 -10 270Z" fill="#c9c0f0" fill-opacity=".25"/>';
  // puente de urracas sobre la Vía Láctea, entre Orihime y Hikoboshi
  var A = [80, 330], B = [320, 460];
  for (var k = 1; k < 18; k++) { var t = k / 18, x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t - Math.sin(t * Math.PI) * 70, sc = .8 + r() * .4, fl = (k % 2 ? 1 : -1);
    s += '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + f(sc) + ') rotate(' + f(-20 + r() * 40) + ')"><path d="M-9 0Q-4 -6 0 0Q4 -6 9 0Q4 -2 0 2Q-4 -2 -9 0Z" fill="#1a1a2e"/><path d="M0 0L-2 5 2 5Z" fill="#1a1a2e"/><path d="M-6 -1.4Q-3 -4 -1 -1" fill="none" stroke="#f4f2ff" stroke-width=".9"/></g>'; }
  s += '<circle cx="80" cy="330" r="5" fill="#fff"/><circle cx="320" cy="460" r="5" fill="#fff"/><circle cx="80" cy="330" r="16" fill="#cfe0ff" fill-opacity=".35"/><circle cx="320" cy="460" r="16" fill="#ffe0cf" fill-opacity=".35"/>';
  // farolillos colgando del bambú
  [[60, 640], [96, 700], [330, 650], [360, 720], [34, 760]].forEach(function (l) { s += '<path d="M' + l[0] + ' ' + (l[1] - 22) + 'V' + (l[1] - 8) + '" stroke="#e6e0d0" stroke-width=".8"/><circle cx="' + l[0] + '" cy="' + l[1] + '" r="26" fill="url(#tlg)"/><path d="M' + (l[0] - 7) + ' ' + (l[1] - 8) + 'C' + (l[0] - 12) + ' ' + (l[1] - 4) + ' ' + (l[0] - 12) + ' ' + (l[1] + 8) + ' ' + (l[0] - 7) + ' ' + (l[1] + 10) + 'H' + (l[0] + 7) + 'C' + (l[0] + 12) + ' ' + (l[1] + 8) + ' ' + (l[0] + 12) + ' ' + (l[1] - 4) + ' ' + (l[0] + 7) + ' ' + (l[1] - 8) + 'Z" fill="#ffd27a"/><path d="M' + (l[0] - 10) + ' ' + (l[1] - 2) + 'H' + (l[0] + 10) + 'M' + (l[0] - 10) + ' ' + (l[1] + 4) + 'H' + (l[0] + 10) + '" stroke="#e88a3a" stroke-width=".8"/><text x="' + l[0] + '" y="' + (l[1] + 4) + '" font-family="' + MINCHO + '" font-size="9" text-anchor="middle" fill="#a8302a">願</text>'; });
  // río al pie, con reflejo de la luna
  s += '<path d="M-10 790C80 778 200 784 410 776V860H-10Z" fill="url(#trv)"/>';
  for (var w = 0; w < 10; w++) s += '<rect x="' + f(290 + (r() - .5) * 60) + '" y="' + f(796 + w * 6) + '" width="' + f(16 + r() * 30) + '" height="1.6" rx=".8" fill="#fff1c8" fill-opacity="' + f(.6 - w * .05) + '"/>';
  return svg(s, 400, 860);
}
// luciérnagas que se encienden y se mueven, y farolillos de papel que bajan por el río
function tanabataFx(d, node) {
  var r = seeded(1311), s = '<defs><radialGradient id="tff"><stop offset="0" stop-color="#f6ffb0"/><stop offset=".3" stop-color="#d8ff6a" stop-opacity=".7"/><stop offset="1" stop-color="#b8ff4a" stop-opacity="0"/></radialGradient><radialGradient id="tlg2"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>';
  for (var k = 0; k < 34; k++) { var x = r() * 400, y = 520 + r() * 300, dur = 3 + r() * 4, mv = 6 + r() * 10, beg = f(r() * dur);
    s += '<g><animateTransform attributeName="transform" type="translate" values="0 0;' + f(mv) + ' ' + f(-mv) + ';' + f(-mv * .6) + ' ' + f(-mv * 1.4) + ';0 0" dur="' + f(dur * 2.4) + 's" begin="' + beg + 's" repeatCount="indefinite"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="7" fill="url(#tff)" opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.25;0.55;1" dur="' + f(dur) + 's" begin="' + beg + 's" repeatCount="indefinite"/></circle><circle cx="' + f(x) + '" cy="' + f(y) + '" r="1.3" fill="#fbffd8" opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.25;0.55;1" dur="' + f(dur) + 's" begin="' + beg + 's" repeatCount="indefinite"/></circle></g>'; }
  for (var j = 0; j < 4; j++) { var y2 = 808 + j * 11, sc = .8 + j * .15;
    s += '<g><animateTransform attributeName="transform" type="translate" values="-60 0;460 0" dur="' + (34 + j * 6) + 's" begin="' + (-j * 9) + 's" repeatCount="indefinite"/><circle cx="0" cy="' + y2 + '" r="' + f(18 * sc) + '" fill="url(#tlg2)"/><rect x="' + f(-6 * sc) + '" y="' + f(y2 - 10 * sc) + '" width="' + f(12 * sc) + '" height="' + f(10 * sc) + '" fill="#fff0c8" stroke="#8a5a2a" stroke-width=".8"/><rect x="' + f(-8 * sc) + '" y="' + f(y2) + '" width="' + f(16 * sc) + '" height="' + f(2.4 * sc) + '" fill="#6a4426"/></g>'; }
  d.appendChild(node("scene", "background-image:" + svg(s, 400, 860)));
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "onsen") { p.scene = onsenScene3; p.fx = onsenFx3; p.steam = false; } });
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "tanabata") { var old = p.scene; p.scene = function () { return tanabataExtra() + ", " + old(); }; p.fx = tanabataFx; } });

  // Akihabara sube al puesto de Hasu (se conoce antes) y Hasu pasa al de Akihabara
  (function () { var P = window.KANAME_PALETTES, a = -1, h = -1; P.forEach(function (p, i) { if (p.id === "akihabara") a = i; if (p.id === "hasu") h = i; }); if (a >= 0 && h >= 0) { var t = P[a]; P[a] = P[h]; P[h] = t; } })();

  // Días de racha de cada paleta en KanaMe Kanji: 1, 2, 4… y desde Edo (20) una cada 5 días hasta Kin
  (function () { var D = { sumi: 0, shiro: 1, sakura: 2, matcha: 4, inari: 6, koi: 8, machi: 10, ajisai: 12, geisha: 14, akihabara: 16, edo: 20, hanabi: 25, kaguya: 30, daruma: 35, fuji: 40, onsen: 45, fujisan: 50, matsuri: 55, yuki: 60, maneki: 65, umi: 70, tanabata: 75, momiji: 80, ryu: 85, yoru: 90, hasu: 95, shibuya: 100, kin: 105 }; window.KANAME_PALETTES.forEach(function (p) { if (p.id in D) p.days = D[p.id]; }); })();
}
