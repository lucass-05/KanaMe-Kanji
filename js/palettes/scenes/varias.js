/* Repaso del resto de paletas: más detalle y colores estudiados */
import { GINKGO_D, seeded, svg } from "../shapes.js";
import { f } from "../medals.js";
import { patchPal } from "./common.js";
function addLayer(id, fn) { // capa de detalle por encima del fondo que ya tiene la paleta
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id !== id) return; var old = p.scene; p.scene = function () { return fn() + (old ? ", " + old() : ""); }; });
}
export var MINCHO = "Hiragino Mincho ProN, Yu Mincho, Noto Serif CJK JP, Noto Sans CJK JP, serif";

// ---------- 稲荷 Inari: camino de piedra, faroles tōrō e inscripciones en los torii ----------
function toro(x, y, sc) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" stroke="#5f574c" stroke-width="1"><rect x="-14" y="-6" width="28" height="6" fill="#a39886"/><rect x="-5" y="-40" width="10" height="34" fill="#b3a996"/>' +
    '<rect x="-12" y="-46" width="24" height="6" fill="#a39886"/><rect x="-10" y="-64" width="20" height="18" fill="#c4baa8"/><rect x="-5" y="-60" width="10" height="10" fill="#ffd27a" stroke="none"/>' +
    '<path d="M-20 -64L0 -78 20 -64Z" fill="#8b806f"/><circle cx="0" cy="-81" r="3" fill="#8b806f"/><circle cx="0" cy="-55" r="18" fill="#ffd27a" fill-opacity=".18" stroke="none"/></g>';
}

// ---------- 蓮 Hasu: flores de loto más ricas, libélulas y gotas sobre las hojas ----------
export function lotusFlower(x, y, sc) {
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ') translate(-32 -40)">';
  var petal = function (rot, len, wid, c1, c2, id) { return '<path d="M32 42C' + (32 - wid) + ' ' + (42 - len * .45) + ' ' + (32 - wid * .4) + ' ' + (42 - len * .9) + ' 32 ' + (42 - len) + 'C' + (32 + wid * .4) + ' ' + (42 - len * .9) + ' ' + (32 + wid) + ' ' + (42 - len * .45) + ' 32 42Z" transform="rotate(' + rot + ' 32 42)" fill="url(#' + id + ')" stroke="#c94f80" stroke-opacity=".45" stroke-width=".7"/>'; };
  s += '<defs><linearGradient id="lpA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6f9"/><stop offset=".55" stop-color="#f7bfd3"/><stop offset="1" stop-color="#e2638f"/></linearGradient><linearGradient id="lpB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fbd3e1"/><stop offset="1" stop-color="#ea7ea3"/></linearGradient></defs>';
  [-74, 74, -52, 52].forEach(function (r0) { s += petal(r0, 30, 12, 0, 0, "lpA"); });
  [-30, 30].forEach(function (r0) { s += petal(r0, 36, 12, 0, 0, "lpB"); });
  s += '<ellipse cx="32" cy="22" rx="8" ry="5" fill="#f2c24a"/><g fill="#b88a1e"><circle cx="29" cy="21" r=".9"/><circle cx="32" cy="20" r=".9"/><circle cx="35" cy="21" r=".9"/><circle cx="31" cy="23" r=".9"/><circle cx="34" cy="23" r=".9"/></g>';
  s += petal(-10, 40, 11, 0, 0, "lpB") + petal(10, 40, 11, 0, 0, "lpB");
  return s + '</g>';
}
function dragonfly(x, y, sc, rot) {
  return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')"><g fill="#e6f4ff" fill-opacity=".55" stroke="#7fa8c8" stroke-width=".6"><ellipse cx="-14" cy="-4" rx="14" ry="4" transform="rotate(-10)"/><ellipse cx="14" cy="-4" rx="14" ry="4" transform="rotate(10)"/><ellipse cx="-13" cy="4" rx="12" ry="3.4" transform="rotate(12)"/><ellipse cx="13" cy="4" rx="12" ry="3.4" transform="rotate(-12)"/></g>' +
    '<rect x="-1.6" y="-8" width="3.2" height="40" rx="1.6" fill="#2b5f8a"/><circle cx="0" cy="-9" r="3" fill="#1f4a6e"/><path d="M-1.6 4H1.6M-1.6 10H1.6M-1.6 16H1.6M-1.6 22H1.6" stroke="#8fc1e3" stroke-width=".8"/></g>';
}

