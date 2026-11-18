/* Medallas: una pieza de orfebrería por paleta (window.KANAME_MEDAL) */
import { svg } from "./shapes.js";
//       Metal con relieve iluminado y grano, campo esmaltado y detalles en relieve. Cada una con su material.
export function star(n, ro, ri, cx, cy, rot) {
  var p = [];
  for (var i = 0; i < n * 2; i++) { var r = i % 2 ? ri : ro, a = Math.PI * i / n - Math.PI / 2 + (rot || 0); p.push((cx + r * Math.cos(a)).toFixed(2) + " " + (cy + r * Math.sin(a)).toFixed(2)); }
  return "M" + p.join("L") + "Z";
}
export function f(n) { return (+n).toFixed(2); }
export function arcPt(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
var BIG_PETAL = "M32 32C24 28 21.4 18.6 24.8 11.4 26.7 7.9 29.3 6.6 30.1 6.1L32 9.6 33.9 6.1C34.7 6.6 37.3 7.9 39.2 11.4 42.6 18.6 40 28 32 32Z";
export var METAL = {
  gold:     ["#fff6d2", "#f0cd6e", "#c5932f", "#8a611a", "#e9c463", "#5e400d"],
  silver:   ["#ffffff", "#e3e6ea", "#a9afb8", "#6e747e", "#d5d9df", "#454a52"],
  platinum: ["#ffffff", "#eef0f2", "#c4c9cf", "#8d939b", "#e6e9ec", "#5f656d"],
  rose:     ["#fff0ea", "#f0bfb2", "#c4877a", "#8a5248", "#e8b0a2", "#5a3029"],
  bronze:   ["#f6e3bc", "#d4a867", "#9c6a33", "#62401b", "#c99a5b", "#3e2810"],
  copper:   ["#ffe0cc", "#eea47a", "#bb6439", "#7a3518", "#e08a5a", "#4a1d0a"],
  gun:      ["#d8dbe0", "#8a8f98", "#4c5058", "#25272c", "#777c85", "#121315"],
  blued:    ["#e6ecff", "#98a6cc", "#56628e", "#262e52", "#8592bd", "#11152b"],
  lilac:    ["#fbf7ff", "#e2d8f0", "#b3a6c9", "#7a6d93", "#d3c8e4", "#4c4263"],
  aqua:     ["#f2fffd", "#cfe9e6", "#94b9b5", "#5a7f7b", "#bfdcd8", "#34524f"],
  amber:    ["#fff2cf", "#f6c862", "#d18f1e", "#91580a", "#efb54a", "#5c3604"],
  lacquer:  ["#8a8f99", "#3a3d45", "#18191d", "#08090b", "#4a4e57", "#000000"],
  ice:      ["#ffffff", "#f1f8fd", "#c3dcec", "#8fb2cb", "#e3f0f9", "#5f86a3"],
  pearl:    ["#ffffff", "#fbf8f3", "#e2dcd3", "#b3aca3", "#f3eee7", "#857d74"],
  jade:     ["#f6fff4", "#d6efd0", "#a2cf9e", "#6a9f6c", "#c6e6c2", "#447049"]
};
function grad(id, c) {
  return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".22" stop-color="' + c[1] + '"/><stop offset=".45" stop-color="' + c[2] + '"/>' +
    '<stop offset=".62" stop-color="' + c[3] + '"/><stop offset=".8" stop-color="' + c[4] + '"/><stop offset="1" stop-color="' + c[5] + '"/></linearGradient>';
}
// Relieve: luz difusa + brillo especular desde arriba a la izquierda, grano del material y sombra proyectada
function bevel(id, blur, scale, opts) {
  opts = opts || {};
  var s = '<filter id="' + id + '" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">' +
    '<feGaussianBlur in="SourceAlpha" stdDeviation="' + blur + '" result="b"/>' +
    '<feDiffuseLighting in="b" surfaceScale="' + scale + '" diffuseConstant="1.18" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>' +
    '<feSpecularLighting in="b" surfaceScale="' + scale + '" specularConstant="' + (opts.spec || 1.25) + '" specularExponent="' + (opts.exp || 24) + '" lighting-color="#fff" result="s"><feDistantLight azimuth="235" elevation="36"/></feSpecularLighting>' +
    '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.3" result="lit"/>';
  var last = "lit";
  if (opts.grain) {
    s += '<feTurbulence type="fractalNoise" baseFrequency="' + opts.grain + '" numOctaves="2" seed="7" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1" result="ng"/>' +
      '<feComposite in="lit" in2="ng" operator="arithmetic" k1=".42" k2=".8" result="lg"/>';
    last = "lg";
  }
  if (opts.marble) { // vetas de mármol
    s += '<feTurbulence type="turbulence" baseFrequency=".045 .11" numOctaves="4" seed="11" result="t"/>' +
      '<feColorMatrix in="t" type="matrix" values="0 0 0 0 .5 0 0 0 0 .52 0 0 0 0 .58 -9 0 0 0 1.35" result="v"/>' +
      '<feGaussianBlur in="v" stdDeviation=".25" result="vb"/>' +
      '<feComposite in="vb" in2="SourceAlpha" operator="in" result="vc"/>' +
      '<feComposite in="vc" in2="' + last + '" operator="over" result="mv"/>';
    last = "mv";
  }
  s += '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
    '<feComposite in="' + last + '" in2="s2" operator="arithmetic" k2="1" k3=".85" result="o"/>' +
    '<feComposite in="o" in2="SourceAlpha" operator="in" result="o2"/>';
  if (opts.shadow) s += '<feGaussianBlur in="SourceAlpha" stdDeviation="' + opts.shadow + '"/><feOffset dx="' + (opts.shadow * .9) + '" dy="' + (opts.shadow * 1.3) + '" result="sh0"/>' +
    '<feFlood flood-color="#000" flood-opacity=".55"/><feComposite in2="sh0" operator="in" result="sh"/><feMerge><feMergeNode in="sh"/><feMergeNode in="o2"/></feMerge>';
  return s + '</filter>';
}
// ---- Siluetas ----
var SHIRO_D = "M18 15H27.2L29.6 2.6 38.6 4.6 34.6 15H46a4 4 0 0 1 4 4V57a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V19a4 4 0 0 1 4-4ZM21.5 22.5V34H42.5V22.5ZM21.5 41.5V53.5H42.5V41.5Z";
function fanPath(cx, cy, R, r, a0, a1) {
  var p1 = arcPt(cx, cy, R, a0), p2 = arcPt(cx, cy, R, a1), p3 = arcPt(cx, cy, r, a1), p4 = arcPt(cx, cy, r, a0);
  return "M" + f(p1[0]) + " " + f(p1[1]) + "A" + R + " " + R + " 0 0 1 " + f(p2[0]) + " " + f(p2[1]) + "L" + f(p3[0]) + " " + f(p3[1]) + "A" + r + " " + r + " 0 0 0 " + f(p4[0]) + " " + f(p4[1]) + "Z";
}
var AI_D;
var AI_FIELD;
var AI_EM;
var AI_ENAMEL;
// Monte con sol (山吹)
var YAMA_D = "M41 6.5a11 11 0 1 1 0 22a11 11 0 1 1 0-22ZM3 56.5L23.5 19.5 30 28.5 35 22.5 61 56.5Z";
var YAMA_FIELD = "M41 9.8a7.7 7.7 0 1 1 0 15.4a7.7 7.7 0 1 1 0-15.4ZM10 53L23.5 28.5 29.6 37 35 30.5 54 53Z";
// Racimo de glicinia (藤)
var FUJI_BEADS = [[20, 15, 6.4], [32, 13.5, 6.6], [44, 15, 6.4], [26, 24.5, 6], [38, 24.5, 6], [32, 33.5, 5.6], [26.5, 41.5, 4.8], [37.5, 41.5, 4.8], [32, 49, 4.2], [32, 56.5, 3.2]];
function beads(scale, dx) { return FUJI_BEADS.map(function (b) { var rx = b[2] * scale, ry = b[2] * .78 * scale; return "M" + f(b[0] - rx + (dx || 0)) + " " + f(b[1]) + "a" + f(rx) + " " + f(ry) + " 0 1 0 " + f(rx * 2) + " 0a" + f(rx) + " " + f(ry) + " 0 1 0 " + f(-rx * 2) + " 0Z"; }).join(""); }
var FUJI_D;
var UMI_D;
var UMI_EM;
var MOMIJI_D = "M32 2.7L36.3 17.3 48 10.7 44.3 24 60 22.7 49.3 33.3 54.7 37.3 37.3 38.7 34.7 45.3 33.6 61.3H30.4L29.3 45.3 26.7 38.7 9.3 37.3 14.7 33.3 4 22.7 19.7 24 16 10.7 27.7 17.3Z";
// Luna creciente con estrella (夜)
var YORU_D = "M39 5A27 27 0 1 0 58 45 21.5 21.5 0 1 1 39 5Z";
// Koban, moneda de oro ovalada (金)
var KIN_D = "M32 2.5C46 2.5 54 15 54 32S46 61.5 32 61.5 10 49 10 32 18 2.5 32 2.5Z";
var KIN_FIELD = "M32 7.5C43 7.5 49.5 18 49.5 32S43 56.5 32 56.5 14.5 46 14.5 32 21 7.5 32 7.5Z";
var KIN_EM;
// ---- Medallas nuevas ----
var YAMABUKI_PETAL = "M32 32C24.5 27.5 21.5 18 25 11.5 27 7.5 37 7.5 39 11.5 42.5 18 39.5 27.5 32 32Z";
var EDO_D = "M15 34C15 20 23 13 32 13S49 20 49 34ZM13 33.5H51L49 37.5H15ZM10 38.5H54L57 45H7ZM8 46.5H56L59.5 53H4.5ZM6 54.5H58L61.5 61H2.5ZM8 38L2.5 30.5 12 33.5ZM56 38L61.5 30.5 52 33.5Z";
var EDO_FIELD = "M12.5 40H51.5L53.6 43.6H10.4ZM10.6 48H53.4L55.6 51.6H8.4ZM8.6 56H55.4L57.6 59.6H6.4Z";
var FUJISAN_D = "M2 58C12 53 21 41 26.5 21.5L29.5 19.5 32 21 34.5 19.5 37.5 21.5C43 41 52 53 62 58Z";
var FUJISAN_FIELD = "M26.5 21.5L29.5 19.5 32 21 34.5 19.5 37.5 21.5C38.6 25.5 39.8 29 41 32L38 30.2 35.5 33.6 32 30 28.5 33.6 26 30.2 23 32C24.2 29 25.4 25.5 26.5 21.5Z";
export function rectAt(x, y, ang, len, w) {
  var c = Math.cos(ang), s = Math.sin(ang), nx = -s * w / 2, ny = c * w / 2, x2 = x + c * len, y2 = y + s * len;
  return "M" + f(x + nx) + " " + f(y + ny) + "L" + f(x2 + nx) + " " + f(y2 + ny) + "L" + f(x2 - nx) + " " + f(y2 - ny) + "L" + f(x - nx) + " " + f(y - ny) + "Z";
}
var YUKI_D;
var YUKI_FIELD;
var WAVE_D = "M2 60C4 46 12 32 24 24 32 18 44 14 52 17 58 19 60 25 57 29 54 32 49 31 48 27 46 24 41 24 37 28 31 34 30 46 36 54 40 58 48 60 62 60Z" +
  "M24.5 24.2L21 17.5 28 21ZM30.5 20.4L29 13.5 34.5 18.2ZM37.2 17.4L37.4 10.6 41.4 16.2ZM44.2 15.6L46.6 9.4 48.6 15.6ZM50.6 16.2L55 11.2 55.2 17.6ZM56.6 22L62 20.6 59 25.2Z";
// ---- Medallas v4 ----
var KOI_D = "M32 4C38 4 42 10 42.5 18 43 26 40 36 36 44L35 47C38 50 43 54 46 61 41 59 36 56 32 52 28 56 23 59 18 61 21 54 26 50 29 47L28 44C24 36 21 26 21.5 18 22 10 26 4 32 4ZM22.5 20C17 20 12 24 10 30 15 28 19 27 23 26ZM41.5 20C47 20 52 24 54 30 49 28 45 27 41 26Z";
var KOI_FIELD = "M32 7.5C36.5 7.5 39.6 12.5 39.8 18.5 40.2 25.5 37.6 34 34.2 41.5H29.8C26.4 34 23.8 25.5 24.2 18.5 24.4 12.5 27.5 7.5 32 7.5Z";
var HASU_D = "M32 42C20 42 10 36 6 26 16 28 26 32 32 42ZM32 42C44 42 54 36 58 26 48 28 38 32 32 42ZM32 40C22 36 16 26 16 14 24 20 29 28 32 40ZM32 40C42 36 48 26 48 14 40 20 35 28 32 40ZM32 6C38 15 39 28 32 41 25 28 26 15 32 6ZM5 50C5 44.5 17 41 32 41S59 44.5 59 50 47 59 32 59 5 55.5 5 50Z";
var TAKE_D = "M32 3C36 10 44 24 48 38 51 48 48 58 40 61H24C16 58 13 48 16 38 20 24 28 10 32 3Z";
var TAKE_FIELD = "M32 9C35 15 41 26 44.5 38 47 47 44.5 54.5 38.5 57H25.5C19.5 54.5 17 47 19.5 38 23 26 29 15 32 9Z";
export var MEDALS;
// Fondos: las siluetas de las medallas en relieve, repartidas de forma discreta (luz arriba a la izquierda)
var RELIEF_SPOTS = [[38, 40, .62, -14], [168, 26, .42, 18], [112, 118, .5, 6], [214, 140, .36, -28], [30, 188, .44, 24], [150, 214, .56, -8], [80, 252, .34, 40], [228, 262, .46, 12]];
function reliefTile(d, c, inner) {
  var s = "";
  RELIEF_SPOTS.forEach(function (p) {
    var g = function (dx, dy, col) { return '<g transform="translate(' + (p[0] + dx) + ' ' + (p[1] + dy) + ') rotate(' + p[3] + ') scale(' + p[2] + ') translate(-32 -32)">' + (d.charAt(0) === "<" ? '<g fill="' + col + '">' + d + '</g>' : '<path d="' + d + '" fill="' + col + '"/>') + (inner ? '<path d="' + inner + '" fill="none" stroke-width="2.2" stroke="' + col + '"/>' : "") + '</g>'; };
    s += g(1.3, 1.7, c.lo) + g(-.9, -.9, c.hi) + g(0, 0, c.base);
  });
  return svg(s, 260, 300);
}

export function init() {
  // Abanico (藍): varillas en relieve y olas 青海波 en el esmalte
  AI_D = fanPath(32, 46, 30, 6, 192, 348) + "M28.5 44L32 61 35.5 44Z";
  AI_FIELD = fanPath(32, 46, 26.5, 9, 196, 344);
  AI_EM = (function () {
    var s = '<g fill="none" stroke-width="1.1">';
    for (var i = 0; i <= 8; i++) { var a = 196 + i * 148 / 8, p = arcPt(32, 46, 9, a), q = arcPt(32, 46, 26.5, a); s += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(q[0]) + ' ' + f(q[1]) + '"/>'; }
    return s + '</g><circle cx="32" cy="46" r="3.4"/>';
  })();
  AI_ENAMEL = (function () { // olas en el esmalte
    var s = '<g fill="none" stroke="#9fc0ff" stroke-opacity=".35" stroke-width=".7">';
    for (var y = 20; y < 50; y += 5) for (var x = (y / 5) % 2 ? 0 : 5; x < 64; x += 10) s += '<path d="M' + (x - 5) + ' ' + y + 'a5 5 0 0 1 10 0M' + (x - 2.5) + ' ' + y + 'a2.5 2.5 0 0 1 5 0"/>';
    return s + '</g>';
  })();
  FUJI_D = beads(1) + "M30.6 1.5h2.8v8h-2.8Z" + "M33 4c6-5 14-3 17 1-6 3-12 3-17-1Z";
  // Concha (海)
  UMI_D = (function () {
    var cx = 32, cy = 52, R = 30, n = 9, a0 = 205, a1 = 335, s = "";
    for (var i = 0; i < n; i++) {
      var aa = a0 + (a1 - a0) * i / n, ab = a0 + (a1 - a0) * (i + 1) / n, p = arcPt(cx, cy, R, aa), q = arcPt(cx, cy, R, ab);
      if (!i) s += "M" + f(p[0]) + " " + f(p[1]);
      var m = arcPt(cx, cy, R + 3.2, (aa + ab) / 2);
      s += "Q" + f(m[0]) + " " + f(m[1]) + " " + f(q[0]) + " " + f(q[1]);
    }
    return s + "L37.5 53 43 50.5 41.5 59.5H22.5L21 50.5 26.5 53Z";
  })();
  UMI_EM = (function () {
    var s = '<g fill="none" stroke-width="1.6" stroke-linecap="round">';
    for (var i = 0; i <= 9; i++) { var a = 205 + 130 * i / 9, p = arcPt(32, 52, 3, a), q = arcPt(32, 52, 27.5, a); s += '<path d="M' + f(p[0]) + ' ' + f(p[1]) + 'L' + f(q[0]) + ' ' + f(q[1]) + '"/>'; }
    return s + '</g><path d="M22 52.5H42" fill="none" stroke-width="1.2"/>';
  })();
  KIN_EM = (function () {
    var s = '<g fill="none" stroke-width=".8">';
    for (var y = 12; y <= 52; y += 2.6) { var w = 17.5 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 32) / 24.5, 2))); s += '<path d="M' + f(32 - w) + ' ' + f(y) + 'H' + f(32 + w) + '" stroke-opacity=".6"/>'; }
    s += '</g>';
    // sellos: flor de paulownia arriba y abajo, cartela central
    [[32, 14], [32, 50]].forEach(function (c) { s += '<g transform="translate(' + c[0] + ' ' + c[1] + ')"><ellipse cx="0" cy="0" rx="5" ry="4"/><path d="M-3 -1.5v-3M0 -1.8v-4M3 -1.5v-3" stroke-width="1.6" stroke-linecap="round" fill="none"/></g>'; });
    s += '<rect x="25" y="23" width="14" height="18" rx="2" fill="none" stroke-width="1.6"/><path d="M28 27h8M32 25v14M28.5 31.5h7M28 36h8M29.5 33.5l-1.5 3M34.5 33.5l1.5 3" fill="none" stroke-width="1.3" stroke-linecap="round"/>';
    for (var k = 0; k < 40; k++) { var a = k / 40 * Math.PI * 2; s += '<circle cx="' + f(32 + 19.6 * Math.cos(a)) + '" cy="' + f(32 + 27 * Math.sin(a)) + '" r=".75"/>'; }
    return s;
  })();
  YUKI_D = (function () {
    var s = "";
    for (var k = 0; k < 6; k++) {
      var a = k * Math.PI / 3 - Math.PI / 2;
      s += rectAt(32, 32, a, 27, 4.4);
      [[11, 8.5], [18.5, 6.5]].forEach(function (b) {
        var bx = 32 + Math.cos(a) * b[0], by = 32 + Math.sin(a) * b[0];
        s += rectAt(bx, by, a - Math.PI / 3, b[1], 3.2) + rectAt(bx, by, a + Math.PI / 3, b[1], 3.2);
      });
      var tx = 32 + Math.cos(a) * 28.5, ty = 32 + Math.sin(a) * 28.5;
      s += "M" + f(tx + Math.cos(a) * 3) + " " + f(ty + Math.sin(a) * 3) + "L" + f(tx + Math.cos(a + 1.57) * 2.6) + " " + f(ty + Math.sin(a + 1.57) * 2.6) + "L" + f(tx - Math.cos(a) * 3) + " " + f(ty - Math.sin(a) * 3) + "L" + f(tx - Math.cos(a + 1.57) * 2.6) + " " + f(ty - Math.sin(a + 1.57) * 2.6) + "Z";
    }
    var h = ""; for (var j = 0; j < 6; j++) { var p = arcPt(32, 32, 9, j * 60 - 90); h += (j ? "L" : "M") + f(p[0]) + " " + f(p[1]); }
    return s + h + "Z";
  })();
  YUKI_FIELD = (function () { var h = ""; for (var j = 0; j < 6; j++) { var p = arcPt(32, 32, 6.6, j * 60 - 90); h += (j ? "L" : "M") + f(p[0]) + " " + f(p[1]); } return h + "Z"; })();
  MEDALS = {
    sumi: { metal: "gun", shape: "M32 3C32 3 10 28 10 40.5a22 22 0 0 0 44 0C54 28 32 3 32 3Z", field: .76, fieldDy: 3, enamel: "#141417",
      em: '<circle cx="32" cy="41" r="4"/><g fill="none" stroke-width="1.5"><circle cx="32" cy="41" r="8.5"/><circle cx="32" cy="41" r="13"/></g>' },
    shiro: { metal: "platinum", marble: true, noField: true, evenodd: true, shape: SHIRO_D,
      em: '<path d="M17.2 19.5a2.3 2.3 0 0 1 2.3-2.3h25a2.3 2.3 0 0 1 2.3 2.3" fill="none" stroke-width=".9"/>', gems: [[17.6, 18.6, 1.6], [46.4, 18.6, 1.6], [17.6, 57.4, 1.6], [46.4, 57.4, 1.6], [32, 37.75, 2]] },
    sakura: { metal: "rose", petals: true, field: .74, enamel: "#f29bb6",
      em: '<g fill="none" stroke-width="1.1" stroke-linecap="round"><path d="M32 27V16M36.8 30.5l10.4-3.4M35 36l6.4 8.9M29 36l-6.4 8.9M27.2 30.5l-10.4-3.4"/></g><circle cx="32" cy="32" r="4.6"/>' +
        '<g><circle cx="32" cy="15.5" r="1.5"/><circle cx="47.7" cy="27" r="1.5"/><circle cx="41.7" cy="45.3" r="1.5"/><circle cx="22.3" cy="45.3" r="1.5"/><circle cx="16.3" cy="27" r="1.5"/></g>' },
    matcha: { metal: "bronze", shape: "M32 2C47 12 54 29 47.5 44.5 44 52 38 56.5 33.5 58L34 62.5H30L30.5 58C26 56.5 20 52 16.5 44.5 10 29 17 12 32 2Z", field: .74, fieldDy: -1, enamel: "#7fae3e",
      em: '<path d="M32 9V60" fill="none" stroke-width="2"/><path d="M32 20l-7-5M32 20l7-5M32 29l-9-6M32 29l9-6M32 38l-8.5-5.5M32 38l8.5-5.5M32 47l-6-4M32 47l6-4" fill="none" stroke-width="1.3" stroke-linecap="round"/>' },
    ai: { metal: "silver", shape: AI_D, fieldPath: AI_FIELD, enamel: "#1d3b8c", enamelExtra: AI_ENAMEL, em: AI_EM },
    yamabuki: { metal: "amber", petals: true, petal: YAMABUKI_PETAL, field: .72, enamel: "#f2a91f",
      em: (function () { var t = '<circle cx="32" cy="32" r="4.4"/><g fill="none" stroke-width=".9" stroke-linecap="round">'; for (var k = 0; k < 10; k++) { var p = arcPt(32, 32, 10.5, k * 36 - 90); t += '<path d="M32 32L' + f(p[0]) + ' ' + f(p[1]) + '"/>'; } t += '</g>'; for (var j = 0; j < 10; j++) { var q = arcPt(32, 32, 11.3, j * 36 - 90); t += '<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="1.1"/>'; } return t; })() },
    koi: { metal: "pearl", shape: KOI_D, fieldPath: KOI_FIELD, enamel: "#fbfaf6",
      enamelExtra: '<ellipse cx="32" cy="15" rx="6" ry="4.5" fill="#e8622a"/><ellipse cx="29.5" cy="27" rx="4.6" ry="6" fill="#e8622a"/><ellipse cx="35" cy="34" rx="3" ry="3.6" fill="#1b1b1d"/><ellipse cx="28" cy="21" rx="1.8" ry="1.4" fill="#1b1b1d"/>',
      em: '<circle cx="28.6" cy="10.6" r="1"/><circle cx="35.4" cy="10.6" r="1"/><path d="M27 40.5C29.5 38.5 34.5 38.5 37 40.5M32 52V58M29 50.5 22 58.5M35 50.5 42 58.5" fill="none" stroke-width=".8"/>' },
    hasu: { metal: "silver", shape: HASU_D, field: .8, fieldDy: 2, enamel: "#f0a3c0",
      enamelExtra: '<rect y="43" width="64" height="21" fill="#1f4470"/><path d="M8 50H24M36 53H56M14 56H34" stroke="#9cc7ec" stroke-opacity=".6" stroke-width=".8"/>',
      em: '<path d="M32 10V38M25 20C28 27 30 33 31.5 39M39 20C36 27 34 33 32.5 39" fill="none" stroke-width=".8"/>' },
    kaguya: { metal: "rose", shape: TAKE_D, fieldPath: TAKE_FIELD, enamel: "#bfe0b4",
      enamelExtra: '<path d="M32 9C35 15 41 26 44.5 38H19.5C23 26 29 15 32 9Z" fill="#f4c0cf" fill-opacity=".55"/>',
      em: '<path d="M19 40C26 35.5 38 35.5 45 40M18 50C26 45.5 38 45.5 46 50M22.5 29C28 25.5 36 25.5 41.5 29M26.5 19C30 16.5 34 16.5 37.5 19" fill="none" stroke-width="1.4" stroke-linecap="round"/><path d="M32 40V36.5M25 49.5L27 45.8M39 49.5L37 45.8" fill="none" stroke-width=".9"/>' },
    edo: { metal: "lacquer", shape: EDO_D, fieldPath: EDO_FIELD, enamel: "#a8261c",
      em: '<path d="M32 14V33M26.5 15.3 24.5 33M37.5 15.3 39.5 33M21.5 18.6 19 33M42.5 18.6 45 33" fill="none" stroke-width=".9"/><g fill="none" stroke-width=".7" stroke-opacity=".8"><path d="M16 40v4M22 40v4M28 40v4M36 40v4M42 40v4M48 40v4M13 48v4M20 48v4M27 48v4M37 48v4M44 48v4M51 48v4M11 56v4M19 56v4M27 56v4M37 56v4M45 56v4M53 56v4"/></g>',
      gold: '<path d="M32 25C25.5 21 20.5 13.5 19.5 3.5 23.5 11 28 15 32 16.2 36 15 40.5 11 44.5 3.5 43.5 13.5 38.5 21 32 25Z"/><circle cx="32" cy="27.5" r="3.6"/>' },
    fujisan: { metal: "bronze", shape: FUJISAN_D, fieldPath: FUJISAN_FIELD, enamel: "#f4f7fa",
      em: '<path d="M30 34L27 47M34 34L37.5 49M32 32V43M26 37L21 47M38 37L43 47" fill="none" stroke-width=".9" stroke-linecap="round"/><path d="M6 56C14 52 20 53 26 55S40 57 46 54 56 53 60 55" fill="none" stroke-width="1.3"/>' },
    yuki: { metal: "ice", shape: YUKI_D, fieldPath: YUKI_FIELD, enamel: "#9fd2f0", guil: true, em: "" },
    fuji: { metal: "lilac", shape: FUJI_D, fieldPath: beads(.8), enamel: "#8a63d6",
      em: '<path d="M36 4.5c4-2 9-1.6 12 .5" fill="none" stroke-width=".8"/>' },
    umi: { metal: "silver", shape: WAVE_D, field: .74, fieldDx: 2, fieldDy: 5, enamel: "#163e6e", guil: true,
      em: '<path d="M9 54C13 42 20 33 30 27M15 58C19 47 25 39 34 33M40 30C43 27.5 46.5 27.5 48.5 29.5M34 52C30 46 31 38 35 33" fill="none" stroke-width="1.1" stroke-linecap="round"/>' },
    momiji: { metal: "copper", shape: MOMIJI_D, field: .7, fieldDy: -1, enamel: "#b52d1b",
      em: '<path d="M32 58V26M32 37L16 28M32 37L48 28M32 31L23.5 16M32 31L40.5 16M32 31V10" fill="none" stroke-width="1.5" stroke-linecap="round"/>' },
    yoru: { metal: "blued", shape: YORU_D, field: .78, fieldDx: -3, enamel: "#0c1640", guil: true,
      enamelExtra: '<g fill="#f6e3a6"><circle cx="17" cy="24" r=".7"/><circle cx="21" cy="42" r=".6"/><circle cx="31" cy="49" r=".8"/><circle cx="14" cy="34" r=".5"/><circle cx="27" cy="14" r=".5"/></g>',
      gold: '<path d="' + star(4, 9, 2.4, 49, 19, 0) + '"/><circle cx="56.5" cy="32" r="1.6"/>' },
    kin: { metal: "gold", shape: KIN_D, fieldPath: KIN_FIELD, enamel: null, em: KIN_EM }
  };
  window.KANAME_MEDAL = function (id) {
    var m = MEDALS[id] || MEDALS.sumi, mc = METAL[m.metal];
    var shapeT = function (pre) {
      pre = pre ? pre + " " : "";
      if (!m.petals) return '<path fill-rule="' + (m.evenodd ? "evenodd" : "nonzero") + '" d="' + m.shape + '"' + (pre ? ' transform="' + pre + '"' : "") + '/>';
      var s = ""; for (var k = 0; k < 5; k++) s += '<path d="' + (m.petal || BIG_PETAL) + '" transform="' + pre + 'rotate(' + (72 * k) + ' 32 32) translate(32 32) scale(1.12) translate(-32 -32)"/>'; return s;
    };
    var shape = shapeT("");
    var field = m.fieldPath ? '<path fill-rule="nonzero" d="' + m.fieldPath + '"/>'
      : shapeT('translate(' + (32 + (m.fieldDx || 0)) + ' ' + (32 + (m.fieldDy || 0)) + ') scale(' + m.field + ') translate(-32 -32)');
    var defs = '<defs>' + grad("m", mc) + grad("g", METAL.gold) +
      grad("md", [mc[2], mc[3], mc[4], mc[3], mc[2], mc[5]]) +
      bevel("rim", 1.3, 3.2, m.marble ? { marble: true, shadow: 1.2, spec: .9, exp: 30 } : { grain: ".015 .8", shadow: 1.2 }) +
      bevel("rel", .55, 2.2, { shadow: .5 }) +
      '<clipPath id="fc">' + field + '</clipPath>' +
      '<radialGradient id="gl" cx=".3" cy=".25" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient>' +
      '<radialGradient id="dm" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e8f4ff"/><stop offset=".8" stop-color="#9fb4c8"/><stop offset="1" stop-color="#5d6f80"/></radialGradient>';
    // Cuerpo de la silueta (en Shiro, mármol blanco con vetas y canto de platino)
    var body = m.marble
      ? '<g fill="#efece6" filter="url(#rim)">' + shape + '</g><g fill="none" stroke="url(#m)" stroke-width="1.4" filter="url(#rel)">' + shape + '</g>'
      : '<g fill="url(#m)" filter="url(#rim)">' + shape + '</g>';
    var guil = "";
    if (m.guil) {
      for (var gk = 0; gk < 72; gk++) { var ga = Math.PI * 2 * gk / 72, gp = [32 + 40 * Math.cos(ga), 32 + 40 * Math.sin(ga)]; guil += "M32 32L" + f(gp[0]) + " " + f(gp[1]); }
      guil = '<path d="' + guil + '" stroke="#000" stroke-opacity=".2" stroke-width=".45"/>';
    }
    if (m.noField) {
    } else if (m.enamel) {
      body += '<g clip-path="url(#fc)"><rect width="64" height="64" fill="' + m.enamel + '"/>' + guil + (m.enamelExtra || "") + '<rect width="64" height="64" fill="url(#gl)"/></g>';
    } else {
      body += '<g clip-path="url(#fc)"><rect width="64" height="64" fill="url(#md)"/>' + guil + '</g>';
    }
    if (!m.noField) body += '<g fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.1">' + field + '</g>';
    if (m.em) body += '<g fill="url(#m)" stroke="url(#m)" filter="url(#rel)">' + m.em + '</g>';
    if (m.gold) body += '<g fill="url(#g)" stroke="url(#g)" filter="url(#rel)">' + m.gold + '</g>';
    if (m.gems) m.gems.forEach(function (g) {
      body += '<circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + (g[2] + .7) + '" fill="url(#m)" filter="url(#rel)"/><circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + g[2] + '" fill="url(#dm)"/>' +
        '<path d="' + star(4, g[2] * 1.9, g[2] * .25, g[0] - g[2] * .3, g[1] - g[2] * .3, 0) + '" fill="#fff" opacity=".9"/>';
    });
    if (m.over) body += m.over;
    return svg(defs + '</defs>' + body, 64, 64);
  };
}
