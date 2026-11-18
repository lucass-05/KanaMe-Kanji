/* 江戸 Edo: pintura antigua a pincel */
import { KOI_INK_DEFS } from "./koi.js";
import { MINCHO } from "./varias.js";
import { curvePts, ribbon } from "../scenes-v5.js";
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
// Montes en aguadas moteadas, crestas a pincel, textura de fibras (cun) y puntos de musgo; pagoda y salas dibujadas
// con línea fina y lavadas de color; pinos de agujas en abanico, puente de piedra, río a pincel seco, bambú sumi-e
// y el haiku de Bashō con sus sellos.
export function brushPath(pts, wmax, sd, taper) {
  var rr = seeded(sd);
  var noise = pts.map(function () { return .55 + rr() * .45; });
  return ribbon(pts, function (t) { var i = Math.round(t * (pts.length - 1)); return wmax * noise[i] * (taper === false ? 1 : Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), .5) + .08); });
}
export function edoLandscape() {
  var r = seeded(52), INK = "#1e1d19";
  var s = '<defs>' + KOI_INK_DEFS +
    '<filter id="dry" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9 .08" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.2 -.8" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>' +
    '<filter id="fib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6 .02" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 .14 0"/></filter>' +
    '<radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#6a5a3a" stop-opacity="0"/><stop offset="1" stop-color="#6a5a3a" stop-opacity=".28"/></radialGradient>';
  var L = [["#9aa292", .55, 300], ["#859080", .6, 420], ["#6f7c69", .66, 520], ["#5d6a58", .72, 610]];
  L.forEach(function (l, i) { s += '<linearGradient id="eg' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + l[0] + '" stop-opacity="' + l[1] + '"/><stop offset=".35" stop-color="' + l[0] + '" stop-opacity="' + f(l[1] * .55) + '"/><stop offset=".8" stop-color="' + l[0] + '" stop-opacity="0"/></linearGradient>'; });
  s += '</defs><rect width="400" height="860" filter="url(#fib)"/>';
  // ---- montes ----
  L.forEach(function (l, i) {
    var humps = [], n = 2 + (i % 2) + (i > 1 ? 1 : 0);
    for (var h = 0; h < n; h++) humps.push([-30 + (h + .2 + r() * .6) * 460 / n, 70 + r() * 80 - i * 8, 60 + r() * 50]);
    var pts = [];
    var ph = r() * 9; for (var x = -30; x <= 430; x += 5) { var y = l[2]; humps.forEach(function (hp) { y -= hp[1] * Math.exp(-Math.pow((x - hp[0]) / hp[2], 2)); }); y += Math.sin(x / 17 + ph) * 4 + Math.sin(x / 7.3 + ph * 2) * 2.2 + Math.sin(x / 41 + ph) * 7; pts.push([x, y]); }
    var line = 'M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L');
    s += '<path d="' + line + 'L430 ' + (l[2] + 260) + 'L-30 ' + (l[2] + 260) + 'Z" fill="url(#eg' + i + ')" filter="url(#wash)"/>';
    // tinta acumulada bajo la cresta
    s += '<path d="' + line + 'L430 ' + (l[2] + 40) + 'L-30 ' + (l[2] + 40) + 'Z" fill="' + l[0] + '" fill-opacity=".55" filter="url(#wash)" transform="translate(0 4)"/>';
    // cresta a pincel, con trazo que engorda y adelgaza
    var segs = '', st = 0; while (st < pts.length - 4) { var len2 = 8 + ((r() * 22) | 0), seg = pts.slice(st, Math.min(pts.length, st + len2)); if (seg.length > 3) segs += '<path d="' + brushPath(seg, 3.2 + i * 1.1, st + i * 100) + '"/>'; st += len2 + ((r() * 4) | 0); }
    s += '<g fill="' + INK + '" fill-opacity="' + (.45 + i * .1) + '" filter="url(#pnt)">' + segs + '</g>';
    // textura de fibras de cáñamo (cun) bajando por las laderas
    var cun = '';
    for (var k = 0; k < 70; k++) { var p = pts[(r() * pts.length) | 0], len = 10 + r() * 26, dir = (r() - .5) * .6; cun += '<path d="' + brushPath(curvePts(function (t) { return [p[0] + Math.sin(dir) * len * t + Math.sin(t * 3) * 2, p[1] + 3 + len * t]; }, 6), .9 + r() * .8, k) + '"/>'; }
    s += '<g fill="' + INK + '" fill-opacity="' + (.14 + i * .04) + '" filter="url(#pnt)">' + cun + '</g>';
    // puntos de musgo (ten) y arbolillos en la cresta
    var dots = '';
    for (var m = 0; m < 110; m++) { var q = pts[(r() * pts.length) | 0], dx = (r() - .5) * 8, dy = r() * 14 - 3; dots += '<ellipse cx="' + f(q[0] + dx) + '" cy="' + f(q[1] + dy) + '" rx="' + f(.8 + r() * 2.2) + '" ry="' + f(.6 + r() * 1.2) + '" transform="rotate(' + f(r() * 60 - 30) + ' ' + f(q[0] + dx) + ' ' + f(q[1] + dy) + ')" fill-opacity="' + f(.3 + r() * .6) + '"/>'; }
    for (var tr = 0; tr < 12; tr++) { var tq = pts[(r() * pts.length) | 0]; dots += '<path d="M' + f(tq[0]) + ' ' + f(tq[1]) + 'v-' + f(5 + r() * 6) + '" stroke="' + INK + '" stroke-width=".8"/><circle cx="' + f(tq[0]) + '" cy="' + f(tq[1] - 7) + '" r="' + f(1.4 + r()) + '"/>'; }
    s += '<g fill="#2e3628" filter="url(#pnt)">' + dots + '</g>';
    for (var mi = 0; mi < 4; mi++) s += '<ellipse cx="' + f(-40 + mi * 140 + r() * 60) + '" cy="' + f(l[2] + 40 + r() * 30) + '" rx="' + f(90 + r() * 60) + '" ry="' + f(14 + r() * 10) + '" fill="#f1ede3" fill-opacity=".8" filter="url(#wash)"/>';
  });
  // ---- pagoda y salas: línea fina a tinta con lavadas de color ----
  function roof(cx, y, w, d) {
    d = d * 1.4; var top = 'M' + f(cx - w * .7) + ' ' + f(y - d) + 'H' + f(cx + w * .7), eL = 'Q' + f(cx + w * 1.05) + ' ' + f(y - 1) + ' ' + f(cx + w * 1.45) + ' ' + f(y - 9);
    var path = top + eL + 'Q' + f(cx) + ' ' + f(y + 3) + ' ' + f(cx - w * 1.45) + ' ' + f(y - 9) + 'Q' + f(cx - w * 1.05) + ' ' + f(y - 1) + ' ' + f(cx - w * .7) + ' ' + f(y - d) + 'Z';
    var o = '<path d="' + path + '" fill="#2a2a25" fill-opacity=".82" filter="url(#pnt)"/>';
    for (var t = 0; t < 12; t++) { var tx = cx - w * .75 + t * w * 1.5 / 11; o += '<path d="M' + f(tx) + ' ' + f(y - d + 1) + 'L' + f(tx + (tx - cx) * .3) + ' ' + f(y - 2) + '" stroke="#6a6a60" stroke-width=".5"/>'; }
    return o + '<path d="M' + f(cx - w * 1.45) + ' ' + f(y - 9) + 'Q' + f(cx) + ' ' + f(y + 4) + ' ' + f(cx + w * 1.45) + ' ' + f(y - 9) + '" fill="none" stroke="' + INK + '" stroke-width="1.2" filter="url(#pnt)"/>';
  }
  function storey(cx, y, w, h, red) {
    var o = '<rect x="' + f(cx - w) + '" y="' + f(y - h) + '" width="' + f(w * 2) + '" height="' + f(h) + '" fill="#d6cfbb" fill-opacity=".75"/>';
    o += '<g fill="none" stroke="' + INK + '" stroke-width=".8" filter="url(#pnt)"><path d="M' + f(cx - w) + ' ' + f(y) + 'V' + f(y - h) + 'H' + f(cx + w) + 'V' + f(y) + '"/>';
    for (var c = 1; c < 6; c++) o += '<path d="M' + f(cx - w + c * w / 3) + ' ' + f(y - h) + 'V' + f(y) + '"/>';
    o += '<path d="M' + f(cx - w - 3) + ' ' + f(y - h * .38) + 'H' + f(cx + w + 3) + 'M' + f(cx - w - 3) + ' ' + f(y - h * .38 + 2.4) + 'H' + f(cx + w + 3) + '"/>';
    for (var b = 0; b <= 16; b++) o += '<path d="M' + f(cx - w - 3 + b * (w * 2 + 6) / 16) + ' ' + f(y - h * .38) + 'v' + f(h * .38) + '" stroke-width=".45"/>';
    o += '</g>';
    if (red) for (var c2 = 0; c2 <= 6; c2++) o += '<rect x="' + f(cx - w + c2 * w / 3 - 1.4) + '" y="' + f(y - h * .38) + '" width="2.8" height="' + f(h * .38) + '" fill="#a8362c" fill-opacity=".75" filter="url(#pnt)"/>';
    return o;
  }
  var cx = 214, base = 646;
  s += '<g><path d="M156 ' + base + 'H272L266 ' + (base + 10) + 'H162Z" fill="#a49d8a" fill-opacity=".7" stroke="' + INK + '" stroke-width=".8" filter="url(#pnt)"/>';
  [[44, 22, 1], [36, 18, 0], [29, 16, 0], [22, 14, 0], [15, 12, 0]].forEach(function (t, k) { var yb = base - k * 30; s += storey(cx, yb, t[0], t[1], t[2]) + roof(cx, yb - t[1], t[0], 7); });
  var tip = base - 5 * 30 + 6;
  s += '<path d="M' + cx + ' ' + tip + 'V' + (tip - 26) + '" stroke="' + INK + '" stroke-width="1.8"/>' + [0, 1, 2, 3, 4, 5].map(function (j) { return '<ellipse cx="' + cx + '" cy="' + (tip - 6 - j * 3.4) + '" rx="3" ry="1" fill="none" stroke="' + INK + '" stroke-width=".7"/>'; }).join("") + '<path d="M' + cx + ' ' + (tip - 26) + 'q-2 -6 0 -9q2 3 0 9" fill="' + INK + '"/>';
  s += storey(318, 690, 42, 18, 1) + roof(318, 672, 42, 8) + storey(346, 716, 32, 16, 1) + roof(346, 700, 32, 7) + storey(96, 696, 30, 14, 0) + roof(96, 682, 30, 7) + '</g>';
  // ---- pinos de agujas en abanico ----
  function pine(x, y, sc, sd) {
    var rr = seeded(sd), o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">';
    var trunk = curvePts(function (t) { return [Math.sin(t * 3 + sd) * 8, -t * 90]; }, 14);
    o += '<path d="' + brushPath(trunk, 7, sd, false) + '" fill="#3a3226" filter="url(#pnt)"/>';
    [[-30, -84], [26, -78], [-4, -98], [34, -56], [-36, -58], [8, -66]].forEach(function (c, ci) {
      o += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="26" ry="9" fill="#5d6a50" fill-opacity=".45" filter="url(#wash)"/>';
      for (var f2 = 0; f2 < 3; f2++) { var fx = c[0] + (f2 - 1) * 12, fy = c[1] + (rr() - .5) * 4; for (var nd = 0; nd < 11; nd++) { var a = Math.PI * (1.05 + nd * .09), L = 9 + rr() * 4; o += '<path d="M' + f(fx) + ' ' + f(fy) + 'l' + f(Math.cos(a) * L) + ' ' + f(Math.sin(a) * L * .7) + '" stroke="' + INK + '" stroke-opacity=".8" stroke-width=".8"/>'; } }
      o += '<path d="M0 ' + (c[1] + 24) + 'Q' + f(c[0] * .5) + ' ' + f(c[1] + 10) + ' ' + c[0] + ' ' + c[1] + '" fill="none" stroke="#3a3226" stroke-width="2.2" filter="url(#pnt)"/>';
    });
    return o + '</g>';
  }
  s += pine(62, 730, 1, 3) + pine(150, 716, .75, 4) + pine(372, 744, .8, 5);
  // ---- río a pincel seco y puente de piedra ----
  s += '<path d="M-20 768C80 756 170 776 250 764S370 752 420 758V860H-20Z" fill="#b9c0b6" fill-opacity=".45" filter="url(#wash)"/>';
  for (var dr = 0; dr < 16; dr++) { var ry = 780 + r() * 76, rx = r() * 300; s += '<path d="' + brushPath([[rx, ry], [rx + 40, ry - 1], [rx + 80, ry + 1], [rx + 120, ry]], 1.6, dr) + '" fill="#6d7468" fill-opacity=".35" filter="url(#dry)"/>'; }
  var D = function (x) { return 772 - 56 * (1 - Math.pow((x - 200) / 172, 2)); };
  var deck = curvePts(function (t) { var x = 28 + t * 344; return [x, D(x)]; }, 30), rail = curvePts(function (t) { var x = 28 + t * 344; return [x, D(x) - 13]; }, 30);
  s += '<g filter="url(#pnt)"><path d="M' + deck.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'L340 804Q200 742 60 804Z" fill="#b3ac98" fill-opacity=".7"/>';
  s += '<path d="M60 804Q200 742 340 804" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
  s += '<path d="' + brushPath(deck, 5, 77, false) + '" fill="#4a463c" fill-opacity=".85"/><path d="' + brushPath(rail, 2.2, 78, false) + '" fill="' + INK + '"/>';
  for (var pq = 0; pq <= 17; pq++) { var px2 = 28 + pq * 344 / 17; s += '<path d="M' + f(px2) + ' ' + f(D(px2) - 13) + 'V' + f(D(px2)) + '" stroke="' + INK + '" stroke-width="1.2"/>'; }
  for (var sb = 0; sb < 9; sb++) { var bx2 = 92 + sb * 27; s += '<path d="M' + f(bx2) + ' ' + f(D(bx2) + 4) + 'L' + f(bx2 + (bx2 - 200) * .05) + ' ' + f(804 - 62 * (1 - Math.pow((bx2 - 200) / 140, 2)) + 2) + '" stroke="' + INK + '" stroke-opacity=".3" stroke-width=".7"/>'; }
  s += '</g>';
  // ---- orillas: rocas a pincel, aguada y hierba ----
  [[-10, 800, 70, 1], [410, 790, 70, -1]].forEach(function (b, bi) {
    var rock = 'M' + b[0] + ' 860V' + (b[1] - 16) + 'C' + (b[0] + b[3] * 30) + ' ' + (b[1] - 26) + ' ' + (b[0] + b[3] * 60) + ' ' + (b[1] - 6) + ' ' + (b[0] + b[3] * b[2]) + ' ' + (b[1] + 14) + 'C' + (b[0] + b[3] * 56) + ' ' + (b[1] + 30) + ' ' + (b[0] + b[3] * 50) + ' ' + (b[1] + 46) + ' ' + (b[0] + b[3] * 56) + ' 860Z';
    s += '<path d="' + rock + '" fill="#59614f" fill-opacity=".75" filter="url(#wash)"/><path d="' + rock + '" fill="none" stroke="' + INK + '" stroke-width="1.6" filter="url(#pnt)"/>';
    for (var g2 = 0; g2 < 26; g2++) { var gx = b[0] + b[3] * r() * b[2], gy = b[1] - 10 + r() * 50; s += '<path d="' + brushPath([[gx, gy], [gx + (r() - .5) * 4, gy - 8], [gx + (r() - .5) * 8, gy - 16]], 1.2, g2 + bi * 50) + '" fill="#2e3628" fill-opacity=".8"/>'; }
  });
  // ---- bambú sumi-e arriba a la derecha ----
  s += '<path d="' + brushPath(curvePts(function (t) { return [396 - t * 6, -10 + t * 210]; }, 10), 4.2, 7, false) + '" fill="' + INK + '" fill-opacity=".85" filter="url(#pnt)"/>';
  [40, 96, 152].forEach(function (ny) { s += '<path d="M389 ' + ny + 'h12" stroke="#efebe1" stroke-width="1.6"/>'; });
  var leaves = '', rl = seeded(19);
  [[392, 40], [388, 96], [384, 150], [398, 200]].forEach(function (c) {
    for (var i = 0; i < 6; i++) { var a = (120 + rl() * 110) * Math.PI / 180, Lf = 40 + rl() * 34; leaves += '<path d="' + brushPath(curvePts(function (t) { return [c[0] + Math.cos(a) * Lf * t, c[1] + Math.sin(a) * Lf * t + t * t * 8]; }, 10), 7 + rl() * 3, i * 9 + c[1]) + '" fill-opacity="' + f(.55 + rl() * .4) + '"/>'; }
  });
  s += '<g fill="' + INK + '" filter="url(#pnt)">' + leaves + '</g>';
  // ---- caligrafía y sellos ----
  s += '<g filter="url(#pnt)">';
  [["古池や", 330, 92, 21], ["蛙飛び込む", 302, 92, 21], ["水の音", 274, 112, 21], ["松尾芭蕉", 248, 156, 13]].forEach(function (c) { s += '<text x="' + c[1] + '" y="' + c[2] + '" font-family="' + MINCHO + '" font-weight="700" font-size="' + c[3] + '" fill="' + INK + '" fill-opacity=".86" writing-mode="tb" letter-spacing="3">' + c[0] + '</text>'; });
  s += '<g transform="translate(238 238)"><rect width="22" height="22" rx="1.5" fill="#b0322a" fill-opacity=".86"/><text x="11" y="16" font-family="' + MINCHO + '" font-size="12" text-anchor="middle" fill="#efe6d2">江戸</text></g>' +
    '<g transform="translate(318 206)"><rect width="18" height="18" rx="1.5" fill="none" stroke="#b0322a" stroke-width="1.8"/><text x="9" y="13.4" font-family="' + MINCHO + '" font-size="11" text-anchor="middle" fill="#b0322a">印</text></g></g>';
  s += '<rect width="400" height="860" fill="url(#vig)"/>';
  return svg(s, 400, 860);
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "edo") p.scene = edoLandscape; });
  patchPal("edo", { bg: "#e7e1d1", surface: "#f3efe4", grad: "linear-gradient(180deg, #ece7da 0%, #e5dfcf 60%, #dbd3be 100%)" });
}
