/* Formas, motivos y escenas originales de las paletas (SVG generado por código) */
import { curvePts, ribbon } from "./scenes-v5.js";
import { f, star } from "./medals.js";
import { lotusFlower } from "./scenes/varias.js";
  export function svg(body, w, h) {
  return 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + body + '</svg>') + '")';
}
// Formas (24×24) para pétalos, hojas, estrellas… C = color
var PETAL_D = "M12 23C6 19 3.5 12 6 6.5 7.6 3 10 1.8 10.6 1.5L12 4.2 13.4 1.5C14 1.8 16.4 3 18 6.5 20.5 12 18 19 12 23Z";
var SMALL_PETAL = "M12 12C9 10.5 8 7 9.3 4.3 10 3 11 2.5 11.3 2.3L12 3.6 12.7 2.3C13 2.5 14 3 14.7 4.3 16 7 15 10.5 12 12Z";
function blossom(fill, center) {
  var s = "";
  for (var k = 0; k < 5; k++) s += '<path d="' + SMALL_PETAL + '" fill="' + fill + '" transform="rotate(' + (72 * k) + ' 12 12)"/>';
  return s + '<circle cx="12" cy="12" r="1.7" fill="' + center + '"/>';
}
export var SHAPES = {
  petal: function (c) { return '<path d="' + PETAL_D + '" fill="' + c + '"/><path d="M12 22V9" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>'; },
  blossom: function (c) { return blossom(c, "#e0607e"); },
  leaf: function (c) { return '<path d="M12 1L13.6 6.5 18 4 16.6 9 22.5 8.5 18.5 12.5 20.5 14 14 14.5 13 17 12.6 23H11.4L11 17 10 14.5 3.5 14 5.5 12.5 1.5 8.5 7.4 9 6 4 10.4 6.5Z" fill="' + c + '"/>'; },
  tea: function (c) { return '<ellipse cx="12" cy="12" rx="5.2" ry="10.5" fill="' + c + '"/><path d="M12 3v18" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>'; },
  star: function (c) { return '<path d="M12 0C12.8 8 16 11.2 24 12 16 12.8 12.8 16 12 24 11.2 16 8 12.8 0 12 8 11.2 11.2 8 12 0Z" fill="' + c + '"/>'; },
  dot: function (c) { return '<defs><radialGradient id="g"><stop offset="0" stop-color="' + c + '"/><stop offset=".35" stop-color="' + c + '" stop-opacity=".8"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient></defs><circle cx="12" cy="12" r="12" fill="url(#g)"/>'; },
  bubble: function (c) { return '<circle cx="12" cy="12" r="10" fill="none" stroke="' + c + '" stroke-width="1.6"/><circle cx="8.5" cy="8" r="2" fill="' + c + '" fill-opacity=".6"/>'; },
  drop: function (c) { return '<path d="M12 1C12 1 4 11 4 16a8 8 0 0 0 16 0C20 11 12 1 12 1Z" fill="' + c + '"/>'; },
  wis: function (c) { return '<path d="M12 3C7 3 4 7 5 11 6.4 16 10 20 12 22 14 20 17.6 16 19 11 20 7 17 3 12 3Z" fill="' + c + '"/>'; },
  flake: function (c) { var s = '<g stroke="' + c + '" stroke-width="1.7" stroke-linecap="round" fill="none">'; for (var k = 0; k < 6; k++) s += '<g transform="rotate(' + (k * 60) + ' 12 12)"><path d="M12 12V2M12 6L9.5 3.5M12 6L14.5 3.5"/></g>'; return s + '</g>'; },
  fish: function (c) { return '<path d="M12 2C15 2 16.5 5 16.5 9 16.5 12 15 15 13.5 17L13 18C14 19 15.5 20.5 16.5 23 15 22.4 13.5 21.4 12 20 10.5 21.4 9 22.4 7.5 23 8.5 20.5 10 19 11 18L10.5 17C9 15 7.5 12 7.5 9 7.5 5 9 2 12 2Z" fill="' + c + '"/><circle cx="12" cy="7" r="2" fill="#e8622a" fill-opacity=".8"/>'; },
  ginkgo: function (c) { return '<path d="M12 22C12 18 11.5 15 12 13 8 13 3 10 1.5 5 5 2 9 1.5 12 4 15 1.5 19 2 22.5 5 21 10 16 13 12 13 12.5 15 12 18 12 22Z" fill="' + c + '"/>'; },
  seal: function (c) { return '<circle cx="12" cy="12" r="9" fill="none" stroke="' + c + '" stroke-width="2.4"/><circle cx="12" cy="12" r="3" fill="' + c + '"/>'; }
};

