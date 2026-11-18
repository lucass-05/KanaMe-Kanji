/* 鯉 Koi: acuarela y tinta sobre papel */
import { brushCloud, patchPal } from "./common.js";
import { curvePts, ellipseD, ribbon } from "../scenes-v5.js";
import { f } from "../medals.js";
import { seeded, svg, washi } from "../shapes.js";
// Papel envejecido, luna pálida, sauce llorón, aguadas de tinta gris azulada, poema vertical con sellos rojos
// y dos carpas kōhaku dando vueltas una alrededor de la otra, con escamas pintadas y colas de velo.
export var KOI_INK_DEFS = '<filter id="wash" x="-40%" y="-40%" width="180%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="4" seed="3" result="n"/>' +
  '<feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="11" result="b"/>' +
  '<feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="8" result="m"/><feColorMatrix in="m" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.2 -.1" result="ma"/>' +
  '<feComposite in="b" in2="ma" operator="arithmetic" k1=".7" k2=".55" k3="0" k4="0"/></filter>' +
  '<filter id="pnt" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter>' +
  '<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
  '<radialGradient id="moon" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#fbf3df"/><stop offset=".75" stop-color="#f3e5c4"/><stop offset="1" stop-color="#ead8b0"/></radialGradient>' +
  '<radialGradient id="mglow"><stop offset=".55" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>';