// ---------- 温泉 Onsen: pinos nevados, cubo de madera con toalla y otro macaco ----------
function snowPine(x, y, sc) {
  var o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><rect x="-4" y="-20" width="8" height="24" fill="#4a3a2e"/>';
  for (var k = 0; k < 5; k++) { var w = 40 - k * 7, yy = -16 - k * 22; o += '<path d="M' + (-w) + ' ' + yy + 'L0 ' + (yy - 34) + 'L' + w + ' ' + yy + 'Z" fill="#2f5a4a"/><path d="M' + (-w + 4) + ' ' + (yy - 2) + 'Q0 ' + (yy - 14) + ' ' + (w - 4) + ' ' + (yy - 2) + 'L' + (w * .45) + ' ' + (yy - 18) + 'L0 ' + (yy - 30) + 'L' + (-w * .45) + ' ' + (yy - 18) + 'Z" fill="#ffffff"/>'; }
  return o + '</g>';
}

// ---------- 富士 Fuji: la pagoda Chūreitō entre cerezos ----------
function pagoda(x, y, sc) {
  var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">';
  for (var k = 0; k < 5; k++) { var w = 46 - k * 6, yy = -k * 28; s += '<rect x="' + f(-w * .38) + '" y="' + (yy - 22) + '" width="' + f(w * .76) + '" height="22" fill="#c8372f"/><path d="M' + f(-w * .38) + ' ' + (yy - 12) + 'H' + f(w * .38) + '" stroke="#f3e4c8" stroke-width="1.2"/>' +
    '<path d="M' + (-w) + ' ' + (yy - 20) + 'Q0 ' + (yy - 30) + ' ' + w + ' ' + (yy - 20) + 'L' + f(w * .7) + ' ' + (yy - 28) + 'H' + f(-w * .7) + 'Z" fill="#3a2a2a"/>'; }
  return s + '<path d="M0 -160V-186" stroke="#3a2a2a" stroke-width="3"/><path d="M-3 -168H3M-3 -175H3M-3 -182H3" stroke="#c9a24a" stroke-width="2"/></g>';
}
function cherryTree(x, y, sc, sd) {
  var r = seeded(sd), o = '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-4 0C-6 -30 -2 -50 -10 -70M0 -40C10 -54 20 -60 30 -70M-6 -56C-20 -64 -30 -70 -36 -82" fill="none" stroke="#5a3a2e" stroke-width="5" stroke-linecap="round"/>';
  for (var i = 0; i < 140; i++) { var a = r() * Math.PI * 2, d = Math.sqrt(r()), px = Math.cos(a) * d * 52, py = -80 + Math.sin(a) * d * 32; o += '<circle cx="' + f(px) + '" cy="' + f(py) + '" r="' + f(2.4 + r() * 3.2) + '" fill="' + ["#f6c3d0", "#f9d7df", "#f2a9bd", "#ffffff"][(r() * 4) | 0] + '" fill-opacity=".92"/>'; }
  return o + '</g>';
}