// Motivos de fondo (patrones que se repiten)
export function seigaiha(stroke, fill) { // olas 青海波
  var s = "", cs = [[0, 0], [40, 0], [20, 10], [0, 20], [40, 20]];
  cs.forEach(function (c) {
    s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="19.5" fill="' + fill + '" stroke="' + stroke + '"/>';
    [14.5, 9.5, 4.5].forEach(function (r) { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + r + '" fill="none" stroke="' + stroke + '"/>'; });
  });
  return svg(s, 40, 20);
}
export function sakuraRelief() { // flores de cerezo en relieve (luz arriba-izquierda, sombra abajo-derecha)
  var spots = [[18, 22, 1.0, 10], [104, 14, 0.7, 40], [70, 70, 1.25, 20], [150, 92, 0.85, 55], [22, 120, 0.75, 5], [110, 150, 1.05, 30], [176, 168, 0.6, 15], [44, 182, 0.9, 62]];
  var s = "";
  spots.forEach(function (p) {
    var g = function (dx, dy, fill, center) { return '<g transform="translate(' + (p[0] + dx) + ' ' + (p[1] + dy) + ') rotate(' + p[3] + ') scale(' + p[2] + ') translate(-12 -12)">' + blossom(fill, center) + '</g>'; };
    s += g(1.1, 1.3, "#c97c92", "#c97c92").replace(/fill="#c97c92"/g, 'fill="#b9566f" fill-opacity=".16"');
    s += g(-0.9, -0.9, "#ffffff", "#ffffff").replace(/fill="#ffffff"/g, 'fill="#ffffff" fill-opacity=".95"');
    s += g(0, 0, "#f9dfe6", "#f2b9c8");
  });
  return svg(s, 200, 200);
}
export function triGrid(stroke) { // red triangular (base del 麻の葉)
  var h = 69.282;
  var s = '<g stroke="' + stroke + '" stroke-width=".8" fill="none"><path d="M0 0H40M0 34.641H40M0 0L40 ' + h + 'M40 0L0 ' + h + '"/>' +
    '<path d="M20 11.547V0M20 11.547L0 0M20 11.547L40 0M20 23.094V34.641M20 23.094L0 ' + h + 'M20 23.094L40 ' + h + '" stroke-opacity=".55"/></g>';
  return svg(s, 40, h);
}
export function bamboo(c) { // dos cañas de bambú en relieve
  var s = '<g fill="none" stroke="' + c + '" stroke-linecap="round">';
  [[22, 9], [52, 7]].forEach(function (b) {
    s += '<path d="M' + b[0] + ' 0V800" stroke-width="' + b[1] + '"/>';
    for (var y = 60 + b[0]; y < 800; y += 130) s += '<path d="M' + (b[0] - b[1]) + ' ' + y + 'H' + (b[0] + b[1]) + '" stroke-width="2.2"/>';
  });
  s += '<path d="M28 150q30 -6 60 18M58 330q30 -8 52 10M26 470q34 0 58 26M56 640q26 -10 50 6" stroke-width="5"/></g>';
  return svg(s, 120, 800);
}
function wisteria() { // racimos de glicinia colgando
  var s = "", cols = ["#c9b6ec", "#b39ce0", "#a088d6", "#8d73c8"];
  [[14, 120], [44, 170], [76, 105], [108, 150]].forEach(function (cl, ci) {
    for (var i = 0; i < 16; i++) {
      var y = 6 + i * (cl[1] / 16), w = 9 - i * 0.42, x = cl[0] + Math.sin(i * 1.7 + ci) * 2.5;
      s += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + w + '" ry="' + (w * 0.62) + '" fill="' + cols[(i + ci) % 4] + '" fill-opacity="' + (0.55 - i * 0.022) + '"/>';
    }
    s += '<path d="M' + cl[0] + ' 0V8" stroke="#6b5a86" stroke-width="1.2"/>';
  });
  return svg(s, 124, 190);
}
export function wave(c) { return svg('<path d="M0 30 Q50 6 100 30 T200 30 T300 30 T400 30 V60 H0Z" fill="' + c + '"/>', 400, 60); }
// ---- Escenas de fondo de las paletas nuevas ----
// Edo: papel washi con fibras, garzas y carpas koi pintadas a tinta
export function washi() {
  return svg('<filter id="p" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .38 0 0 0 0 .28 0 0 0 0 .16 0 0 0 .11 0"/></filter>' +
    '<filter id="q" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .35" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .34 0 0 0 0 .2 0 0 0 .16 -.04"/></filter>' +
    '<rect width="220" height="220" filter="url(#p)"/><rect width="220" height="220" filter="url(#q)"/>', 220, 220);
}
var INK = "rgba(29,23,18,";
function heron(flip) {
  var s = '<g transform="' + (flip ? 'translate(120 0) scale(-1 1)' : '') + '" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M44 72C54 60 74 62 80 76 84 88 74 100 60 101 47 102 37 94 35 85Z" fill="' + INK + '.13)" stroke="' + INK + '.45)" stroke-width="1.2"/>' +
    '<path d="M78 80L98 96 80 91Z" fill="' + INK + '.35)"/><path d="M58 76C64 82 70 84 76 82M52 86C60 92 68 93 74 90" fill="none" stroke="' + INK + '.3)" stroke-width="1"/>' +
    '<path d="M46 72C40 58 47 47 53 43 59 39 59 31 53 27" fill="none" stroke="' + INK + '.5)" stroke-width="4.2"/>' +
    '<circle cx="51" cy="26" r="5" fill="' + INK + '.45)"/><path d="M47 26L24 31" stroke="' + INK + '.6)" stroke-width="2.2"/><path d="M53 23C58 18 64 17 68 18" fill="none" stroke="' + INK + '.45)" stroke-width="1.4"/>' +
    '<path d="M57 100L55 156M64 99L68 156M55 156L48 159M68 156L75 159" fill="none" stroke="' + INK + '.5)" stroke-width="1.8"/></g>';
  return s;
}
function koi(spots) {
  return '<path d="M10 30C30 11 70 9 92 26 96 30 96 32 92 34 70 51 30 49 10 30Z" fill="' + INK + '.07)" stroke="' + INK + '.42)" stroke-width="1.3"/>' +
    '<path d="M92 30L114 15 107 30 114 45Z" fill="' + INK + '.1)" stroke="' + INK + '.4)" stroke-width="1.1"/>' +
    '<path d="M48 15L57 2 65 14M46 45L55 57 62 46" fill="' + INK + '.08)" stroke="' + INK + '.35)" stroke-width="1"/>' +
    '<circle cx="22" cy="27" r="2" fill="' + INK + '.55)"/><path d="M12 31C8 34 5 38 3 42" fill="none" stroke="' + INK + '.35)" stroke-width=".9"/>' +
    spots.map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="' + p[2] + '" ry="' + (p[2] * .7) + '" fill="rgba(181,51,42,.3)"/>'; }).join("") +
    '<path d="M36 22C40 26 40 34 36 38M52 20C56 25 56 35 52 40M68 22C71 26 71 34 68 38" fill="none" stroke="' + INK + '.18)" stroke-width=".8"/>';
}
export function edoHerons() { return svg('<g transform="translate(10 4)">' + heron(false) + '</g><g transform="translate(118 26) scale(.78)">' + heron(true) + '</g>' +
  '<path d="M4 172C40 166 80 168 120 174S190 178 230 170" fill="none" stroke="' + INK + '.2)" stroke-width="1.2"/><path d="M30 182C70 177 110 180 150 185" fill="none" stroke="' + INK + '.12)" stroke-width="1"/>', 240, 190); }
export function edoKoi() { return svg('<g transform="translate(18 40) rotate(-12 60 30)">' + koi([[40, 22, 7], [62, 34, 6], [78, 24, 4]]) + '</g>' +
  '<g transform="translate(150 110) rotate(168 60 30) scale(.8)">' + koi([[30, 28, 6], [56, 20, 8]]) + '</g>' +
  '<g fill="none" stroke="' + INK + '.2)" stroke-width="1"><ellipse cx="200" cy="54" rx="22" ry="6"/><ellipse cx="200" cy="54" rx="34" ry="10" stroke-opacity=".6"/><ellipse cx="70" cy="150" rx="18" ry="5"/><ellipse cx="70" cy="150" rx="28" ry="8" stroke-opacity=".6"/></g>', 300, 200); }
