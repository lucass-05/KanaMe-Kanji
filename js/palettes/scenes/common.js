/* Utilidades comunes de las escenas ilustradas */
import { curvePts, ellipseD, ribbon } from "../scenes-v5.js";
import { seeded } from "../shapes.js";
export function patchPal(id, o) { (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === id) for (var k in o) p[k] = o[k]; }); }
// nube a pincel (kumo): lóbulos redondeados y rizos en espiral, con contorno de tinta de grosor irregular
export function brushCloud(x, y, sc, flip, fill, ink, sd) {
  var r = seeded(sd || 3), s = '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')">';
  var lobes = [[0, 0, 34], [44, -14, 40], [96, -4, 34], [136, 10, 26], [62, 22, 30], [20, 26, 24], [108, 28, 24]];
  var body = lobes.map(function (l) { return ellipseD(l[0], l[1], l[2], l[2] * .82); }).join("");
  s += '<path d="' + body + '" fill="' + fill + '"/>';
  // contorno de pincel: arcos superiores de cada lóbulo, gruesos en el centro y finos en los extremos
  lobes.forEach(function (l, i) {
    var pts = curvePts(function (t) { var a = Math.PI * (1.08 + t * .84); return [l[0] + Math.cos(a) * l[2], l[1] + Math.sin(a) * l[2] * .82]; }, 18);
    s += '<path d="' + ribbon(pts, function (t) { return 4.2 * Math.sin(Math.PI * t) + .6; }) + '" fill="' + ink + '" fill-opacity=".78"/>';
  });
  // rizos en espiral
  [[-22, 14, 12], [150, 24, 10], [70, 46, 9]].forEach(function (c) {
    var pts = curvePts(function (t) { var a = t * Math.PI * 3.2, rr = c[2] * (1 - t * .8); return [c[0] + Math.cos(a) * rr, c[1] - Math.sin(a) * rr]; }, 40);
    s += '<path d="' + ribbon(pts, function (t) { return 3.6 * (1 - t) + .5; }) + '" fill="' + ink + '" fill-opacity=".7"/>';
  });
  // base recta del kumo
  s += '<path d="' + ribbon([[-28, 36], [40, 44], [110, 44], [168, 34]], function (t) { return 3 * Math.sin(Math.PI * t) + .6; }) + '" fill="' + ink + '" fill-opacity=".6"/>';
  return s + '</g>';
}