// ---------- 秋 Aki: arces con copas de hojas de arce, puente rojo y hojas cayendo ----------
export function akiScene() {
  var MAPLE = "M12 1L13.6 6.5 18 4 16.6 9 22.5 8.5 18.5 12.5 20.5 14 14 14.5 13 17 12.6 23H11.4L11 17 10 14.5 3.5 14 5.5 12.5 1.5 8.5 7.4 9 6 4 10.4 6.5Z";
  var r = seeded(33), s = '<defs><radialGradient id="ak"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".6"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>' +
    '<circle cx="290" cy="300" r="190" fill="url(#ak)"/>';
  // montes lejanos en bruma y templo
  s += '<path d="M-10 560C60 520 120 540 180 510S300 500 410 530V860H-10Z" fill="#6a3418" fill-opacity=".45"/>' +
    '<g transform="translate(300 520)" fill="#3a1a0c" fill-opacity=".7"><path d="M-40 0H40V-10H-40Z"/><path d="M-50 -10L0 -34 50 -10Z"/><path d="M-30 -34H30V-40H-30Z"/><path d="M-38 -40L0 -58 38 -40Z"/></g>';
  var cols = ["#e8562a", "#f28a2e", "#c8302a", "#e46a2e", "#b8282a"];
  [[60, 540, 1, 0], [200, 490, 1.25, 1], [345, 560, .95, 2], [128, 620, .8, 3], [282, 630, .75, 4]].forEach(function (t, ti) {
    var x = t[0], y = t[1], k = t[2], gold = ti === 1;
    s += '<path d="M' + (x - 6 * k) + ' 860C' + (x - 4 * k) + ' ' + (y + 120) + ' ' + (x - 10 * k) + ' ' + (y + 40) + ' ' + (x - 2 * k) + ' ' + y + 'L' + (x + 4 * k) + ' ' + y + 'C' + (x + 10 * k) + ' ' + (y + 40) + ' ' + (x + 6 * k) + ' ' + (y + 120) + ' ' + (x + 8 * k) + ' 860Z" fill="#2a160c"/>' +
      '<path d="M' + x + ' ' + (y + 20) + 'Q' + (x - 20 * k) + ' ' + (y - 10 * k) + ' ' + (x - 44 * k) + ' ' + (y - 40 * k) + 'M' + x + ' ' + (y + 10) + 'Q' + (x + 26 * k) + ' ' + (y - 20 * k) + ' ' + (x + 48 * k) + ' ' + (y - 52 * k) + 'M' + x + ' ' + y + 'L' + (x + 4 * k) + ' ' + (y - 84 * k) + '" stroke="#2a160c" stroke-width="' + (4 * k) + '" stroke-linecap="round" fill="none"/>';
    for (var i = 0; i < 150; i++) {
      var a = r() * Math.PI * 2, d = Math.sqrt(r()) * 82 * k, cx = x + Math.cos(a) * d * 1.25, cy = y - 72 * k + Math.sin(a) * d * .78, sc = (.8 + r() * .7) * k;
      var c = gold ? (r() > .4 ? "#ffd25a" : "#f6b73c") : cols[Math.floor(r() * 5)], shade = cy > y - 60 * k ? .78 : 1;
      s += '<path transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + f(r() * 360) + ') scale(' + f(sc) + ') translate(-12 -12)" d="' + (gold ? GINKGO_D : MAPLE) + '" fill="' + c + '" fill-opacity="' + f((.75 + r() * .25) * shade) + '"/>';
    }
  });
  // puente rojo sobre un arroyo
  s += '<path d="M-10 770C100 756 300 756 410 770V800H-10Z" fill="#3a5a7a" fill-opacity=".55"/><g transform="translate(200 772)"><path d="M-110 0Q0 -46 110 0" fill="none" stroke="#c8302a" stroke-width="7"/><path d="M-110 -12Q0 -58 110 -12" fill="none" stroke="#c8302a" stroke-width="3"/>';
  for (var q = -4; q <= 4; q++) { var bx = q * 25, by = -46 * (1 - Math.pow(bx / 110, 2)); s += '<path d="M' + bx + ' ' + f(by) + 'V' + f(by - 12) + '" stroke="#c8302a" stroke-width="3"/>'; }
  s += '</g><rect y="800" width="400" height="60" fill="#4a2512" fill-opacity=".8"/>';
  for (var l = 0; l < 120; l++) {
    var lx = r() * 410 - 5, ly = 790 + r() * 70, rot = r() * 360, scl = .6 + r() * .7, g = r() > .6;
    var cc = g ? (r() > .5 ? "#ffd25a" : "#f6b73c") : cols[Math.floor(r() * 5)];
    s += '<path transform="translate(' + f(lx) + ' ' + f(ly) + ') rotate(' + f(rot) + ') scale(' + f(scl) + ') translate(-12 -12)" d="' + (g ? GINKGO_D : MAPLE) + '" fill="' + cc + '" fill-opacity=".9"/>';
  }
  return svg(s, 400, 860);
}