// Fuji: el monte con nieve, nubes japonesas (kumo) y sol rojo
export function fujiScene() {
  return svg('<defs><linearGradient id="fm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a44"/><stop offset=".55" stop-color="#6e4428"/><stop offset="1" stop-color="#4a2c19"/></linearGradient>' +
    '<linearGradient id="sn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f5f7"/><stop offset="1" stop-color="#d8dfe6"/></linearGradient></defs>' +
    '<path d="M-30 300L118 134Q148 96 172 91H228Q252 96 282 134L430 300Z" fill="url(#fm)"/>' +
    '<path d="M118 134Q148 96 172 91H228Q252 96 282 134L268 128 256 146 240 130 226 152 210 132 196 150 182 131 166 148 152 130 140 144 130 128Z" fill="url(#sn)"/>' +
    '<path d="M182 131L176 168M210 132L214 176M240 130L250 162M160 147L150 172" stroke="#ffffff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M200 92L196 120M188 94L178 122M214 94L222 118" stroke="#c9d3dc" stroke-width="1.2"/>', 400, 300);
}
export function kumo(c) { return svg('<path d="M0 46Q8 30 24 36Q30 18 50 26Q60 10 80 22Q92 12 106 26Q120 18 130 32Q146 28 150 46Z" fill="' + c + '"/><path d="M20 46Q26 38 36 40M70 46Q78 34 92 38" fill="none" stroke="#c9b79e" stroke-opacity=".4" stroke-width="1.2"/>', 150, 50); }
// Yuki: escarcha que crece desde las esquinas
export function frost(seed) {
  var s = "", rng = seed;
  function r() { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; }
  function br(x, y, a, len, w, d) {
    var x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke-width="' + w.toFixed(2) + '"/>';
    if (d <= 0) return;
    [.3, .55, .8].forEach(function (t) {
      var px = x + Math.cos(a) * len * t, py = y + Math.sin(a) * len * t, l = len * (.42 - t * .2) * (.8 + r() * .4);
      br(px, py, a - Math.PI / 3, l, w * .6, d - 1); br(px, py, a + Math.PI / 3, l, w * .6, d - 1);
    });
  }
  for (var k = 0; k < 5; k++) br(0, 0, (k / 4) * Math.PI / 2 + (r() - .5) * .2, 120 + r() * 80, 2.4, 3);
  return svg('<g fill="none" stroke-linecap="round"><g stroke="#9cc6e4" stroke-opacity=".5" transform="translate(1 1)">' + s + '</g><g stroke="#ffffff">' + s + '</g></g>', 260, 260);
}
// Umi: la gran ola, al estilo de las estampas ukiyo-e
export function bigWave() {
  var claws = "";
  for (var i = 0; i < 9; i++) { var x = 120 + i * 24, y = 92 - Math.sin(i / 8 * Math.PI) * 30 + i * 2; claws += 'M' + x + ' ' + (y + 4) + 'q-6 -14 4 -20q-2 8 6 10q-2 -10 8 -12q-4 8 2 14Z'; }
  return svg('<defs><linearGradient id="wv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6aa8"/><stop offset=".5" stop-color="#1b4a80"/><stop offset="1" stop-color="#0d2a4c"/></linearGradient></defs>' +
    '<path d="M-10 280C10 210 50 140 110 104C160 74 240 64 300 78C340 88 360 112 350 134C342 150 320 152 312 138C306 126 314 116 324 118C306 104 268 106 246 126C220 150 214 196 236 236C250 260 290 274 410 280Z" fill="url(#wv)"/>' +
    '<g fill="none" stroke="#7fb0e0" stroke-opacity=".5" stroke-width="2"><path d="M20 260C40 200 80 150 130 122M44 270C66 214 104 170 152 142M70 278C92 232 126 196 170 170M230 150C214 180 214 214 230 246"/></g>' +
    '<path d="M108 106C160 74 240 64 300 78C340 88 360 112 350 134C342 150 320 152 312 138C306 126 314 116 324 118C300 96 250 96 210 108C170 120 140 130 108 106Z" fill="#efe6d0" fill-opacity=".92"/>' +
    '<path d="' + claws + '" fill="#efe6d0"/>' +
    '<path d="M320 280C330 250 350 230 380 222C396 218 410 226 410 240V280Z" fill="#1b4a80"/><path d="M330 262C338 246 352 236 370 232" fill="none" stroke="#efe6d0" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M282 212L300 186 318 212Z" fill="#20476f"/><path d="M296 192L300 186 304 192 302 195 300 192 298 195Z" fill="#efe6d0"/>', 410, 280);
}
// ---- Escenas v4 ----
export function seeded(seed) { var x = seed || 1; return function () { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
export var WC = '<filter id="wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d"/><feGaussianBlur in="d" stdDeviation="1.1"/></filter>' +
  '<filter id="sk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/></filter>';
// Koi a la acuarela (vista desde arriba)
var KOI_BODY = "M60 6C72 6 80 18 81 34 82 50 76 70 68 86L66 92C72 98 80 106 86 120 76 116 67 110 60 102 53 110 44 116 34 120 40 106 48 98 54 92L52 86C44 70 38 50 39 34 40 18 48 6 60 6Z";
function koiWC(spots, seed) {
  var r = seeded(seed), s = '<defs>' + WC + '</defs><g filter="url(#wc)">' +
    '<path d="M41 38C32 38 22 44 16 54 26 52 34 50 41 48ZM79 38C88 38 98 44 104 54 94 52 86 50 79 48Z" fill="#d9dfe4" fill-opacity=".8"/>' +
    '<path d="' + KOI_BODY + '" fill="#ffffff" stroke="#9aa8b4" stroke-width="2"/>';
  spots.forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="' + p[2] + '" ry="' + p[3] + '" transform="rotate(' + (r() * 60 - 30).toFixed(1) + ' ' + p[0] + ' ' + p[1] + ')" fill="' + p[4] + '" fill-opacity="' + (p[4] === "#1d1d1f" ? .82 : .9) + '"/>'; });
  return s + '<circle cx="53" cy="17" r="1.6" fill="#2a2a2a"/><circle cx="67" cy="17" r="1.6" fill="#2a2a2a"/></g>';
}
export function koiSprite(n) {
  var sets = [
    [[60, 22, 13, 9, "#ec6a2c"], [56, 52, 10, 13, "#ec6a2c"], [66, 74, 7, 6, "#1d1d1f"], [50, 36, 5, 4, "#1d1d1f"]],
    [[62, 30, 14, 12, "#f08a3c"], [58, 64, 9, 8, "#ec6a2c"]],
    [[58, 26, 9, 7, "#1d1d1f"], [64, 46, 12, 9, "#ec6a2c"], [54, 70, 8, 7, "#1d1d1f"], [70, 60, 5, 4, "#ec6a2c"]]
  ];
  return svg(koiWC(sets[n % 3], n + 3), 120, 124);
}
function lotusPad(x, y, rx, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M0 0L' + rx + ' -3A' + rx + ' ' + (rx * .42) + ' 0 1 1 ' + rx + ' 3Z" fill="#3f8f7e" fill-opacity=".85"/><path d="M0 0L' + (rx * .9) + ' 0M0 0L' + (-rx * .7) + ' ' + (rx * .25) + 'M0 0L' + (-rx * .7) + ' ' + (-rx * .25) + 'M0 0L' + (rx * .3) + ' ' + (rx * .38) + 'M0 0L' + (rx * .3) + ' ' + (-rx * .38) + '" stroke="#7cc4ae" stroke-opacity=".6" stroke-width="1"/></g>'; }
export function lotusScene() {
  var s = '<defs>' + WC + '<linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b5a86" stop-opacity="0"/><stop offset=".3" stop-color="#2b5a86" stop-opacity=".55"/><stop offset="1" stop-color="#132a4a"/></linearGradient></defs>' +
    '<rect y="300" width="400" height="560" fill="url(#lw)"/><g fill="none" stroke="#bfe0f2" stroke-opacity=".35" stroke-width="1.2"><path d="M20 520H120M180 560H320M60 640H220M260 700H380M30 770H160"/></g><g filter="url(#wc)">';
  [[70, 600, 46, -8], [300, 560, 40, 14], [190, 690, 54, 4], [40, 770, 38, 22], [330, 760, 50, -12], [250, 820, 36, 30], [120, 830, 44, -20]].forEach(function (a) { s += lotusPad(a[0], a[1], a[2], a[3]); });
  s += lotusFlower(96, 585, 1.25) + lotusFlower(318, 545, 1.05) + lotusFlower(206, 676, 1.45) + lotusFlower(352, 742, .9) + '</g>';
  return svg(s, 400, 860);
}
// Kaguya: el cuento del cortador de bambú. Luna llena con su conejo, bosque de bambú a la acuarela,
// el tallo que brilla donde apareció la princesa y Kaguya-hime subiendo a la luna sobre una nube,
// con su kimono de capas (jūnihitoe) y el manto de plumas celestial ondeando.
export function kaguyaScene() {
  var r = seeded(21);
  var s = '<defs>' + WC +
    '<radialGradient id="mo"><stop offset="0" stop-color="#fffdf6"/><stop offset=".5" stop-color="#fdf3df"/><stop offset=".72" stop-color="#f9e4c8" stop-opacity=".9"/><stop offset=".86" stop-color="#f6d3dc" stop-opacity=".45"/><stop offset="1" stop-color="#f6d3dc" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="gl"><stop offset="0" stop-color="#fff6c8"/><stop offset=".35" stop-color="#ffe79a" stop-opacity=".75"/><stop offset="1" stop-color="#ffe79a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="bb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb27a"/><stop offset=".35" stop-color="#b9dcb0"/><stop offset=".7" stop-color="#9cc993"/><stop offset="1" stop-color="#6e9f6a"/></linearGradient>' +
    '<linearGradient id="bf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9c9a2"/><stop offset=".5" stop-color="#d3e8cc"/><stop offset="1" stop-color="#a2c49b"/></linearGradient>' +
    '<linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e7ef" stop-opacity="0"/><stop offset="1" stop-color="#f3dbe4" stop-opacity=".7"/></linearGradient></defs>';
  // luna llena con halo, manchas a la acuarela y el conejo que machaca mochi
  s += '<circle cx="292" cy="150" r="150" fill="url(#mo)"/><circle cx="292" cy="150" r="66" fill="#fffaf0"/>' +
    '<g filter="url(#wc)" fill="#eadcc4" fill-opacity=".55"><ellipse cx="270" cy="130" rx="18" ry="11"/><ellipse cx="312" cy="168" rx="14" ry="9"/><ellipse cx="300" cy="118" rx="8" ry="6"/></g>' +
    '<g transform="translate(296 158) scale(.9)" fill="#d9c6a6" fill-opacity=".75"><ellipse cx="0" cy="8" rx="14" ry="11"/><circle cx="-12" cy="-4" r="7.5"/><path d="M-14 -10C-20 -26 -16 -32 -12 -30 -9 -24 -10 -16 -11 -10ZM-9 -10C-8 -26 -2 -30 1 -27 1 -20 -4 -14 -7 -9Z"/>' +
    '<path d="M8 2L22 -14 25 -11 11 4Z"/><path d="M14 18H34L31 28H17Z"/><ellipse cx="24" cy="17" rx="10" ry="3"/></g>' +
    '<circle cx="292" cy="150" r="66" fill="none" stroke="#d8c6a8" stroke-opacity=".6" stroke-width="1.2" filter="url(#sk)"/>';
  // nubes doradas que suben hacia la luna (el camino del cortejo celestial)
  function kumo(x, y, sc, op) { // bruma dorada escalonada (suyari-gasumi)
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" opacity="' + op + '" fill="#fff6e6" fill-opacity=".85" stroke="#e0c27e" stroke-opacity=".7" stroke-width="1.1" filter="url(#wc)"><path d="M18 0H96A9 9 0 0 1 96 18H18A9 9 0 0 1 18 0Z"/><path d="M0 14H66A8 8 0 0 1 66 30H0A8 8 0 0 1 0 14Z"/><path d="M40 26H120A8 8 0 0 1 120 42H40A8 8 0 0 1 40 26Z"/></g>'; }
  s += kumo(176, 300, .9, .75) + kumo(222, 236, .7, .6) + kumo(120, 380, 1.1, .8) + kumo(300, 330, .6, .55);
  // bosque de bambú: cañas al fondo (pálidas) y delante (más intensas), con nudos y ramitas de hojas
  function cane(x, w, grad, op, sd, tilt) {
    var rr = seeded(sd), o = '<g opacity="' + op + '" transform="rotate(' + tilt + ' ' + x + ' 860)">';
    o += '<rect x="' + f(x - w / 2) + '" y="-20" width="' + f(w) + '" height="900" fill="url(#' + grad + ')"/>';
    for (var y = 30 + rr() * 90; y < 860; y += 90 + rr() * 50) o += '<path d="M' + f(x - w / 2 - 1) + ' ' + f(y) + 'H' + f(x + w / 2 + 1) + '" stroke="#4f7f4c" stroke-opacity=".7" stroke-width="2.2"/><path d="M' + f(x - w / 2) + ' ' + f(y + 3) + 'H' + f(x + w / 2) + '" stroke="#e6f3e0" stroke-opacity=".7" stroke-width="1"/>';
    for (var k = 0; k < 4; k++) {
      var ly = 60 + rr() * 640, dir = rr() > .5 ? 1 : -1, bx = x + dir * w / 2;
      var tx = bx + dir * 30, ty = ly - 16;
      o += '<path d="M' + f(bx) + ' ' + f(ly) + 'q' + (dir * 14) + ' -12 ' + (dir * 30) + ' -16" fill="none" stroke="#6e9f6a" stroke-width="1.3"/>';
      for (var l = 0; l < 5; l++) { var la = (dir > 0 ? 0 : 180) + dir * (8 + l * 22 + rr() * 10); o += '<path d="M0 0C6 -3.2 22 -3.6 40 0 22 3.4 6 3 0 0Z" fill="' + (l % 2 ? "#7fb27a" : "#9fcf94") + '" transform="translate(' + f(tx) + ' ' + f(ty) + ') rotate(' + f(la) + ')"/><path d="M2 0H36" stroke="#5f8f5c" stroke-opacity=".45" stroke-width=".6" transform="translate(' + f(tx) + ' ' + f(ty) + ') rotate(' + f(la) + ')"/>'; }
    }
    return o + '</g>';
  }
  s += '<g filter="url(#wc)">' + cane(70, 9, "bf", .55, 3, 1) + cane(384, 10, "bf", .5, 5, -1) + cane(118, 6, "bf", .45, 7, -.5) + cane(340, 7, "bf", .45, 9, .6) + '</g>';
  s += '<g filter="url(#wc)">' + cane(18, 15, "bb", .85, 11, 0) + cane(48, 11, "bb", .8, 13, 1.2) + cane(368, 13, "bb", .8, 15, -1) + '</g>';
  // bruma rosada abajo
  s += '<rect y="560" width="400" height="300" fill="url(#hz)"/>';
  // el tallo cortado que brilla, donde el anciano encontró a la princesa
  s += '<circle cx="96" cy="770" r="70" fill="url(#gl)"/><g filter="url(#wc)"><rect x="86" y="742" width="20" height="130" fill="url(#bb)"/><path d="M86 742L106 734V742Z" fill="#cfe6c6"/><ellipse cx="96" cy="740" rx="10" ry="3.6" fill="#fff4c0"/></g>' +
    '<path d="M90 812H102" stroke="#4f7f4c" stroke-width="2"/><g fill="#fff6c8">' + [[80, 720], [112, 712], [96, 700], [70, 744], [124, 738]].map(function (p) { return '<path d="' + star(4, 5, 1.2, p[0], p[1], 0) + '"/>'; }).join("") + '</g>';
  // Kaguya-hime de pie sobre una nube, mirando a la luna, con el manto de plumas al viento
  s += kumo(196, 784, 1.5, .95);
  var veil = ribbon(curvePts(function (t) { return [40 + t * 150 - Math.sin(t * 5) * 18, 30 - t * 210 + Math.sin(t * 7) * 10]; }, 40), function (t) { return 9 * (1 - t * .7); });
  var veil2 = ribbon(curvePts(function (t) { return [86 - t * 120 + Math.sin(t * 6) * 10, 50 - t * 120 - Math.sin(t * 5) * 14]; }, 40), function (t) { return 7 * (1 - t * .7); });
  s += '<g transform="translate(250 612) scale(.92)"><g filter="url(#wc)">' +
    '<path d="' + veil + '" fill="#ffffff" fill-opacity=".85" stroke="#9fb9da" stroke-width="1"/><path d="' + veil2 + '" fill="#fbe3ea" fill-opacity=".9" stroke="#e2a6b8" stroke-width="1"/>' +
    // cola del kimono extendida sobre la nube, con los bordes de las capas
    '<path d="M30 70C22 120 6 170 -30 212 20 222 100 222 132 210 116 160 98 116 88 70Z" fill="#9c3550"/>' +
    '<path d="M-30 212C20 222 100 222 132 210L130 204C98 214 24 214 -26 206Z" fill="#f2b8c8"/><path d="M-26 206C24 214 98 214 130 204L128 198C96 207 28 207 -22 200Z" fill="#c7e0bd"/><path d="M-22 200C28 207 96 207 128 198L126 193C94 201 32 201 -18 195Z" fill="#d9c6ef"/>' +
    '<path d="M34 72C28 118 16 160 -8 194 30 200 92 200 122 190 108 150 94 112 84 72Z" fill="#c45a78"/>' +
    '<g fill="#f6e3a6" fill-opacity=".85">' + [[30, 120], [56, 150], [84, 128], [20, 170], [70, 182], [100, 168], [48, 100], [92, 98]].map(function (p) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ')">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-2.6" rx="1.4" ry="2.4" transform="rotate(' + a + ')"/>'; }).join("") + '</g>'; }).join("") + '</g>' +
    // mangas largas colgando, con las capas asomando
    '<path d="M36 60C20 74 8 100 6 136 18 142 32 138 40 120 44 100 44 80 40 64Z" fill="#a8405e"/><path d="M6 136C18 142 32 138 40 120L42 126C34 144 18 148 4 142Z" fill="#f2b8c8"/>' +
    '<path d="M80 60C96 74 108 100 110 136 98 142 84 138 76 120 72 100 72 80 76 64Z" fill="#a8405e"/><path d="M110 136C98 142 84 138 76 120L74 126C82 144 98 148 112 142Z" fill="#f2b8c8"/>' +
    // pelo largo y liso por la espalda
    '<path d="M49 18C44 46 46 80 44 112 42 140 46 168 40 192 50 186 56 190 60 196 64 190 70 186 78 192 72 168 76 140 74 112 72 80 74 46 67 18Z" fill="#1f1a18"/><path d="M56 40C55 80 57 130 54 180M62 40C63 90 62 140 66 182" fill="none" stroke="#4a3e38" stroke-width=".8"/>' +
    '<ellipse cx="58" cy="14" rx="11.5" ry="13" fill="#1f1a18"/><path d="M64 6C71 7 74 14 72 21 70 25 66 25 64 23Z" fill="#fbeee6"/>' +
    '<path d="M50 4C54 -4 64 -5 69 1" fill="none" stroke="#c9a24a" stroke-width="1.6"/><circle cx="60" cy="-3" r="2.2" fill="#c9a24a"/><path d="M60 -1V8" stroke="#c9a24a" stroke-width=".8"/></g>' +
    '<g filter="url(#sk)" fill="none" stroke="#3a302a" stroke-opacity=".45" stroke-width="1"><path d="M30 70C22 120 6 170 -30 212M88 70C98 116 116 160 132 210M36 60C20 74 8 100 6 136M80 60C96 74 108 100 110 136"/></g></g>';
  // destellos y pétalos flotando
  for (var p = 0; p < 22; p++) s += '<circle cx="' + (130 + r() * 260).toFixed(0) + '" cy="' + (200 + r() * 520).toFixed(0) + '" r="' + (1 + r() * 2.2).toFixed(1) + '" fill="' + (r() > .5 ? "#f4b8c8" : "#f6e3a6") + '" fill-opacity=".85"/>';
  return svg(s, 400, 860);
}
// Umi: «La gran ola de Kanagawa» de Hokusai (1831), recompuesta en vertical:
// la ola gigante con su espuma en garras, el Fuji nevado en el seno, la ola pequeña delante,
// las tres barcas oshiokuri con sus remeros, la espuma cayendo como nieve y la cartela del título.
export function greatWave() {
  var r = seeded(7), P = "#1b3a66", PD = "#112a4d", PL = "#3f6ea3", PX = "#8fb3d8", FO = "#f3ecda", INKL = "#0e2240";
  function bz(p, t) { var u = 1 - t; return [u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]]; }
  function ang(p, t) { var a = bz(p, Math.max(0, t - .01)), b = bz(p, Math.min(1, t + .01)); return Math.atan2(b[1] - a[1], b[0] - a[0]); }
  // Garra de espuma: un dedo que se curva hacia abajo y se abre en tres puntas en gancho (fractal sencillo)
  function finger(x, y, a, L, w, bend, depth) {
    var pts = [[x, y]], n = 10, px = x, py = y;
    for (var i = 1; i <= n; i++) { var d = a + bend * i / n; px += Math.cos(d) * L / n; py += Math.sin(d) * L / n; pts.push([px, py]); }
    var o = '<path d="' + ribbon(pts, function (t) { return w * (1 - t * .6) * (t < .2 ? .55 + t * 2.25 : 1); }) + '"/>';
    var ea = a + bend;
    if (depth > 0) { for (var k = -1; k <= 1; k++) o += finger(px, py, ea + k * .6, L * .55, w * .5, bend * 1.05, depth - 1); }
    else o += '<circle cx="' + f(px) + '" cy="' + f(py) + '" r="' + f(w * .4) + '"/>';
    return o;
  }
  var s = '<defs>' +
    '<linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d554a" stop-opacity=".55"/><stop offset=".25" stop-color="#8a7f6c" stop-opacity=".25"/><stop offset=".55" stop-color="#d9c9a2" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + PL + '"/><stop offset=".45" stop-color="' + P + '"/><stop offset="1" stop-color="' + PD + '"/></linearGradient>' +
    '<clipPath id="wcl"><path id="wb" d="M-20 870V560C10 470 60 390 130 340C190 298 260 280 320 292C365 302 392 336 380 372C372 392 350 398 338 386C328 374 336 360 348 362C320 346 270 346 238 372C200 404 182 470 190 540C198 610 240 670 300 700C340 718 380 722 420 716V870Z"/></clipPath></defs>';
  // cielo: papel con nubes oscuras arriba
  s += '<rect width="400" height="860" fill="url(#gsky)"/>' +
    '<path d="M-10 250C60 236 120 246 180 236S300 222 410 236V180C330 170 260 186 200 176S60 196 -10 186Z" fill="#cdbb92" fill-opacity=".35"/>';
  // cartela del título y firma (arriba a la izquierda, como en la estampa)
  s += '<g transform="translate(22 66)"><rect width="40" height="150" fill="#e9dcbc" stroke="#6b5a3a" stroke-width="1.2"/><rect x="3" y="3" width="34" height="144" fill="none" stroke="#6b5a3a" stroke-opacity=".5"/>' +
    '<g stroke="#3a3020" stroke-opacity=".7" stroke-width="1.8" stroke-linecap="round">';
  for (var c = 0; c < 2; c++) for (var q = 0; q < 8; q++) { var cx = 13 + c * 14, cy = 12 + q * 16.5; var g2 = ''; for (var z = 0; z < 3; z++) { var zx = cx - 4 + r() * 8, zy = cy - 4 + r() * 8, za = r() * Math.PI; g2 += 'M' + f(zx - Math.cos(za) * 3.5) + ' ' + f(zy - Math.sin(za) * 3.5) + 'L' + f(zx + Math.cos(za) * 3.5) + ' ' + f(zy + Math.sin(za) * 3.5); } s += '<path d="' + g2 + '"/>'; }
  s += '</g></g><g transform="translate(70 66)"><rect width="18" height="64" fill="#e9dcbc" stroke="#6b5a3a" stroke-width="1"/><path d="M9 8v48M5 16h8M5 30h8M5 44h8" stroke="#3a3020" stroke-opacity=".6" stroke-width="1.6"/></g>';
  // el Fuji en el seno de la ola
  s += '<g><path d="M226 704L284 638C290 631 300 631 306 638L364 704Z" fill="' + PL + '"/>' +
    '<path d="M273 651L284 638C290 631 300 631 306 638L317 651 309 648 303 656 296 647 289 657 282 648Z" fill="#f6f1e4"/>' +
    '<path d="M226 704L284 638" fill="none" stroke="' + INKL + '" stroke-width="1.2"/><path d="M306 638L364 704" fill="none" stroke="' + INKL + '" stroke-width="1.2"/>' +
    '<path d="M250 690L278 668M262 696L290 664M318 664L340 690" stroke="' + PX + '" stroke-opacity=".6" stroke-width="1.2"/></g>';
  // mar del fondo a la derecha
  s += '<path d="M180 720C240 700 300 708 420 698V870H180Z" fill="' + P + '"/>';
  // la gran ola
  s += '<use href="#wb" fill="url(#gw)"/><g clip-path="url(#wcl)" fill="none" stroke-linecap="round">';
  // vetas: copias de la silueta que convergen en el rizo, alternando azul claro y espuma
  var CREST = "M-20 560C10 470 60 390 130 340C190 298 260 280 320 292C365 302 392 336 380 372C372 392 350 398 338 386";
  var FACE = "M348 362C320 346 270 346 238 372C200 404 182 470 190 540C198 610 240 670 300 700";
  for (var k = 1; k <= 12; k++) {
    var sc = 1 - k * .055, col = k % 3 === 0 ? FO : PX, tr = 'translate(352 372) scale(' + f(sc) + ') translate(-352 -372)';
    s += '<path d="' + CREST + '" transform="' + tr + '" stroke="' + col + '" stroke-opacity="' + (k % 3 === 0 ? .6 : .55) + '" stroke-width="' + f(2.8 - k * .13) + '"/>';
  }
  for (var k2 = 1; k2 <= 8; k2++) s += '<path d="' + FACE + '" transform="translate(' + (-k2 * 9) + ' ' + (k2 * 2) + ')" stroke="' + PX + '" stroke-opacity="' + f(.55 - k2 * .04) + '" stroke-width="1.6"/>';
  // malla de líneas finas en el cuerpo
  for (var m = 0; m < 26; m++) { var x0 = -20 + m * 14; s += '<path d="M' + x0 + ' 870C' + (x0 + 26) + ' 720 ' + (x0 + 70 + m * 3) + ' 540 ' + (130 + m * 8) + ' ' + (350 - m * 2) + '" stroke="' + PD + '" stroke-opacity=".35" stroke-width=".9"/>'; }
  s += '</g>';
  // cresta de espuma: banda blanca con borde azul
  var C1 = [130, 340, 190, 298, 260, 280, 320, 292], C2 = [320, 292, 365, 302, 392, 336, 380, 372], C0 = [-20, 560, 10, 470, 60, 390, 130, 340];
  s += '<path d="M40 430C70 390 100 360 130 340C190 298 260 280 320 292C365 302 392 336 380 372C372 392 350 398 338 386C328 374 336 360 348 362" fill="none" stroke="' + FO + '" stroke-width="15" stroke-linecap="round"/>' +
    '<path d="M48 440C76 400 104 372 136 352C192 314 258 298 316 308C352 316 372 340 366 362" fill="none" stroke="' + PX + '" stroke-width="5" stroke-opacity=".9"/>';
  // garras de espuma a lo largo de la cresta y colgando del labio
  var claws = '';
  for (var i = 0; i < 8; i++) { var t = .3 + i * .1, p = bz(C1, t), a = ang(C1, t) - 1.25; claws += finger(p[0], p[1] - 5, a, 36 + r() * 10, 9, 1.5, 2); }
  for (var j = 0; j < 6; j++) { var t2 = .05 + j / 6, p2 = bz(C2, t2), a2 = ang(C2, t2) - 1.2; claws += finger(p2[0] + 4, p2[1], a2, 42 + r() * 10, 9.5, 1.4, 2); }
  for (var b = 0; b < 7; b++) { var t3 = .35 + b * .1, p3 = bz(C0, t3), a3 = ang(C0, t3) - 1.3; claws += finger(p3[0] + 3, p3[1] - 3, a3, 22 + r() * 6, 8, 1.5, 2); }
  s += '<g fill="' + FO + '" stroke="' + INKL + '" stroke-width=".5">' + claws + '</g>';
  // espuma que cae como nieve sobre el Fuji
  var spray = '';
  for (var d = 0; d < 90; d++) { var sx = 250 + r() * 160, sy = 360 + r() * 290, rr = .8 + r() * 2.4; if (sx < 300 && sy < 420) continue; spray += '<circle cx="' + f(sx) + '" cy="' + f(sy) + '" r="' + f(rr) + '" fill-opacity="' + f(.5 + r() * .5) + '"/>'; }
  s += '<g fill="' + FO + '">' + spray + '</g>';
  // barcas oshiokuri con remeros
  function boat(x, y, a, L) {
    var o = '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ')"><path d="M0 0C' + (L * .3) + ' 6 ' + (L * .7) + ' 6 ' + L + ' -4L' + (L - 6) + ' 6C' + (L * .6) + ' 13 ' + (L * .3) + ' 13 6 8Z" fill="#e6d6ab" stroke="#5a4a2a" stroke-width="1"/>' +
      '<path d="M8 6C' + (L * .35) + ' 10 ' + (L * .65) + ' 10 ' + (L - 8) + ' 3" fill="none" stroke="#5a4a2a" stroke-opacity=".6" stroke-width=".8"/>';
    for (var n = 0; n < 8; n++) { var bx = 16 + n * (L - 30) / 7; o += '<path d="M' + f(bx - 3) + ' 2Q' + f(bx) + ' -6 ' + f(bx + 3) + ' 2Z" fill="#2c4a74"/><circle cx="' + f(bx) + '" cy="-4" r="2.2" fill="#1d1712"/><path d="M' + f(bx - 2) + ' -1h4" stroke="#f3ecda" stroke-width="1.2"/>'; }
    return o + '</g>';
  }
  s += boat(176, 470, 52, 130) + boat(300, 726, -8, 120);
  // la ola pequeña de delante, con la forma del Fuji
  s += '<path d="M60 870C100 840 150 800 188 752C198 738 214 730 228 738C236 744 232 754 224 752C252 790 296 836 340 870Z" fill="' + P + '"/>' +
    '<g fill="none" stroke="' + PX + '" stroke-opacity=".6" stroke-width="1.6"><path d="M110 868C140 836 170 804 200 768M150 868C172 842 192 816 208 790M300 868C276 840 252 812 230 786"/></g>' +
    '<path d="M178 760C190 748 200 736 210 734 220 734 232 748 244 760" fill="none" stroke="' + FO + '" stroke-width="8" stroke-linecap="round"/>';
  var small = '';
  for (var g = 0; g < 7; g++) { var gx = 180 + g * 10, gy = 758 - Math.sin(g / 6 * Math.PI) * 22; small += finger(gx, gy - 2, -Math.PI / 2 + (g - 3) * .42 - .6, 14, 5.5, 1.3, 1); }
  s += '<g fill="' + FO + '" stroke="' + INKL + '" stroke-width=".4">' + small + '</g>';
  s += boat(-24, 800, -6, 150);
  // olas del primer plano a la derecha
  s += '<path d="M290 870C316 832 352 806 396 794 410 790 420 796 420 800V870Z" fill="' + PD + '"/><path d="M300 860C328 828 360 808 400 798" fill="none" stroke="' + FO + '" stroke-width="6" stroke-linecap="round"/>';
  var fr = ''; for (var h = 0; h < 5; h++) { var hx = 316 + h * 20, hy = 838 - h * 9; fr += finger(hx, hy, -1.9 + h * .1, 14, 5, 1.4, 1); }
  s += '<g fill="' + FO + '" stroke="' + INKL + '" stroke-width=".4">' + fr + '</g>';
  return svg(s, 400, 860);
}
// Aki: árboles otoñales, hojas de arce y de ginkgo en el suelo
export var GINKGO_D = "M12 22C12 18 11.5 15 12 13 8 13 3 10 1.5 5 5 2 9 1.5 12 4 15 1.5 19 2 22.5 5 21 10 16 13 12 13 12.5 15 12 18 12 22Z";
// Fujinami: bosque de glicinias de noche (cascadas de flores colgando de los árboles)
export function wisteriaForest() {
  var r = seeded(12), s = '<defs><filter id="bl"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<linearGradient id="rc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e8ff"/><stop offset=".45" stop-color="#c8a8f2"/><stop offset="1" stop-color="#7a4fc2"/></linearGradient></defs>';
  function trunks(n, col, w0, blur) {
    var t = '<g fill="' + col + '"' + (blur ? ' filter="url(#bl)"' : '') + '>';
    for (var i = 0; i < n; i++) { var x = (i + .3 + r() * .4) * 400 / n, w = w0 * (.7 + r() * .6); t += '<path d="M' + (x - w) + ' 860C' + (x - w * .6) + ' 600 ' + (x - w * 1.4) + ' 300 ' + (x - w * .4) + ' 0H' + (x + w * .6) + 'C' + (x + w * 1.2) + ' 300 ' + (x + w * .5) + ' 600 ' + (x + w) + ' 860Z"/>'; }
    return t + '</g>';
  }
  var WCOL = ["#f6eeff", "#e6d3ff", "#d2b6f7", "#bb98ee", "#a37ce0", "#8a62cf"];
  function racemes(n, maxLen, scale, op, blur) {
    var t = '<g opacity="' + op + '"' + (blur ? ' filter="url(#bl)"' : ' filter="url(#gl)"') + '>';
    for (var i = 0; i < n; i++) {
      var x = r() * 420 - 10, y0 = -10 + r() * 70, len = maxLen * (.4 + r() * .6), steps = Math.round(len / (5 * scale));
      for (var k = 0; k < steps; k++) {
        var f = k / steps, w = (8 - f * 6.5) * scale, yy = y0 + k * 5 * scale, cx0 = x + Math.sin(k * .5 + i) * 3 * scale;
        for (var q = 0; q < 3; q++) {
          var ex = cx0 + (r() - .5) * w * 1.8, ey = yy + (r() - .5) * 4 * scale, er = (1.6 + r() * 2.2) * scale * (1 - f * .45);
          var ci = Math.min(5, Math.floor(f * 5 + r() * 1.6));
          t += '<ellipse cx="' + ex.toFixed(1) + '" cy="' + ey.toFixed(1) + '" rx="' + er.toFixed(1) + '" ry="' + (er * .75).toFixed(1) + '" fill="' + WCOL[ci] + '"/>';
        }
      }
    }
    return t + '</g>';
  }
  s += '<ellipse cx="200" cy="10" rx="300" ry="90" fill="#9a74d6" fill-opacity=".35" filter="url(#bl)"/>';
  s += trunks(5, "#2c2046", 18, true) + racemes(46, 280, .8, .5, true) + '<ellipse cx="200" cy="0" rx="260" ry="50" fill="#c9a8f2" fill-opacity=".4" filter="url(#bl)"/>' + trunks(3, "#140e24", 26, false) + racemes(40, 360, 1.1, .95, false);
  s += '<ellipse cx="200" cy="860" rx="320" ry="90" fill="#b48ae8" fill-opacity=".22" filter="url(#bl)"/>';
  for (var p = 0; p < 90; p++) s += '<ellipse cx="' + (r() * 400).toFixed(0) + '" cy="' + (800 + r() * 60).toFixed(0) + '" rx="2.4" ry="1.4" fill="#d9c2ff" fill-opacity="' + (.4 + r() * .5).toFixed(2) + '"/>';
  return svg(s, 400, 860);
}
// Yoru: noche japonesa en pixel art (dibujada en un canvas pequeño y ampliada sin suavizar)
export function pixelNight() {
  var W = 120, H = 260, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  var g = cv.getContext("2d"), r = seeded(77);
  var B = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  var sky = [[0, "#070820"], [.25, "#0d1035"], [.5, "#191a4a"], [.68, "#2a2560"], [.78, "#3d2f6e"]];
  function hex(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
    var t = y / H, i = 0; while (i < sky.length - 2 && t > sky[i + 1][0]) i++;
    var a = sky[i], b = sky[i + 1], f = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    g.fillStyle = f * 16 > B[y % 4][x % 4] ? b[1] : a[1]; g.fillRect(x, y, 1, 1);
  }
  // vía láctea
  for (var m = 0; m < 260; m++) { var u = r(), mx = u * W, my = 20 + u * 120 + (r() - .5) * 26; g.fillStyle = r() > .5 ? "#3a3a78" : "#2b2c66"; g.fillRect(mx | 0, my | 0, 1, 1); }
  // estrellas
  var sc = ["#ffffff", "#e8e4ff", "#fff3c4", "#c9c4ff", "#a9b4ff"];
  for (var s = 0; s < 230; s++) { var sx = r() * W | 0, sy = r() * 175 | 0; g.fillStyle = sc[r() * 5 | 0]; g.fillRect(sx, sy, 1, 1); }
  for (var s2 = 0; s2 < 9; s2++) { var px = 4 + r() * (W - 8) | 0, py = 4 + r() * 150 | 0; g.fillStyle = "#fff6d6"; g.fillRect(px, py, 1, 1); g.fillStyle = "#c9c4ff"; g.fillRect(px - 1, py, 1, 1); g.fillRect(px + 1, py, 1, 1); g.fillRect(px, py - 1, 1, 1); g.fillRect(px, py + 1, 1, 1); }
  // luna
  var cx = 92, cy = 34, R = 9;
  for (var yy = -R - 4; yy <= R + 4; yy++) for (var xx = -R - 4; xx <= R + 4; xx++) {
    var d = Math.sqrt(xx * xx + yy * yy);
    if (d <= R) { g.fillStyle = (xx + yy > 4 && (xx * 7 + yy * 3) % 5 === 0) ? "#e3d9b0" : "#f6efcf"; g.fillRect(cx + xx, cy + yy, 1, 1); }
    else if (d <= R + 3 && (xx + yy) % 2 === 0) { g.fillStyle = "#3b3a7a"; g.fillRect(cx + xx, cy + yy, 1, 1); }
  }
  [[-3, -2, 2], [3, 3, 2], [-2, 4, 1], [4, -4, 1]].forEach(function (c) { g.fillStyle = "#e0d6a8"; g.fillRect(cx + c[0], cy + c[1], c[2], c[2]); });
  // montañas lejanas y colinas
  function ridge(base, amp, col, seed2) { var rr = seeded(seed2); var h = base; for (var x = 0; x < W; x++) { h += (rr() - .5) * amp; h = Math.max(base - 14, Math.min(base + 6, h)); g.fillStyle = col; g.fillRect(x, h | 0, 1, H - h); } }
  ridge(178, 3, "#2a2152", 5); ridge(192, 2.2, "#1a1838", 8); ridge(206, 1.6, "#121229", 11);
  // árboles
  for (var tr = 0; tr < 26; tr++) { var tx = r() * W | 0, th = 4 + r() * 5 | 0, ty = 204 - (r() * 3 | 0); g.fillStyle = "#0d0e22"; for (var k = 0; k < th; k++) g.fillRect(tx - (k >> 1), ty - th + k, k + 1, 1); }
  // torii
  var ox = 16, oy = 190; g.fillStyle = "#8a2a3a"; g.fillRect(ox, oy, 11, 1); g.fillRect(ox - 1, oy - 1, 13, 1); g.fillRect(ox + 1, oy + 2, 9, 1); g.fillRect(ox + 2, oy + 1, 1, 9); g.fillRect(ox + 8, oy + 1, 1, 9);
  // casas con ventanas encendidas
  [[50, 214], [60, 216], [84, 213], [100, 217]].forEach(function (h) { g.fillStyle = "#0a0b1c"; g.fillRect(h[0] - 3, h[1] - 2, 7, 1); g.fillRect(h[0] - 2, h[1] - 3, 5, 1); g.fillRect(h[0] - 1, h[1] - 4, 3, 1); g.fillRect(h[0] - 3, h[1] - 1, 7, 4); g.fillStyle = "#ffd86b"; g.fillRect(h[0] - 1, h[1], 2, 1); });
  // postes y cables
  g.fillStyle = "#07071a"; [[74, 186], [112, 182]].forEach(function (p) { g.fillRect(p[0], p[1], 1, 38); g.fillRect(p[0] - 2, p[1] + 2, 5, 1); });
  for (var cx2 = 0; cx2 < W; cx2++) { var y1 = 190 + Math.round(Math.pow((cx2 - 74) / 38, 2) * 3), y2 = 194 + Math.round(Math.pow((cx2 - 92) / 30, 2) * 2); g.fillStyle = "#07071a"; if (cx2 < 112) g.fillRect(cx2, y1 - 2, 1, 1); g.fillRect(cx2, y2, 1, 1); }
  // arrozales con reflejos
  for (var ry = 222; ry < H; ry++) for (var rx = 0; rx < W; rx++) {
    var row = ((ry - 222) >> 2) % 2;
    g.fillStyle = row ? "#0f1a24" : ((rx + ry) % 2 ? "#13233a" : "#182b44"); g.fillRect(rx, ry, 1, 1);
    if (!row && r() < .03) { g.fillStyle = r() > .5 ? "#c9c4ff" : "#fff3c4"; g.fillRect(rx, ry, 1, 1); }
  }
  for (var gr = 0; gr < 120; gr++) { g.fillStyle = r() > .5 ? "#1f3a2a" : "#2a4a32"; g.fillRect(r() * W | 0, 222 + (r() * 38 | 0), 1, 2); }
  return 'url("' + cv.toDataURL() + '")';
}
// ---- Escenas v5: Sakura (tarta de fresas), Matcha (chasen, tetera y cuenco) y Yuki (nieve retro en pixel art) ----
function strawberry(x, y, sc, rot) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ') scale(' + sc + ')"><path d="M0 -2C-9 -4 -12 6 -8 13 -5 19 0 24 0 24 0 24 5 19 8 13 12 6 9 -4 0 -2Z" fill="#e8435a"/>' +
    '<path d="M-7 -2C-4 -6 -1 -4 0 -3 1 -4 4 -6 7 -2 4 -1 2 0 0 1-2 0-4-1-7-2Z" fill="#6aa84f"/><g fill="#ffd9a0"><circle cx="-4" cy="5" r=".9"/><circle cx="3" cy="4" r=".9"/><circle cx="-1" cy="10" r=".9"/><circle cx="5" cy="11" r=".9"/><circle cx="-5" cy="13" r=".9"/><circle cx="1" cy="16" r=".9"/></g></g>';
}
function cakeSlice(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' +
    '<path d="M0 30L70 10 96 26 96 70 26 92 0 74Z" fill="#fffaf3"/>' +
    '<path d="M0 46L26 56 96 36V46L26 66 0 56Z" fill="#f6d79a"/><path d="M0 64L26 74 96 54V64L26 84 0 74Z" fill="#f6d79a"/>' +
    '<path d="M26 56V92M0 30L26 40 96 26" fill="none" stroke="#ead8c4" stroke-width="1.2"/>' +
    '<path d="M0 30L26 40V92L0 74Z" fill="#fff4ea"/>' +
    '<path d="M2 53A4 4 0 0 1 10 56M12 57A4 4 0 0 1 20 60" fill="#e8435a"/>' +
    '<path d="M4 50C2 48 6 46 8 48M14 54C12 52 16 50 18 52" stroke="#e8435a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M30 14C26 10 34 4 40 8 44 2 54 6 52 12 58 12 58 20 50 22H32C26 22 26 16 30 14Z" fill="#ffffff" stroke="#ead8c4"/>' +
    strawberry(42, 2, 1.1, -8) + '</g>';
}
function sakuraBranch() {
  var s = '<path d="M-10 40C40 30 80 50 120 46S190 30 230 44" fill="none" stroke="#7a4a3a" stroke-width="5" stroke-linecap="round"/><path d="M70 46C80 66 96 74 110 80M150 40C160 24 176 18 190 16" fill="none" stroke="#7a4a3a" stroke-width="3" stroke-linecap="round"/>';
  [[30, 36, 1], [64, 40, .8], [96, 52, 1.1], [112, 82, .8], [138, 42, .9], [176, 22, 1], [196, 18, .7], [214, 46, .9], [12, 30, .7]].forEach(function (b) {
    s += '<g transform="translate(' + b[0] + ' ' + b[1] + ') scale(' + (b[2] * .7) + ') translate(-12 -12)">' + blossom("#f8c3d3", "#e0607e") + '</g>';
  });
  return s;
}
function chasen(x, y, sc) {
  var t = "";
  for (var i = 0; i <= 16; i++) { var a = -1 + i / 8; t += 'M' + (a * 4).toFixed(1) + ' 34C' + (a * 18).toFixed(1) + ' 52 ' + (a * 22).toFixed(1) + ' 70 ' + (a * 8).toFixed(1) + ' 84'; }
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><rect x="-6" y="-30" width="12" height="62" rx="5" fill="#d8bf86"/><path d="M-6 -6H6M-6 20H6" stroke="#a88a52" stroke-width="1.6"/>' +
    '<rect x="-7" y="28" width="14" height="6" rx="2" fill="#2e2a22"/><path d="' + t + '" fill="none" stroke="#e2cd98" stroke-width="1.6"/><path d="M-20 70C-14 86 14 86 20 70" fill="none" stroke="#c9ad72" stroke-width="1.4"/></g>';
}
function kyusu(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><ellipse cx="0" cy="14" rx="40" ry="32" fill="#8c5b3d"/><ellipse cx="-10" cy="4" rx="16" ry="10" fill="#a8735a" fill-opacity=".7"/>' +
    '<path d="M36 6C52 0 60 -10 66 -14 64 -6 58 6 40 20Z" fill="#7a4a30"/><path d="M-38 6L-74 -10 -70 -2 -40 16Z" fill="#5a3a26"/>' +
    '<ellipse cx="0" cy="-16" rx="24" ry="6" fill="#7a4a30"/><circle cx="0" cy="-22" r="5" fill="#5a3a26"/><path d="M-30 34C-10 44 10 44 30 34" fill="none" stroke="#6a4028" stroke-width="2"/></g>';
}
function chawan(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-48 0C-46 30 -26 48 0 48S46 30 48 0Z" fill="#3e3a33"/><path d="M-46 14C-30 24 30 24 46 14" fill="none" stroke="#6b6355" stroke-width="2.5"/>' +
    '<ellipse cx="0" cy="0" rx="48" ry="12" fill="#2a2620"/><ellipse cx="0" cy="1" rx="42" ry="9" fill="#9cc45a"/><ellipse cx="-6" cy="0" rx="22" ry="4" fill="#c3dd8e"/><path d="M-14 48H14V54H-14Z" fill="#3e3a33"/></g>';
}

export function init() {
  window.KANAME_SHAPE = function (name, color) { return svg(SHAPES[name](color), 24, 24); };
}
