/* 龍 Ryū: dragón a tinta sobre jade oscuro */
import { KOI_INK_DEFS } from "./koi.js";
import { brushPath } from "./edo.js";
import { catmull, curvePts, ribbon } from "../scenes-v5.js";
import { f } from "../medals.js";
import { seeded, svg } from "../shapes.js";
function ryuInk() {
  var r = seeded(88), INKD = "#0b100e", JADE = "#bff3df", GOLD = "#e6b64a";
  var s = '<defs>' + KOI_INK_DEFS +
    '<filter id="rfib" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7 .03" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .7 0 0 0 0 .9 0 0 0 0 .8 0 0 0 .07 0"/></filter>' +
    '<filter id="rw" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>' +
    '<filter id="rb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>' +
    '<filter id="rcl" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="4" seed="12" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="30" result="d"/><feGaussianBlur in="d" stdDeviation="5"/></filter>' +
    '<linearGradient id="rh" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8a6420"/><stop offset=".45" stop-color="#f6d98a"/><stop offset=".7" stop-color="#cfe9dc"/><stop offset="1" stop-color="#e6b64a"/></linearGradient>' +
    '<radialGradient id="rp"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#d9fff0"/><stop offset=".7" stop-color="#4fc3a1" stop-opacity=".5"/><stop offset="1" stop-color="#4fc3a1" stop-opacity="0"/></radialGradient></defs>';
  s += '<rect width="400" height="860" filter="url(#rfib)"/>';
  // aguadas de nube y montes al fondo
  s += '<g filter="url(#wash)" fill="#3f6f64"><ellipse cx="90" cy="200" rx="140" ry="70" fill-opacity=".55"/><ellipse cx="330" cy="420" rx="130" ry="80" fill-opacity=".45"/><ellipse cx="120" cy="700" rx="170" ry="80" fill-opacity=".5"/><ellipse cx="320" cy="820" rx="150" ry="60" fill-opacity=".55"/></g>';
  s += '<g filter="url(#rcl)" fill="#1f4a42"><ellipse cx="60" cy="300" rx="110" ry="60" fill-opacity=".6"/><ellipse cx="360" cy="520" rx="120" ry="70" fill-opacity=".5"/><ellipse cx="200" cy="820" rx="260" ry="80" fill-opacity=".7"/><ellipse cx="330" cy="160" rx="90" ry="50" fill-opacity=".45"/></g>';
  s += '<path d="M-10 860V720L30 650 60 690 90 610 120 680 150 720V860Z" fill="#0f2622" fill-opacity=".9" filter="url(#rw)"/>';
  // nubes auspiciosas con remolinos y borde dorado
  function xiangyun(x, y, sc, op) {
    var o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" opacity="' + op + '"><path d="M-40 10C-50 -6 -34 -20 -20 -12 -16 -30 10 -32 16 -14 30 -24 50 -12 42 4 56 6 56 22 40 24H-36C-50 24 -50 12 -40 10Z" fill="#173a34" fill-opacity=".7" stroke="' + GOLD + '" stroke-width="1.6"/>';
    [[-20, -2, 7], [14, -6, 8], [36, 10, 5]].forEach(function (c) { var pts = curvePts(function (t) { var a = t * Math.PI * 3, rr = c[2] * (1 - t * .85); return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]; }, 30); o += '<path d="M' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + '" fill="none" stroke="' + GOLD + '" stroke-width="1.3"/>'; });
    return o + '</g>';
  }
  s += '<g filter="url(#pnt)">' + xiangyun(60, 180, 1.1, .8) + xiangyun(350, 300, .9, .7) + xiangyun(40, 560, .8, .65) + xiangyun(360, 640, 1.2, .8) + xiangyun(250, 120, .6, .55) + '</g>';
  // perla luminosa
  s += '<circle cx="70" cy="520" r="46" fill="url(#rp)"/><circle cx="70" cy="520" r="11" fill="#effff8"/><circle cx="66" cy="516" r="3" fill="#fff"/>';
  // ---- cuerpo en S ----
  var spine = catmull([[150, 332], [214, 312], [272, 350], [296, 410], [256, 468], [176, 500], [112, 550], [112, 620], [170, 668], [262, 680], [324, 720], [332, 786], [290, 832], [226, 848], [190, 830]], 10);
  var N = spine.length - 1, W = function (t) { return t < .16 ? 50 + t * 190 : 80 * (1 - Math.pow((t - .16) / .84, 1.15) * .88); };
  function at(t, sN) { var fi = Math.max(0, Math.min(N, t * N)), i0 = Math.floor(fi), i1 = Math.min(N, i0 + 1), u = fi - i0, cxp = spine[i0][0] + (spine[i1][0] - spine[i0][0]) * u, cyp = spine[i0][1] + (spine[i1][1] - spine[i0][1]) * u, a = spine[Math.max(0, i0 - 1)], b = spine[Math.min(N, i1 + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [cxp - dy / l * W(t) / 2 * sN, cyp + dx / l * W(t) / 2 * sN, Math.atan2(dy, dx)]; }
  var body = ribbon(spine, W);
  // aletas dorsales en forma de llama (lado exterior)
  var fins = '';
  for (var ti = .04; ti < .97; ti += .02) {
    var p = at(ti, -1), a = p[2] - Math.PI / 2 - .5, L = 12 + W(ti) * .45;
    fins += '<path d="M' + f(p[0] + Math.cos(p[2]) * -5) + ' ' + f(p[1] + Math.sin(p[2]) * -5) + 'Q' + f(p[0] + Math.cos(a) * L * .6) + ' ' + f(p[1] + Math.sin(a) * L * .6) + ' ' + f(p[0] + Math.cos(a - .5) * L) + ' ' + f(p[1] + Math.sin(a - .5) * L) + 'Q' + f(p[0] + Math.cos(a + .2) * L * .4) + ' ' + f(p[1] + Math.sin(a + .2) * L * .4) + ' ' + f(p[0] + Math.cos(p[2]) * 6) + ' ' + f(p[1] + Math.sin(p[2]) * 6) + 'Z"/>';
  }
  s += '<g fill="' + INKD + '" stroke="' + GOLD + '" stroke-opacity=".55" stroke-width=".7" filter="url(#rw)">' + fins + '</g>';
  // patas con garras
  function leg(t, side, len, ang2) {
    var p = at(t, side * .7), a = p[2] + side * Math.PI / 2 + ang2, kx = p[0] + Math.cos(a) * len * .55, ky = p[1] + Math.sin(a) * len * .55, a2 = a - side * .9, fx = kx + Math.cos(a2) * len * .5, fy = ky + Math.sin(a2) * len * .5;
    var o = '<path d="' + ribbon(catmull([[p[0], p[1]], [kx, ky], [fx, fy]], 8), function (u) { return 34 - u * 14; }) + '" fill="' + INKD + '" filter="url(#rw)"/>';
    // mechones del codo
    for (var m = 0; m < 4; m++) { var ma = a + Math.PI + side * (.6 + m * .3); o += '<path d="M' + f(kx) + ' ' + f(ky) + 'q' + f(Math.cos(ma) * 10) + ' ' + f(Math.sin(ma) * 10) + ' ' + f(Math.cos(ma + .4) * 22) + ' ' + f(Math.sin(ma + .4) * 22) + '" fill="none" stroke="' + INKD + '" stroke-width="3" stroke-linecap="round"/>'; }
    // escamas del brazo
    for (var sc2 = 0; sc2 < 5; sc2++) { var u = sc2 / 5, sx = p[0] + (kx - p[0]) * u, sy = p[1] + (ky - p[1]) * u; o += '<path d="M' + f(sx - 4) + ' ' + f(sy) + 'a4 4 0 0 0 8 0" fill="none" stroke="#6f8a80" stroke-width=".8"/>'; }
    // cuatro garras de marfil
    for (var c = 0; c < 4; c++) { var ca = a2 - .8 + c * .5, cl = catmull([[fx, fy], [fx + Math.cos(ca) * 18, fy + Math.sin(ca) * 18], [fx + Math.cos(ca + side * 1.1) * 30, fy + Math.sin(ca + side * 1.1) * 30]], 6); o += '<path d="' + ribbon(cl, function (u) { return 7 * (1 - u) + .4; }) + '" fill="#e2dccb" stroke="' + INKD + '" stroke-width=".8"/>'; }
    return o;
  }
  s += leg(.12, 1, 74, .3) + leg(.14, -1, 70, -.4) + leg(.58, 1, 60, .2) + leg(.6, -1, 58, -.3);
  // cuerpo
  s += '<path d="' + body + '" fill="' + INKD + '" filter="url(#wash)"/><path d="' + body + '" fill="' + INKD + '" filter="url(#rw)"/>';
  // vientre: placas claras en un costado
  var belly = curvePts(function (t) { var p2 = at(.03 + t * .9, .62); return [p2[0], p2[1]]; }, 80);

  // escamas: patrón de escamas superpuestas dentro del cuerpo, bordes a tinta y destellos de oro y jade
  s += '<defs><clipPath id="rcb"><path d="' + body + '"/></clipPath><pattern id="rsc" width="14" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">' +
    '<path d="M-7 10A7 7 0 0 1 7 10M7 10A7 7 0 0 1 21 10M0 5A7 7 0 0 1 14 5M-14 5A7 7 0 0 1 0 5" fill="#26312d" stroke="#9db8ad" stroke-opacity=".8" stroke-width=".9"/>' +
    '<path d="M-3 8A4 3 0 0 1 3 8M11 8A4 3 0 0 1 17 8M4 3A4 3 0 0 1 10 3" fill="none" stroke="#e6f6ee" stroke-opacity=".35" stroke-width=".7"/></pattern></defs>';
  var dabs = '', rdb = seeded(5);
  for (var tt = .02; tt < .98; tt += .0095) { var colsN = Math.max(3, Math.round(W(tt) / 8)); for (var j = 0; j < colsN; j++) { var sN = -.95 + j * 1.35 / colsN + (Math.round(tt / .0095) % 2 ? .67 / colsN : 0); if (sN > .4) continue; var pp = at(tt, sN), sz = 2.2 + W(tt) / 11, ca2 = pp[2] + Math.PI / 2; var arc = curvePts(function (u) { var aa = ca2 + Math.PI * (u - .5) * 1.1 + Math.PI / 2; return [pp[0] + Math.cos(aa) * sz, pp[1] + Math.sin(aa) * sz]; }, 6); dabs += '<path d="' + brushPath(arc, 1.6 + rdb() * .8, (tt * 1000 + j) | 0) + '" fill-opacity="' + f(.45 + rdb() * .45) + '"/>'; } }
  s += '<g clip-path="url(#rcb)"><path d="' + body + '" fill="#1a2723"/><g fill="#9fbcb0" filter="url(#pnt)">' + dabs + '</g>' +
    '<path d="M' + spine.slice(4, spine.length - 6).map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + '" fill="none" stroke="#4f7a6e" stroke-opacity=".35" stroke-width="14" filter="url(#soft)"/>' +
    '<path d="' + body + '" fill="none" stroke="' + INKD + '" stroke-width="16" filter="url(#rb)"/>' +
    '<path d="' + ribbon(belly, function (t) { return W(.03 + t * .9) * .34; }) + '" fill="#33473f" filter="url(#wash)"/>';
  for (var bp2 = .05; bp2 < .92; bp2 += .02) { var q3 = at(bp2, .45), q4 = at(bp2, .95); s += '<path d="M' + f(q3[0]) + ' ' + f(q3[1]) + 'Q' + f((q3[0] + q4[0]) / 2 + Math.cos(q3[2]) * 3) + ' ' + f((q3[1] + q4[1]) / 2 + Math.sin(q3[2]) * 3) + ' ' + f(q4[0]) + ' ' + f(q4[1]) + '" fill="none" stroke="#24302c" stroke-width="1.4"/>'; }
  var glit = '';
  for (var gl = 0; gl < 260; gl++) { var gt = .03 + r() * .94, gp = at(gt, r() * 1.4 - 1); glit += '<circle cx="' + f(gp[0]) + '" cy="' + f(gp[1]) + '" r="' + f(.4 + r() * 1.1) + '" fill="' + [GOLD, JADE, "#ffffff", "#c9b6ff", GOLD][(r() * 5) | 0] + '" fill-opacity="' + f(.5 + r() * .5) + '"/>'; }
  s += glit + '</g>';
  // ---- cabeza (de perfil, mirando a la izquierda) ----
  var h = '<g transform="translate(164 336) rotate(-12) scale(1.5)" filter="url(#pnt)">';
  // melena en llamas
  for (var hw = 0; hw < 14; hw++) { var ha = -2.4 + hw * .34, hl = 40 + r() * 30; h += '<path d="' + ribbon(curvePts(function (t) { var a3 = ha + Math.sin(t * 4 + hw) * .3; return [8 + Math.cos(a3) * hl * t + t * 14, -2 + Math.sin(a3) * hl * t]; }, 14), function (t) { return 7 * (1 - t) + .5; }) + '" fill="' + (hw % 3 === 1 ? "#c9a24a" : (hw % 3 ? "#1d2a26" : INKD)) + '" stroke="' + GOLD + '" stroke-opacity=".35" stroke-width=".5"/>'; }
  for (var mn = 0; mn < 0; mn++) { var ma2 = -2.3 + mn * .3, ml = 34 + r() * 26; h += '<path d="M6 -4Q' + f(6 + Math.cos(ma2) * ml * .5 + 6) + ' ' + f(-4 + Math.sin(ma2) * ml * .5) + ' ' + f(6 + Math.cos(ma2) * ml + 10) + ' ' + f(-4 + Math.sin(ma2) * ml) + 'Q' + f(6 + Math.cos(ma2 + .3) * ml * .4) + ' ' + f(-4 + Math.sin(ma2 + .3) * ml * .4) + ' 6 4Z" fill="' + (mn % 3 ? INKD : "#c9a24a") + '" stroke="' + GOLD + '" stroke-opacity=".5" stroke-width=".6"/>'; }
  // cuernos de ciervo dorados
  h += '<path d="' + ribbon(catmull([[-24, -44], [-14, -64], [4, -82], [24, -94]], 8), function (u) { return 6 - u * 4.6; }) + '" fill="url(#rh)" stroke="' + INKD + '" stroke-width=".7"/>' +
    '<path d="' + ribbon(catmull([[-8, -70], [-10, -86], [-4, -100]], 6), function (u) { return 3.4 - u * 2.6; }) + '" fill="url(#rh)" stroke="' + INKD + '" stroke-width=".6"/>' +
    '<path d="' + ribbon(catmull([[-34, -46], [-32, -64], [-22, -80], [-10, -88]], 8), function (u) { return 5 - u * 3.8; }) + '" fill="url(#rh)" stroke="' + INKD + '" stroke-width=".7" opacity=".85"/>';
  // cráneo: frente alta, ceja marcada, hocico corto con nariz bulbosa hacia arriba y fauces abiertas
  var SK = "M14 -30C6 -42 -14 -48 -26 -44C-32 -52 -46 -52 -50 -42C-56 -36 -64 -36 -70 -40C-80 -48 -94 -46 -96 -34C-98 -26 -94 -18 -88 -16L-84 -12C-72 -10 -52 -8 -38 -6C-50 -2 -66 4 -76 10C-80 14 -76 22 -66 22C-48 24 -28 26 -10 28C4 28 16 18 18 0Z";
  h += '<path d="' + SK + '" fill="#121a17" filter="url(#wash)"/><path d="' + SK + '" fill="#121a17"/><path d="' + SK + '" fill="none" stroke="#9db8ad" stroke-opacity=".55" stroke-width=".9"/>';
  h += '<path d="M-30 -40C-14 -40 0 -32 8 -20" fill="none" stroke="#4f7a6e" stroke-opacity=".55" stroke-width="7" filter="url(#soft)"/><path d="M-90 -36C-84 -42 -76 -40 -72 -34" fill="none" stroke="#4f7a6e" stroke-opacity=".5" stroke-width="5" filter="url(#soft)"/>';
  // línea de pincel que modela la cabeza: frente, puente, nariz, pómulo y mandíbula
  [[[12, -28], [-6, -40], [-26, -44]], [[-50, -42], [-60, -36], [-70, -40]], [[-70, -40], [-84, -48], [-96, -34], [-90, -18]], [[-36, -20], [-22, -14], [-4, -18], [10, -10]], [[-60, 22], [-38, 26], [-12, 28], [8, 22]], [[-40, -6], [-26, 0], [-10, 2]], [[-80, -26], [-66, -24], [-54, -22]]].forEach(function (ln, li) { s += ''; h += '<path d="' + brushPath(catmull(ln, 6), 2.4 - li * .15, li + 120) + '" fill="#a9c6ba" fill-opacity=".75"/>'; });
  // escamas de la cabeza a pincel
  var hs = ''; for (var hz = 0; hz < 22; hz++) { var hx = -60 + (hz % 8) * 9 + ((hz / 8) | 0) * 4, hy = -4 + ((hz / 8) | 0) * 9; hs += '<path d="' + brushPath(curvePts(function (u) { var aa = Math.PI * (.15 + u * .7); return [hx + Math.cos(aa) * 4, hy + Math.sin(aa) * 3]; }, 5), 1.2, hz) + '"/>'; }
  h += '<g fill="#9fbcb0" fill-opacity=".55">' + hs + '</g>';
  // aletas de las mejillas
  for (var cf = 0; cf < 5; cf++) h += '<path d="' + brushPath(curvePts(function (u) { return [-14 + cf * 6 + u * (18 + cf * 3), 10 + cf * 2 + u * (12 + cf * 3) - u * u * 8]; }, 8), 3.6, cf + 40) + '" fill="' + (cf % 2 ? INKD : "#c9a24a") + '" fill-opacity=".9"/>';
  // fauces, lengua y colmillos
  h += '<path d="M-84 -12C-72 -10 -52 -8 -38 -6C-50 -2 -66 4 -76 10C-82 4 -86 -4 -84 -12Z" fill="#3a0e0c"/><path d="' + brushPath([[-74, 4], [-62, 0], [-52, -1], [-44, -3]], 2.4, 3) + '" fill="#b0463e"/>';
  h += '<g fill="#efeadc"><path d="M-82 -12L-80 -3 -78 -11Z"/><path d="M-70 -10L-68 -4 -66 -10Z"/><path d="M-58 -8L-57 -4 -55 -8Z"/><path d="M-74 9L-72 1 -70 8Z"/><path d="M-62 4L-61 -1 -59 4Z"/></g>';
  // ceja pesada con mechones, ojo ámbar y nariz enroscada
  for (var eb = 0; eb < 6; eb++) h += '<path d="' + brushPath(curvePts(function (u) { return [-58 + eb * 5 + u * (10 + eb * 2), -44 - u * (12 + eb) + u * u * 6]; }, 8), 2, eb + 60) + '" fill="#c9a24a" fill-opacity=".85"/>';
  h += '<path d="' + brushPath([[-56, -40], [-48, -46], [-38, -44], [-30, -38]], 3.2, 5) + '" fill="' + INKD + '"/><ellipse cx="-44" cy="-33" rx="6.5" ry="4.2" fill="#ffb347"/><ellipse cx="-44" cy="-33" rx="1.8" ry="3.8" fill="#1a0a04"/><circle cx="-46" cy="-34.6" r="1.1" fill="#fff"/>' +
    '<path d="M-92 -30C-88 -36 -80 -34 -82 -28C-84 -24 -88 -26 -87 -29" fill="none" stroke="#9db8ad" stroke-width="1.2"/>';
  // barba en mechones y bigotes largos a pincel
  for (var bd = 0; bd < 6; bd++) h += '<path d="' + brushPath(curvePts(function (u) { return [-70 + bd * 7 + u * (6 - bd), 22 + u * (20 + bd * 3) + Math.sin(u * 4) * 2]; }, 10), 2.2, bd + 80) + '" fill="#c9a24a" fill-opacity=".85"/>';
  h += '<path d="' + brushPath(curvePts(function (u) { return [-94 - u * 40 + Math.sin(u * 5) * 10, -22 + u * 110 + Math.sin(u * 3) * 16]; }, 30), 2, 91) + '" fill="' + GOLD + '"/><path d="' + brushPath(curvePts(function (u) { return [-88 - u * 10 + Math.sin(u * 6) * 14, -14 + u * 120]; }, 30), 1.6, 92) + '" fill="' + GOLD + '" fill-opacity=".8"/>';
  s += h + '</g>';
  // cola: penacho en llamas
  var tl = at(1, 0);
  for (var tf = 0; tf < 7; tf++) { var ta = tl[2] + Math.PI + (tf - 3) * .3; s += '<path d="M' + f(tl[0]) + ' ' + f(tl[1]) + 'q' + f(Math.cos(ta) * 14) + ' ' + f(Math.sin(ta) * 14) + ' ' + f(Math.cos(ta + .5) * 34) + ' ' + f(Math.sin(ta + .5) * 34) + '" fill="none" stroke="' + INKD + '" stroke-width="4" stroke-linecap="round"/>'; }
  // destellos flotando
  for (var sp = 0; sp < 40; sp++) s += '<circle cx="' + f(r() * 400) + '" cy="' + f(100 + r() * 740) + '" r="' + f(.6 + r() * 1.4) + '" fill="' + (r() > .5 ? GOLD : JADE) + '" fill-opacity="' + f(.4 + r() * .5) + '"/>';
  return svg(s, 400, 860);
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "ryu") p.scene = ryuInk; });
}
