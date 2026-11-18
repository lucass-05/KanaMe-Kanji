/* 花火 Hanabi: fuegos artificiales ante el torii de Miyajima */
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
// Fondo fijo (noche, torii en el agua, público a contraluz, cascada dorada) y fuegos animados en bucle.
function fwSVG(type, cols, sd) {
  var r = seeded(sd), s = '<defs><radialGradient id="fg"><stop offset="0" stop-color="' + cols[0] + '" stop-opacity=".55"/><stop offset=".5" stop-color="' + cols[0] + '" stop-opacity=".12"/><stop offset="1" stop-color="' + cols[0] + '" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="url(#fg)"/>';
  var n = type === "peony" ? 48 : 64;
  for (var k = 0; k < n; k++) {
    var a = k / n * Math.PI * 2 + r() * .05, c = cols[1 + (k % (cols.length - 1))], L = 82 + r() * 12;
    if (type === "willow") {
      var ex = 100 + Math.cos(a) * L * .8, ey = 100 + Math.sin(a) * L * .55;
      s += '<path d="M100 100Q' + f(100 + Math.cos(a) * L * .7) + ' ' + f(100 + Math.sin(a) * L * .5 - 20) + ' ' + f(ex) + ' ' + f(ey + 40) + '" fill="none" stroke="' + c + '" stroke-opacity=".75" stroke-width="1.3" stroke-dasharray="2 3"/>';
    } else if (type === "peony") {
      for (var j = 0; j < 4; j++) { var t = .4 + j * .2; s += '<circle cx="' + f(100 + Math.cos(a) * L * t) + '" cy="' + f(100 + Math.sin(a) * L * t + t * t * 6) + '" r="' + f(1 + j * .7) + '" fill="' + c + '"/>'; }
    } else {
      s += '<path d="M' + f(100 + Math.cos(a) * 12) + ' ' + f(100 + Math.sin(a) * 12) + 'L' + f(100 + Math.cos(a) * L) + ' ' + f(100 + Math.sin(a) * L + 6) + '" stroke="' + c + '" stroke-opacity=".85" stroke-width="1.4" stroke-linecap="round"/>' +
        '<circle cx="' + f(100 + Math.cos(a) * L) + '" cy="' + f(100 + Math.sin(a) * L + 6) + '" r="2" fill="#ffffff"/>';
    }
  }
  s += '<circle cx="100" cy="100" r="14" fill="' + cols[0] + '" fill-opacity=".9"/><circle cx="100" cy="100" r="6" fill="#fff"/>';
  if (type === "chry") for (var q = 0; q < 24; q++) { var b = q / 24 * Math.PI * 2; s += '<path d="M100 100L' + f(100 + Math.cos(b) * 26) + ' ' + f(100 + Math.sin(b) * 26) + '" stroke="' + cols[0] + '" stroke-width="2" stroke-linecap="round"/>'; }
  return svg(s, 200, 200);
}
function hanabiNight() {
  var r = seeded(91), s = '<defs><linearGradient id="hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061a"/><stop offset=".55" stop-color="#14102e"/><stop offset=".78" stop-color="#3a1e2a"/><stop offset=".84" stop-color="#5a3420"/><stop offset="1" stop-color="#0a0710"/></linearGradient>' +
    '<radialGradient id="hgold" cx=".5" cy="1"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset=".5" stop-color="#ff9a3c" stop-opacity=".35"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>' +
    '<filter id="hb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>';
  s += '<rect width="400" height="860" fill="url(#hn)"/>';
  // cascada dorada (niagara) a ras del agua, detrás del torii
  s += '<ellipse cx="200" cy="700" rx="230" ry="150" fill="url(#hgold)"/>';
  var wf = '';
  for (var k = 0; k < 150; k++) { var x0 = 10 + r() * 380, y0 = 560 + r() * 60, L = 50 + r() * 80, dx = (x0 - 200) * .12; wf += '<path d="M' + f(x0) + ' ' + f(y0) + 'q' + f(dx) + ' ' + f(L * .4) + ' ' + f(dx * 1.6) + ' ' + f(L) + '" fill="none" stroke="' + ["#ffe2a0", "#ffc46a", "#fff3d0", "#ff9a4a"][(r() * 4) | 0] + '" stroke-opacity="' + f(.35 + r() * .5) + '" stroke-width="' + f(.6 + r() * 1.2) + '" stroke-dasharray="' + f(2 + r() * 4) + ' ' + f(2 + r() * 3) + '"/>'; }
  s += '<g>' + wf + '</g>';
  // luces lejanas en la orilla
  for (var l = 0; l < 40; l++) s += '<circle cx="' + f(r() * 400) + '" cy="' + f(690 + r() * 8) + '" r="' + f(.6 + r()) + '" fill="#ffd9a0" fill-opacity="' + f(.4 + r() * .5) + '"/>';
  // agua con reflejos dorados
  s += '<rect y="700" width="400" height="160" fill="#0b0714" fill-opacity=".7"/>';
  for (var w = 0; w < 60; w++) { var wx = 40 + r() * 320, wy = 704 + r() * 110, ww = 6 + r() * 30; s += '<rect x="' + f(wx) + '" y="' + f(wy) + '" width="' + f(ww) + '" height="1.6" rx=".8" fill="' + (r() > .3 ? "#ffc46a" : "#ff8fb1") + '" fill-opacity="' + f(.25 + r() * .5) + '"/>'; }
  // torii en el agua (Itsukushima)
  s += '<g fill="#1a0c0c"><rect x="150" y="600" width="10" height="112"/><rect x="240" y="600" width="10" height="112"/><rect x="136" y="618" width="128" height="7"/>' +
    '<path d="M122 596Q200 588 278 596L284 586Q200 578 116 586Z"/><rect x="126" y="596" width="148" height="7"/><rect x="196" y="603" width="8" height="16"/></g>' +
    '<g fill="#c8372f" fill-opacity=".55"><rect x="152" y="626" width="6" height="84"/><rect x="242" y="626" width="6" height="84"/></g>';
  // público a contraluz con móviles en alto
  var crowd = '';
  for (var p = 0; p < 34; p++) {
    var px = -10 + p * 13 + r() * 6, ph = 46 + r() * 26, py = 860, sc = .8 + r() * .5;
    crowd += '<g transform="translate(' + f(px) + ' ' + py + ') scale(' + f(sc) + ')"><circle cx="0" cy="' + f(-ph) + '" r="7"/><path d="M-11 ' + f(-ph + 8) + 'Q0 ' + f(-ph + 2) + ' 11 ' + f(-ph + 8) + 'L13 0H-13Z"/>';
    if (r() > .72) crowd += '<path d="M6 ' + f(-ph + 10) + 'L14 ' + f(-ph - 14) + '" stroke="#040308" stroke-width="3.4" stroke-linecap="round"/><rect x="11" y="' + f(-ph - 24) + '" width="7" height="11" rx="1.4" fill="#cfe4ff" fill-opacity=".9"/>';
    crowd += '</g>';
  }
  s += '<g fill="#040308">' + crowd + '</g>';
  return svg(s, 400, 860);
}
var FW_SET = [
  ["chry", ["#c9f07a", "#ffcf6a", "#fff3d0", "#ff8a4a"]], ["chry", ["#ff6a9a", "#8ab4ff", "#6a7cff", "#ffffff"]], ["peony", ["#ffd27a", "#fff3d0", "#ffc46a"]],
  ["willow", ["#ffd27a", "#ffe2a0", "#ffb84a"]], ["chry", ["#7fe0ff", "#4a7cff", "#c9b2ff", "#ffffff"]], ["peony", ["#ff8fb1", "#ffb3cf", "#ff6a9a"]], ["chry", ["#ffe2a0", "#ffb84a", "#fff3d0"]]
];
var FW_POS = [[18, 16, 46, 7, 0], [64, 12, 54, 8.5, -2.2], [42, 30, 50, 7.5, -4.6], [82, 32, 40, 9, -1.1], [10, 40, 38, 8, -5.8], [56, 44, 44, 6.5, -3.3], [30, 8, 36, 9.5, -6.7], [76, 22, 34, 7, -0.6], [50, 22, 62, 10, -7.9], [90, 10, 30, 8, -3.9], [24, 52, 34, 7, -2.8], [70, 54, 38, 8.5, -6.1]];
function hanabiFx(d, node) {
  d.appendChild(node("topshade"));
  FW_POS.forEach(function (p, i) { var t = FW_SET[i % FW_SET.length]; d.appendChild(node("fw", "left:" + p[0] + "%;top:" + p[1] + "%;width:" + p[2] + "vmin;height:" + p[2] + "vmin;animation-duration:" + p[3] + "s;animation-delay:" + p[4] + "s;background-image:" + fwSVG(t[0], t[1], i + 3))); });
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "hanabi") { p.scene = hanabiNight; p.fx = hanabiFx; p.amb = [{ kind: "rise", shape: "dot", colors: ["#ffd27a", "#ffffff", "#ff8fb1"], n: 12, size: [2, 4], dur: [5, 9], o: 0.8 }]; } });
  patchPal("hanabi", { pantone: "Inspirada en PANTONE Classic Blue 19-4052 (noche), Mimosa 14-0848 (cascada dorada) y Pink Yarrow 17-2034 (peonías)" });
}