export function init() {
  addLayer("inari", function () {
    var s = '<path d="M118 860L192 668H208L282 860Z" fill="#cfc4b0"/><g stroke="#b3a68f" stroke-width="1.2">';
    for (var k = 0; k < 9; k++) { var t = k / 9, y = 860 - Math.pow(t, .8) * 192, hw = 82 - t * 74; s += '<path d="M' + f(200 - hw) + ' ' + f(y) + 'H' + f(200 + hw) + '"/>'; }
    s += '<path d="M200 860V668M160 860L196 668M240 860L204 668" stroke-opacity=".6"/></g>';
    // inscripciones negras de los donantes en las columnas del primer torii
    [42, 358].forEach(function (x) { s += '<text x="' + x + '" y="470" font-family="' + MINCHO + '" font-size="15" fill="#1d1712" fill-opacity=".75" writing-mode="tb" text-anchor="start" letter-spacing="2">奉納稲荷大神</text>'; });
    s += toro(118, 842, .8) + toro(282, 842, .8);
    return svg(s, 400, 860);
  });
  patchPal("inari", { accent: "#d9412b", status: "#c8371f", pantone: "Inspirada en PANTONE Tangerine Tango 17-1463 (bermellón de los torii) y Sand Dollar 13-1106 (washi)" });

  // ---------- 紫陽花 Ajisai: muñeco teru teru bōzu, paraguas wagasa y una rana ----------
  addLayer("ajisai", function () {
    var s = '<path d="M352 0V120" stroke="#8a8fb8" stroke-width="1"/><g transform="translate(352 140)"><circle cx="0" cy="0" r="17" fill="#fbfbff" stroke="#9aa0c8" stroke-width="1.2"/><path d="M-12 10C-24 30 -20 44 -10 46 0 40 0 40 10 46 20 44 24 30 12 10Z" fill="#fbfbff" stroke="#9aa0c8" stroke-width="1.2"/>' +
      '<path d="M-12 11Q0 16 12 11" fill="none" stroke="#d46a8a" stroke-width="2"/><circle cx="-6" cy="-2" r="1.6" fill="#3a3d5c"/><circle cx="6" cy="-2" r="1.6" fill="#3a3d5c"/><path d="M-4 5Q0 8 4 5" fill="none" stroke="#3a3d5c" stroke-width="1.2"/></g>';
    // wagasa rojo abierto
    s += '<g transform="translate(300 712) rotate(-18)"><path d="M-70 0A70 34 0 0 1 70 0Z" fill="#c8372f"/>';
    for (var k = 0; k <= 8; k++) { var a = Math.PI + k * Math.PI / 8; s += '<path d="M0 -30L' + f(Math.cos(a) * 70) + ' ' + f(Math.sin(a) * 34 * -1 * -1) + '" stroke="#8a221c" stroke-width="1"/>'; }
    s += '<path d="M-42 -14A42 20 0 0 1 42 -14" fill="none" stroke="#f6efe4" stroke-width="6"/><path d="M-70 0A70 34 0 0 1 70 0" fill="none" stroke="#8a221c" stroke-width="1.4"/><path d="M0 -34V0M0 0V60" stroke="#6b4a2a" stroke-width="3"/><circle cx="0" cy="-34" r="3" fill="#6b4a2a"/></g>';
    // ranita sobre una hoja
    s += '<g transform="translate(70 640)"><ellipse cx="0" cy="0" rx="13" ry="9" fill="#7fbf5a"/><circle cx="-7" cy="-7" r="4.5" fill="#7fbf5a"/><circle cx="7" cy="-7" r="4.5" fill="#7fbf5a"/><circle cx="-7" cy="-8" r="2" fill="#1d2a1a"/><circle cx="7" cy="-8" r="2" fill="#1d2a1a"/><path d="M-5 2Q0 5 5 2" fill="none" stroke="#3a6a2a" stroke-width="1"/><ellipse cx="-4" cy="4" rx="2" ry="1" fill="#f2a3b8" fill-opacity=".7"/></g>';
    return svg(s, 400, 860);
  });
  patchPal("ajisai", { accent: "#6667ab", status: "#5a5ba0", pantone: "Inspirada en PANTONE Very Peri 17-3938 (acento) y Serenity 15-3919 (lluvia)" });
  addLayer("hasu", function () {
    var s = dragonfly(90, 470, 1, -30) + dragonfly(330, 300, .8, 40);
    [[70, 600], [300, 560], [190, 690], [330, 760]].forEach(function (p) { s += '<ellipse cx="' + (p[0] + 8) + '" cy="' + (p[1] + 4) + '" rx="3" ry="2.2" fill="#e8f6ff" fill-opacity=".85"/><circle cx="' + (p[0] + 7) + '" cy="' + (p[1] + 3) + '" r=".8" fill="#fff"/>'; });
    // vaina de semillas del loto
    s += '<g transform="translate(40 700)"><path d="M0 0V160" stroke="#3f8f7e" stroke-width="3"/><path d="M-16 0C-16 -14 16 -14 16 0Z" fill="#9fc79a" stroke="#3f8f7e"/><g fill="#5f8f5a"><circle cx="-8" cy="-5" r="2"/><circle cx="0" cy="-7" r="2"/><circle cx="8" cy="-5" r="2"/><circle cx="-3" cy="-2" r="1.6"/><circle cx="4" cy="-2" r="1.6"/></g></g>';
    return svg(s, 400, 860);
  });
  patchPal("hasu", { accent: "#c74375", status: "#0f4c81", pantone: "Inspirada en PANTONE Fuchsia Rose 17-2031 (loto) y Classic Blue 19-4052 (agua)" });

  // ---------- 花火 Hanabi: gente en yukata mirando los fuegos desde la orilla ----------
  addLayer("hanabi", function () {
    var s = '<g fill="#04051a">';
    [[30, 700, 1, 0], [52, 702, .9, 1], [76, 698, 1.05, 2], [104, 703, .8, 0], [126, 700, 1, 3], [160, 704, .9, 1]].forEach(function (p) {
      s += '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')"><circle cx="0" cy="-30" r="5"/><path d="M-6 -24H6L8 0H-8Z"/>' + (p[3] === 1 ? '<circle cx="9" cy="-22" r="5"/><path d="M8 -22L5 -14" stroke="#04051a" stroke-width="1.2"/>' : '') + (p[3] === 2 ? '<path d="M-2 -38C-6 -44 6 -44 2 -38Z"/>' : '') + '</g>';
    });
    s += '</g><g>';
    [[38, 676, "#ff8fb1"], [86, 672, "#7fe0ff"], [134, 676, "#ffd86b"]].forEach(function (c) { s += '<path d="M' + c[0] + ' ' + c[1] + 'h10v8h-10Z" fill="' + c[2] + '" fill-opacity=".6"/>'; });
    return svg(s + '</g>', 400, 860);
  });
  patchPal("hanabi", { pantone: "Inspirada en PANTONE Classic Blue 19-4052 (noche) y Mimosa 14-0848 (oro de los fuegos)" });

  // ---------- 藤波 Fujinami: farol de piedra encendido y senda bajo las glicinias ----------
  addLayer("fuji", function () {
    var s = '<defs><radialGradient id="tl"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".75"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient></defs>';
    
    s += '<circle cx="78" cy="772" r="70" fill="url(#tl)"/>' + toro(78, 830, 1).replace(/#ffd27a/g, "#ffd9a0").replace(/#a39886|#b3a996|#c4baa8|#8b806f/g, "#3a2f55");
    for (var i = 0; i < 18; i++) { var r = seeded(i + 4); s += '<circle cx="' + f(40 + r() * 330) + '" cy="' + f(560 + r() * 260) + '" r="1.6" fill="#fff2b0" fill-opacity="' + f(.4 + r() * .6) + '"/>'; }
    return svg(s, 400, 860);
  });
  patchPal("fuji", { pantone: "Inspirada en PANTONE Ultra Violet 18-3838 (noche) y Radiant Orchid 18-3224 (glicinia)" });
  addLayer("onsen", function () {
    var s = snowPine(18, 660, 1.1) + snowPine(384, 670, 1.25) + snowPine(54, 650, .7);
    s += '<g transform="translate(112 668)"><path d="M-14 -16H14L11 0H-11Z" fill="#c89a62" stroke="#7a5a34"/><path d="M-14 -12H14M-13 -5H13" stroke="#5a4028" stroke-width="1.6"/><path d="M-10 -16C-8 -24 8 -24 10 -16" fill="#fbfbfb" stroke="#c9d3d6"/></g>';
    // segundo macaco
    s += '<g transform="translate(330 706) scale(.8)"><path d="M-20 6Q-22 -22 0 -26 22 -22 20 6Z" fill="#a8825f"/><circle cx="0" cy="-32" r="15" fill="#a8825f"/><path d="M-9 -34Q-9 -24 0 -22 9 -24 9 -34 9 -40 0 -40 -9 -40 -9 -34Z" fill="#e7a3a0"/><circle cx="-4" cy="-33" r="1.3" fill="#2a1a12"/><circle cx="4" cy="-33" r="1.3" fill="#2a1a12"/><path d="M-13 -45Q0 -52 13 -45Q8 -42 0 -43 -8 -42 -13 -45Z" fill="#fff"/><path d="M-22 6Q0 10 22 6V10H-22Z" fill="#3f9a9a" fill-opacity=".8"/></g>';
    return svg(s, 400, 860);
  });
  patchPal("onsen", { accent: "#2f8f8c", pantone: "Inspirada en PANTONE Turquoise 15-5519 (agua termal) y Aqua Sky 14-4811 (vapor)" });
  if (0) addLayer("fujisan", function () {
    var s = cherryTree(300, 860, 1.3, 3) + cherryTree(380, 840, 1, 5) + cherryTree(170, 870, 1.1, 7) + pagoda(70, 846, 1.25) + cherryTree(-10, 870, 1.2, 9);
    return svg(s, 400, 860);
  });
  patchPal("fujisan", { pantone: "Inspirada en PANTONE Mocha Mousse 17-1230 (tierra) y Cerulean 15-4020 (cielo)" });

  // ---------- 祭 Matsuri: torre yagura con su tambor taiko y niños con bolsas de pececitos ----------
  addLayer("matsuri", function () {
    var s = '<g transform="translate(200 742)"><path d="M-50 0L-40 -90H40L50 0Z" fill="#2a1520"/><rect x="-56" y="-104" width="112" height="16" fill="#3a1d28"/>';
    for (var k = 0; k < 8; k++) s += '<rect x="' + (-52 + k * 13) + '" y="-88" width="13" height="18" fill="' + (k % 2 ? "#fff3dc" : "#e8553a") + '"/>';
    s += '<path d="M-60 -104L0 -140 60 -104Z" fill="#1a0f16"/><ellipse cx="0" cy="-118" rx="14" ry="10" fill="#c8372f"/><ellipse cx="0" cy="-118" rx="8" ry="6" fill="#f2d39a"/></g>';
    // niños con bolsitas de kingyo
    [[90, 860, 1], [300, 860, -1]].forEach(function (c) { s += '<g transform="translate(' + c[0] + ' ' + c[1] + ') scale(' + c[2] + ' 1)" fill="#120a14"><circle cx="0" cy="-58" r="8"/><path d="M-9 -50H9L12 0H-12Z"/><path d="M10 -40L18 -26" stroke="#120a14" stroke-width="2"/><path d="M14 -26C10 -20 12 -12 18 -12 24 -12 26 -20 22 -26Z" fill="#cfe9ff" fill-opacity=".75"/><path d="M16 -18Q18 -21 21 -18Q18 -15 16 -18Z" fill="#ff6a3a"/></g>'; });
    return svg(s, 400, 860);
  });
  patchPal("matsuri", { accent: "#ff6f61", pantone: "Inspirada en PANTONE Living Coral 16-1546 (farolillos) y Ultra Violet 18-3838 (anochecer)" });
  patchPal("momiji", { pantone: "Inspirada en PANTONE Marsala 18-1438 (fondo) y Tangerine Tango 17-1463 (arces)" });

  // ---------- 龍 Ryū: montañas en la niebla y nubes con borde de oro ----------
  if (0) addLayer("ryu", function () {
    var s = '<g fill="#0e2a28" fill-opacity=".9"><path d="M-10 860V700L40 620 70 660 110 560 150 640 190 600 230 680 260 640 300 700 340 620 380 680 410 650V860Z"/></g>' +
      '<path d="M110 560L120 590 100 600ZM340 620L350 650 330 655Z" fill="#bff3df" fill-opacity=".25"/>';
    [[60, 760], [250, 720], [150, 820]].forEach(function (c) { s += '<g transform="translate(' + c[0] + ' ' + c[1] + ') scale(2)" fill="#0e3430" fill-opacity=".95" stroke="#e6b64a" stroke-width=".9"><path d="M0 0C-4 -14 12 -22 20 -12 26 -24 46 -22 46 -8 58 -14 70 -2 62 8H-2C-12 8 -12 -2 0 0Z"/><path d="M14 -2C12 -8 20 -10 22 -5M38 -2C37 -9 46 -10 47 -4" fill="none"/></g>'; });
    return svg(s, 400, 860);
  });
  patchPal("ryu", { pantone: "Inspirada en PANTONE Emerald 17-5641 (jade) y Mimosa 14-0848 (oro)" });

  // ---------- colores estudiados del resto ----------
  patchPal("sumi", { pantone: "Tinta sumi y bermellón: PANTONE Jet Black 19-0303 y Tangerine Tango 17-1463" });
  patchPal("shiro", { pantone: "Blanco y gris: PANTONE Bright White 11-0601 y Ultimate Gray 17-5104" });
  patchPal("kaguya", { pantone: "Inspirada en PANTONE Peach Fuzz 13-1023 (luna) y Rose Quartz 13-1520 (kimono)" });
  patchPal("daruma", { pantone: "Inspirada en PANTONE True Red 19-1664 y Chili Pepper 19-1557 (rojos de laca)" });
  patchPal("yuki", { pantone: "Inspirada en PANTONE Cerulean 15-4020 (hielo) y Bright White 11-0601 (nieve)" });
  patchPal("maneki", { pantone: "Inspirada en PANTONE Mimosa 14-0848 (koban) y True Red 19-1664 (collar)" });
  patchPal("umi", { pantone: "La estampa de Hokusai: azul de Prusia (PANTONE Classic Blue 19-4052) y papel Sand Dollar 13-1106" });
  patchPal("tanabata", { pantone: "Inspirada en PANTONE Very Peri 17-3938 (cielo) e Illuminating 13-0647 (estrellas)" });
  patchPal("yoru", { pantone: "Inspirada en PANTONE Classic Blue 19-4052 (noche) e Illuminating 13-0647 (luna)" });
  patchPal("kin", { pantone: "Laca negra y pan de oro: PANTONE Jet Black 19-0303 y Mimosa 14-0848" });
}
