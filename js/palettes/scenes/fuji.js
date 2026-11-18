/* 富士 Fuji: atardecer a la acuarela y tinta */
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
// Cielo coral, gran sol pálido detrás del monte nevado, cordilleras azuladas entre la niebla,
// pagodas sobre un acantilado a la izquierda, un cerezo retorcido en flor a la derecha y el lago.
function fujiSunset() {
  var r = seeded(61), INKF = "#1c1d24";
  var s = '<defs>' +
    '<linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4574a"/><stop offset=".28" stop-color="#e2806a"/><stop offset=".55" stop-color="#efb294"/><stop offset=".75" stop-color="#f3cdb2"/><stop offset="1" stop-color="#efd9c6"/></linearGradient>' +
    '<radialGradient id="fsun" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#fbf3e2"/><stop offset=".8" stop-color="#f6e6cb"/><stop offset="1" stop-color="#f2d9b8"/></radialGradient>' +
    '<linearGradient id="fmt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4a62"/><stop offset=".5" stop-color="#5b6782"/><stop offset="1" stop-color="#8d97ad" stop-opacity=".2"/></linearGradient>' +
    '<linearGradient id="fsn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef1f6"/><stop offset="1" stop-color="#b9c2d2"/></linearGradient>' +
    '<filter id="ftx" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .2 0 0 0 0 .15 0 0 0 .22 0"/></filter>' +
    '<filter id="fw" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>' +
    '<filter id="fmist" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>';
  // cielo con textura de papel pintado
  s += '<rect width="400" height="860" fill="url(#fsky)"/><rect width="400" height="860" filter="url(#ftx)"/>';
  // sol pálido
  s += '<circle cx="204" cy="300" r="140" fill="#f8e7cf" fill-opacity=".35" filter="url(#fmist)"/><circle cx="204" cy="300" r="132" fill="url(#fsun)" filter="url(#fw)"/>';
  // el Fuji: falda azul de tinta y cumbre nevada con regueros
  var mt = 'M-40 600C30 560 100 480 150 400 164 376 172 360 178 344H236C242 360 250 376 264 400 314 480 380 556 440 590V700H-40Z';
  s += '<path d="' + mt + '" fill="url(#fmt)" filter="url(#fw)"/>';
  // nieve: casquete con dedos largos que bajan por las cárcavas
  var sn = 'M178 344H236';
  var pts = [];
  for (var i = 0; i <= 28; i++) { var t = i / 28, x = 236 + t * 70 - (1 - t) * 0, base = 344 + t * 70; }
  var edgeR = [], edgeL = [];
  for (var j = 0; j <= 30; j++) { var u = j / 30, xr = 236 + u * 84, yr = 344 + Math.pow(u, 1.25) * 110, xl = 178 - u * 84, yl = yr; edgeR.push([xr, yr]); edgeL.push([xl, yl]); }
  var bottom = [];
  for (var q = 0; q <= 34; q++) { var u2 = q / 34, x = 94 + u2 * 226, depth = (q % 2 ? 18 + r() * 26 : 70 + r() * 70) * (1 - Math.abs(u2 - .5) * .9); var yb = 454 - Math.sin(u2 * Math.PI) * 14; bottom.push([x, yb + depth]); }
  sn += 'L' + edgeR.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'L' + bottom.reverse().map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'L' + edgeL.reverse().map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'Z';
  s += '<path d="' + sn + '" fill="url(#fsn)" filter="url(#fw)"/>';
  // sombras azules en la cara derecha de la nieve y cárcavas
  for (var k = 0; k < 30; k++) { var x0 = 186 + r() * 44, len = 40 + r() * 110, ang = (x0 - 207) / 18; s += '<path d="M' + f(x0) + ' ' + f(350 + r() * 10) + 'q' + f(ang * len * .35) + ' ' + f(len * .5) + ' ' + f(ang * len * .8) + ' ' + f(len) + '" fill="none" stroke="' + (x0 > 210 ? "#7b88a3" : "#aeb8cb") + '" stroke-opacity="' + f(.3 + r() * .4) + '" stroke-width="' + f(1 + r() * 2.4) + '" stroke-linecap="round" filter="url(#fw)"/>'; }
  s += '<path d="M150 400C120 470 60 540 -40 590" fill="none" stroke="' + INKF + '" stroke-opacity=".3" stroke-width="2" filter="url(#fw)"/><path d="M264 400C300 470 360 530 440 580" fill="none" stroke="' + INKF + '" stroke-opacity=".35" stroke-width="2" filter="url(#fw)"/>';
  for (var g = 0; g < 18; g++) { var gx = 60 + r() * 300, gy = 480 + r() * 90; s += '<path d="M' + f(gx) + ' ' + f(gy) + 'l' + f((gx - 207) / 12) + ' 30" stroke="#3a4560" stroke-opacity=".35" stroke-width="1.5"/>'; }
  // cordilleras en capas con niebla
  [["#8c96ac", 560, 22, .8], ["#7b869e", 610, 26, .85], ["#66728c", 655, 30, .9], ["#4f5a73", 700, 24, .95]].forEach(function (L, i) {
    var d = 'M-20 ' + L[1];
    for (var x = -20; x <= 420; x += 20) d += 'L' + x + ' ' + f(L[1] - L[2] * (.5 + .5 * Math.sin(x / (34 + i * 9) + i * 2)) - r() * 8);
    d += 'L420 860H-20Z';
    s += '<path d="' + d + '" fill="' + L[0] + '" fill-opacity="' + L[3] + '" filter="url(#fw)"/><ellipse cx="200" cy="' + (L[1] + 22) + '" rx="340" ry="26" fill="#f1e6e0" fill-opacity=".85" filter="url(#fmist)"/>';
  });
  // lago con reflejos
  s += '<path d="M-20 760C80 750 200 752 420 758V860H-20Z" fill="#e7d3c8"/><g stroke="#f6e8de" stroke-width="2" stroke-linecap="round"><path d="M150 780H260M120 800H230M180 820H300M90 840H170"/></g>';
  s += '<g fill="' + INKF + '" filter="url(#fw)"><path d="M150 806C160 796 176 798 182 808Z"/><path d="M196 812C204 804 214 806 220 814Z"/></g>';
  // acantilado con pagodas a la izquierda
  s += '<path d="M-20 860V650C10 640 30 630 60 640 90 636 120 650 150 660 140 690 120 720 110 760 90 790 60 820 40 860Z" fill="#2b2d33" filter="url(#fw)"/>' +
    '<path d="M-10 700C20 690 50 700 70 720M0 760C30 750 50 770 70 790M90 670C100 700 96 730 80 760" fill="none" stroke="#5a5e6a" stroke-width="2" filter="url(#fw)"/>';
  function tier(x, y, w) { return '<path d="M' + (x - w) + ' ' + y + 'Q' + x + ' ' + (y - 8) + ' ' + (x + w) + ' ' + y + 'L' + (x + w * .6) + ' ' + (y - 9) + 'H' + (x - w * .6) + 'Z" fill="' + INKF + '"/><rect x="' + f(x - w * .5) + '" y="' + y + '" width="' + f(w) + '" height="9" fill="#3a3b42"/><path d="M' + f(x - w * .45) + ' ' + (y + 4) + 'H' + f(x + w * .45) + '" stroke="#c98a5a" stroke-width="1" stroke-dasharray="2 2"/>'; }
  [[56, 642, 36], [122, 650, 30]].forEach(function (p) { var o = ''; for (var t2 = 0; t2 < 3; t2++) o += tier(p[0], p[1] - t2 * 18, p[2] - t2 * 5); s += '<g filter="url(#fw)">' + o + '<path d="M' + p[0] + ' ' + (p[1] - 44) + 'V' + (p[1] - 66) + '" stroke="' + INKF + '" stroke-width="2"/></g>'; });
  for (var tr = 0; tr < 6; tr++) s += '<ellipse cx="' + f(10 + tr * 26 + r() * 10) + '" cy="' + f(672 + r() * 20) + '" rx="' + f(10 + r() * 8) + '" ry="' + f(6 + r() * 4) + '" fill="#23262c" filter="url(#fw)"/>';
  // cerezo retorcido a la derecha, con flores coral
  var trunk = 'M420 860C400 800 380 760 386 700 392 650 370 610 340 590 320 576 300 560 296 540 320 556 344 566 360 580 372 560 384 520 380 480 376 440 352 410 330 396 356 400 380 420 392 450 404 420 412 400 420 390V860Z';
  s += '<path d="' + trunk + '" fill="' + INKF + '" filter="url(#fw)"/>';
  var br = '';
  [[340, 590, 270, 640], [296, 540, 230, 520], [330, 396, 280, 360], [380, 480, 300, 470], [386, 700, 300, 720], [360, 580, 300, 600], [392, 450, 330, 430]].forEach(function (b) { br += '<path d="M' + b[0] + ' ' + b[1] + 'Q' + ((b[0] + b[2]) / 2) + ' ' + (Math.min(b[1], b[3]) - 14) + ' ' + b[2] + ' ' + b[3] + '" fill="none" stroke="' + INKF + '" stroke-width="' + f(3 + r() * 2) + '" stroke-linecap="round"/>'; });
  s += '<g filter="url(#fw)">' + br + '</g>';
  var bl = '';
  [[250, 520, 54], [262, 640, 50], [290, 360, 56], [320, 470, 48], [296, 720, 44], [330, 600, 40], [360, 420, 38], [396, 330, 40], [230, 470, 30]].forEach(function (c) {
    for (var tw = 0; tw < 5; tw++) { var ta = r() * Math.PI * 2; bl += '<path d="M' + f(c[0]) + ' ' + f(c[1]) + 'l' + f(Math.cos(ta) * c[2] * .8) + ' ' + f(Math.sin(ta) * c[2] * .4) + '" stroke="#1c1d24" stroke-width="1.1"/>'; }
    for (var i = 0; i < 220; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()) * c[2]; bl += '<circle cx="' + f(c[0] + Math.cos(a) * d) + '" cy="' + f(c[1] + Math.sin(a) * d * .55) + '" r="' + f(.7 + r() * 1.6) + '" fill="' + ["#e8503a", "#f26d55", "#f49a86", "#d93a2a", "#f7b5a5"][(r() * 5) | 0] + '" fill-opacity="' + f(.6 + r() * .4) + '"/>'; }
  });
  s += bl;
  // rocas de la orilla
  s += '<path d="M260 860L280 830 300 836 320 812 350 820 370 800 420 790V860Z" fill="' + INKF + '" filter="url(#fw)"/>';
  return svg(s, 400, 860);
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "fujisan") p.scene = null; });
  patchPal("fujisan", {
    fujiScene: false, scene: fujiSunset, amb: [{ kind: "fall", shape: "petal", colors: ["#f26d55", "#f49a86", "#e8503a"], n: 8, size: [7, 11], dur: [14, 22], o: 0.75 }],
    bg: "#f1d2bf", surface: "#fbf1e8", raised: "#f3ddd0", hairline: "#e2b9a4",
    text: "#26222a", muted: "#6a5458", faint: "#a1878a", accent: "#c8442f", status: "#b23b28",
    grad: "linear-gradient(180deg, #d4574a 0%, #efb294 55%, #efd9c6 100%)", glow: "rgba(200,68,47,.16)",
    pantone: "Inspirada en PANTONE Living Coral 16-1546 (atardecer), Peach Fuzz 13-1023 (sol) y Blue Fusion 19-4118 (montes)"
  });
}