// Carpa a la acuarela. spine(t): t = 0 hocico … 1 nacimiento de la cola; patches: [t0, t1, s0, s1] zonas rojas
function inkKoi(id, spine, W, patches, tailDir) {
  var N = 40, P = curvePts(spine, N);
  var wf = function (t) { return t < .16 ? W * (.66 + t * 2.1) : W * (1 - Math.pow((t - .16) / .84, 1.5) * .82); };
  function at(t, sN) { var i = Math.max(0, Math.min(N, Math.round(t * N))), a = P[Math.max(0, i - 1)], b = P[Math.min(N, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [P[i][0] - dy / l * wf(t) / 2 * sN, P[i][1] + dx / l * wf(t) / 2 * sN, Math.atan2(dy, dx)]; }
  var body = ribbon(P, wf) + ellipseD(P[0][0], P[0][1], wf(0) / 2, wf(0) / 2);
  var s = '<defs><clipPath id="' + id + 'c"><path d="' + body + '"/></clipPath></defs>';
  // cola de velo: dos lóbulos largos que siguen la curva del cuerpo
  var tb = at(1, 0), ta = tb[2];
  [-1, 1].forEach(function (side) {
    var lobe = curvePts(function (t) { var a = ta + side * (.28 + t * .25) + tailDir * t * .9; return [tb[0] + Math.cos(a) * t * 70, tb[1] + Math.sin(a) * t * 70]; }, 20);
    s += '<path d="' + ribbon(lobe, function (t) { return 4 + Math.sin(t * Math.PI) * 22 * (1 - t * .3); }) + '" fill="#f6dcc4" fill-opacity=".55" filter="url(#pnt)"/>';
    for (var k = 0; k < 7; k++) { var o = (k - 3) * .07; s += '<path d="M' + lobe.map(function (p, i) { var t = i / 20, a = ta + side * (.28 + t * .25 + o) + tailDir * t * .9; return f(tb[0] + Math.cos(a) * t * 68) + ' ' + f(tb[1] + Math.sin(a) * t * 68); }).join("L") + '" fill="none" stroke="#d9a07a" stroke-opacity=".45" stroke-width=".6"/>'; }
  });
  // aletas pectorales grandes y ventrales
  [[.2, 30, .55], [.55, 18, .5]].forEach(function (fn) {
    [-1, 1].forEach(function (side) {
      var p = at(fn[0], side * .85), a = p[2] + Math.PI * .72 * side, L = fn[1];
      var tip1 = [p[0] + Math.cos(a - .32) * L, p[1] + Math.sin(a - .32) * L], tip2 = [p[0] + Math.cos(a + .32) * L, p[1] + Math.sin(a + .32) * L];
      s += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'Q' + f(tip1[0]) + ' ' + f(tip1[1]) + ' ' + f((tip1[0] + tip2[0]) / 2) + ' ' + f((tip1[1] + tip2[1]) / 2) + 'Q' + f(tip2[0]) + ' ' + f(tip2[1]) + ' ' + f(p[0] + Math.cos(p[2]) * 6) + ' ' + f(p[1] + Math.sin(p[2]) * 6) + 'Z" fill="#f4d2b4" fill-opacity=".6" filter="url(#pnt)"/>';
      for (var k = 0; k < 6; k++) { var aa = a - .3 + k * .12; s += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(p[0] + Math.cos(aa) * L * .95) + ' ' + f(p[1] + Math.sin(aa) * L * .95) + '" stroke="#cf8a5e" stroke-opacity=".45" stroke-width=".6"/>'; }
    });
  });
  // cuerpo blanco con sombra gris azulada en los bordes
  s += '<path d="' + body + '" fill="#fbf7ee" filter="url(#pnt)"/><g clip-path="url(#' + id + 'c)">' +
    '<path d="' + body + '" fill="none" stroke="#b4bcc2" stroke-opacity=".45" stroke-width="7" filter="url(#soft)"/>';
  // escamas: cada una es una pincelada en media luna; rojas dentro de las manchas y casi invisibles en el blanco
  var r = seeded(id.length * 7 + 3), red = '', white = '';
  for (var ti = .1; ti < .97; ti += .026) {
    var cols = Math.max(4, Math.round(wf(ti) / 3.6));
    for (var j = 0; j <= cols; j++) {
      var sN = -1 + 2 * j / cols + (Math.round(ti / .026) % 2 ? 1 / cols : 0), p = at(ti, sN), sz = 1.6 + wf(ti) / 34;
      var inP = patches.some(function (q) { var edge = (r() - .5) * .08; return ti > q[0] + edge && ti < q[1] + edge && sN > q[2] + (r() - .5) * .3 && sN < q[3] + (r() - .5) * .3; });
      var arc = '<path d="M' + f(p[0] - Math.cos(p[2] + 1.57) * sz) + ' ' + f(p[1] - Math.sin(p[2] + 1.57) * sz) + 'A' + f(sz) + ' ' + f(sz) + ' 0 0 0 ' + f(p[0] + Math.cos(p[2] + 1.57) * sz) + ' ' + f(p[1] + Math.sin(p[2] + 1.57) * sz) + '"';
      if (inP) red += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(sz * 1.25) + '" fill="' + (r() > .35 ? "#e8622e" : "#f08040") + '" fill-opacity="' + f(.8 + r() * .2) + '"/>' + arc + ' fill="none" stroke="#b9391a" stroke-opacity=".55" stroke-width=".6"/>';
      else white += arc + ' fill="none" stroke="#a7b2ba" stroke-opacity=".35" stroke-width=".55"/>';
    }
  }
  s += '<g filter="url(#pnt)">' + red + white + '</g>';
  // brillo del lomo
  s += '<path d="M' + P.slice(4, 30).map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join("L") + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" filter="url(#soft)"/></g>';
  // cabeza: ojos, boca y barbillas
  var e1 = at(.07, .62), e2 = at(.07, -.62), m = P[0], ma = at(0, 0)[2];
  s += '<circle cx="' + f(e1[0]) + '" cy="' + f(e1[1]) + '" r="2.3" fill="#2a2420"/><circle cx="' + f(e2[0]) + '" cy="' + f(e2[1]) + '" r="2.3" fill="#2a2420"/>' +
    '<circle cx="' + f(e1[0] - .6) + '" cy="' + f(e1[1] - .6) + '" r=".7" fill="#fff"/><circle cx="' + f(e2[0] - .6) + '" cy="' + f(e2[1] - .6) + '" r=".7" fill="#fff"/>';
  var mx = m[0] - Math.cos(ma) * wf(0) * .45, my = m[1] - Math.sin(ma) * wf(0) * .45;
  [-1, 1].forEach(function (side) { var a = ma + Math.PI + side * .5; s += '<path d="M' + f(mx) + ' ' + f(my) + 'q' + f(Math.cos(a) * 6) + ' ' + f(Math.sin(a) * 6) + ' ' + f(Math.cos(a + side * .6) * 10) + ' ' + f(Math.sin(a + side * .6) * 10) + '" fill="none" stroke="#8a7a6a" stroke-width=".7" stroke-linecap="round"/>'; });
  return s;
}
function willow(x0, sd) {
  var r = seeded(sd), s = '';
  for (var b = 0; b < 7; b++) {
    var bx = x0 + b * 13 + r() * 10, len = 220 + r() * 260, sway = -30 - r() * 40;
    var pts = curvePts(function (t) { return [bx + Math.sin(t * 1.6) * sway * t, -10 + t * len]; }, 30);
    s += '<path d="M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join("L") + '" fill="none" stroke="#5b5a3a" stroke-opacity=".65" stroke-width="1.1"/>';
    for (var i = 3; i < 30; i += 1.5) {
      var p = pts[Math.floor(i)], side = Math.floor(i * 2) % 2 ? 1 : -1, a = 90 + side * (18 + r() * 22), L = 16 + r() * 14;
      s += '<path d="M0 0C3 -2.4 ' + f(L * .6) + ' -2.6 ' + f(L) + ' 0 ' + f(L * .6) + ' 2.6 3 2.4 0 0Z" transform="translate(' + f(p[0]) + ' ' + f(p[1]) + ') rotate(' + f(a) + ')" fill="' + (r() > .5 ? "#7d8a52" : "#98a468") + '" fill-opacity="' + f(.55 + r() * .4) + '"/>';
    }
  }
  return s;
}
export function koiWater() {
  var s = '<defs>' + KOI_INK_DEFS + '</defs>';
  // aguadas de tinta (nubes y agua) en gris azulado
  s += '<g filter="url(#wash)" fill="#8fa3b5">' +
    '<ellipse cx="60" cy="430" rx="120" ry="70" fill-opacity=".45"/><ellipse cx="300" cy="440" rx="90" ry="40" fill-opacity=".3"/>' +
    '<ellipse cx="40" cy="700" rx="140" ry="110" fill-opacity=".55"/><ellipse cx="200" cy="700" rx="150" ry="120" fill-opacity=".4"/>' +
    '<ellipse cx="90" cy="820" rx="160" ry="70" fill-opacity=".6"/><ellipse cx="330" cy="830" rx="110" ry="50" fill-opacity=".35"/></g>';
  // luna llena pálida, con manchas
  s += '<circle cx="214" cy="236" r="150" fill="url(#mglow)"/><circle cx="214" cy="236" r="104" fill="url(#moon)" filter="url(#pnt)"/>' +
    '<g filter="url(#wash)" fill="#e2cfa6" fill-opacity=".3"><ellipse cx="180" cy="262" rx="40" ry="26"/><ellipse cx="246" cy="214" rx="22" ry="14"/></g>';
  // sauce llorón desde arriba a la derecha
  s += '<g filter="url(#pnt)">' + willow(290, 11) + '</g>';
  // poema vertical y sellos rojos
  s += '<text x="40" y="372" font-family="Hiragino Mincho ProN, Yu Mincho, Noto Serif CJK JP, Noto Sans CJK JP, serif" font-size="21" fill="#2a2420" fill-opacity=".8" writing-mode="tb" letter-spacing="4">鯉躍月影</text>' +
    '<g transform="translate(28 490)"><rect width="22" height="22" rx="2" fill="#b8392a" fill-opacity=".85"/><text x="11" y="16.5" font-family="Hiragino Mincho ProN, Yu Mincho, Noto Serif CJK JP, serif" font-size="15" text-anchor="middle" fill="#f3e6cf">鯉</text></g>' +
    '<g transform="translate(28 520)"><rect width="22" height="22" rx="2" fill="none" stroke="#b8392a" stroke-width="2"/><text x="11" y="16.5" font-family="Hiragino Mincho ProN, Yu Mincho, Noto Serif CJK JP, serif" font-size="14" text-anchor="middle" fill="#b8392a">和</text></g>';
  // ondas alrededor de las carpas
  var cx = 206, cy = 700;
  s += '<g fill="none" stroke="#ffffff" stroke-linecap="round" filter="url(#pnt)">';
  [[120, .7], [140, .5], [160, .35], [96, .55]].forEach(function (o, i) { s += '<path d="M' + (cx - o[0]) + ' ' + cy + 'A' + o[0] + ' ' + f(o[0] * .82) + ' 0 0 1 ' + f(cx + o[0] * .4) + ' ' + f(cy - o[0] * .75) + '" stroke-opacity="' + o[1] + '" stroke-width="1.6"/><path d="M' + (cx + o[0]) + ' ' + cy + 'A' + o[0] + ' ' + f(o[0] * .82) + ' 0 0 1 ' + f(cx - o[0] * .3) + ' ' + f(cy + o[0] * .79) + '" stroke-opacity="' + o[1] + '" stroke-width="1.6"/>'; });
  s += '</g>';
  // dos kōhaku dando vueltas
  var arc = function (a0, a1, R) { return function (t) { var a = (a0 + (a1 - a0) * t) * Math.PI / 180; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R * .9]; }; };
  s += inkKoi("ka", arc(72, 180, 104), 48, [[.05, .3, -1.2, .5], [.4, .8, -1.2, .7]], 1);
  s += inkKoi("kb", arc(256, 360, 98), 45, [[.03, .2, -.6, 1.2], [.3, .72, -1, 1.2]], 1);
  return svg(s, 400, 860);
}
// nubes a pincel que enmarcan (abajo a la izquierda y arriba a la derecha), en aguada de tinta
function koiClouds() {
  return svg('<defs>' + KOI_INK_DEFS + '</defs><g filter="url(#wash)" fill="#7f94a8"><ellipse cx="20" cy="860" rx="150" ry="60" fill-opacity=".55"/><ellipse cx="400" cy="20" rx="130" ry="60" fill-opacity=".35"/></g>' +
    '<g filter="url(#pnt)">' + brushCloud(-34, 830, 1.05, false, "#efe6d4", "#6a7a88", 3) + brushCloud(434, 120, .9, true, "#efe6d4", "#6a7a88", 7) + '</g>', 400, 860);
}

export function init() {
  patchPal("koi", {
    bg: "#ebe1cd", surface: "#f8f2e6", raised: "#efe5d2", hairline: "#d8c9ac",
    text: "#2a2420", muted: "#6a5d50", faint: "#9d9080", status: "#d9542b", accent: "#d9542b",
    again: "#b4473b", hard: "#94661a", good: "#4f7a55", easy: "#4a6f94",
    grad: "linear-gradient(180deg, #efe6d3 0%, #e8dcc4 55%, #dfd2b8 100%)", tile: washi(), tileSize: "220px 220px",
    koiPond: false, scene: function () { return koiClouds() + ", " + koiWater(); }, glow: "rgba(217,84,43,.14)",
    pantone: "Inspirada en PANTONE Tigerlily 17-1456 (rojo kōhaku), Sand Dollar 13-1106 (papel) y aguadas gris azulado",
    burst: { shapes: ["fish", "petal", "bubble"], colors: ["#ffffff", "#e5602f", "#f6dcc4", "#8fa3b5"] }
  });
}
