/* 雪 Yuki: pixel art de montaña nevada */
import { patchPal } from "./common.js";
export function pixelSnow() {
  var W = 100, H = 215, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  var g = cv.getContext("2d"), img = g.createImageData(W, H), D = img.data;
  function hash(x, y, s) { var h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); }
  function noise(x, y, s) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  function fbm(x, y, s) { return noise(x, y, s) * .5 + noise(x * 2, y * 2, s + 1) * .25 + noise(x * 4, y * 4, s + 2) * .15 + noise(x * 8, y * 8, s + 3) * .1; }
  function hex(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  var C = { sky1: hex("#b9c5ec"), sky2: hex("#dfe5f7"), peach: hex("#f4d9cf"), cloudW: hex("#fbf4f2"), snow: hex("#f6f8fd"), snow2: hex("#dbe2f6"), mid: hex("#b4bfe6"), sh: hex("#8e9bd6"), deep: hex("#6c7bc4"), mist: hex("#eef1fb"),
    pine1: hex("#1d2752"), pine2: hex("#2f3d7c"), pine3: hex("#4f62a8"), pineS: hex("#d8e0f6"), rock1: hex("#8a6e92"), rock2: hex("#64527e"), red1: hex("#d2483c"), red2: hex("#9a2f2e"), eave: hex("#3b3260"), wood: hex("#7a4a52"), lamp: hex("#ffcf8a") };
  function set(x, y, c) { if (x < 0 || y < 0 || x >= W || y >= H) return; var i = (y * W + x) * 4; D[i] = c[0]; D[i + 1] = c[1]; D[i + 2] = c[2]; D[i + 3] = 255; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  // cordillera: dos picos grandes y uno lejano
  function ridge1(x) { var p1 = 18 + Math.abs(x - 66) * 1.25, p2 = 44 + Math.abs(x - 30) * 1.05, m = Math.min(p1, p2) - Math.max(0, 6 - Math.abs(p1 - p2)) * .8; return m + (fbm(x * .12, 1, 3) - .5) * 8; }
  function ridge2(x) { return 70 + Math.abs(x - 78) * .9 + (fbm(x * .2, 2, 5) - .5) * 10; }
  for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
    var c = mix(C.sky1, C.sky2, Math.min(1, y / 90));
    var cl = fbm(x * .07, y * .12, 9) - y / 260;
    if (y < 70 && cl > .5) c = cl > .58 ? C.cloudW : C.peach;
    var r1 = ridge1(x);
    if (y > r1) {
      var slope = ridge1(x + 4) - ridge1(x - 4) + (fbm(x * .1, y * .05, 81) - .5) * 6, depth = y - r1, n = fbm(x * .25, y * .25, 11);
      var lit = slope > 0 ? 1 : 0; // cara iluminada a la izquierda de cada pico
      var t = depth / 55 + (n - .5) * .7;
      c = lit ? (t < .3 ? C.snow : t < .5 ? C.snow2 : t < .75 ? C.mid : C.sh) : (t < .12 ? C.snow2 : t < .32 ? C.mid : t < .6 ? C.sh : C.deep);
      // cárcavas de nieve: vetas diagonales blancas
      if (fbm(x * .5 + y * .35, y * .08, 21) > .66 && depth < 80) c = C.snow;
    }
    var r2 = ridge2(x);
    if (y > r2) { var n2 = fbm(x * .3, y * .3, 13), t2 = (y - r2) / 50 + (n2 - .5) * .5; c = (ridge2(x + 1) - ridge2(x - 1) > 0) ? (t2 < .4 ? C.snow : t2 < .7 ? C.snow2 : C.mid) : (t2 < .3 ? C.snow2 : t2 < .6 ? C.mid : C.sh); }
    // niebla que sube desde el valle
    var mist = Math.max(0, Math.min(1, (y - 125) / 40 + (fbm(x * .06, y * .06, 31) - .5) * 1.4));
    if (mist > 0) c = mix(c, C.mist, Math.min(1, mist * (fbm(x * .1, y * .1, 41) > .45 ? 1 : .7)));
    set(x, y, [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])]);
  }
  // peñasco con la pagoda
  for (var yy = 130; yy < 172; yy++) for (var xx = 30; xx < 100; xx++) { var w = 14 + (yy - 130) * .9 - Math.abs(xx - 66) * 1.1 + (fbm(xx * .3, yy * .3, 51) - .5) * 10 - Math.max(0, yy - 158) * 2.2; if (w > 0) { var nn = fbm(xx * .4, yy * .4, 52); set(xx, yy, nn > .7 ? C.snow : nn > .48 ? C.rock1 : C.rock2); } }
  function px(x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) set(x + i, y + j, c); }
  var base = 132;
  px(52, base - 10, 28, 10, C.wood); for (var cc = 0; cc < 7; cc++) px(53 + cc * 4, base - 10, 1, 10, C.red2); px(58, base - 7, 3, 3, C.lamp); px(70, base - 7, 3, 3, C.lamp);
  [[44, 40], [49, 30], [53, 22], [57, 14]].forEach(function (t, k) {
    var yb = base - 10 - k * 9, x0 = 66 - t[1] / 2 - (k === 0 ? 4 : 0);
    px(x0, yb - 2, t[1], 2, C.red1); px(x0 + 1, yb - 3, t[1] - 2, 1, C.snow); px(x0 - 2, yb - 1, 3, 1, C.red1); px(x0 + t[1] - 1, yb - 1, 3, 1, C.red1);
    px(x0 + 1, yb, t[1] - 2, 1, C.eave);
    if (k > 0) { px(x0 + 3, yb + 1, t[1] - 6, 6, C.wood); px(x0 + 5, yb + 2, 2, 2, C.lamp); px(x0 + t[1] - 7, yb + 2, 2, 2, C.lamp); }
  });
  px(65, base - 52, 2, 10, C.eave); px(64, base - 54, 4, 1, C.red1);
  // pinos nevados que enmarcan
  function pine(cx, top, hgt, wid, cols, s2) {
    for (var j = 0; j < hgt; j++) { var lvl = (j % 9) / 9, ww = Math.round(wid * (j / hgt) * (.55 + lvl * .6)); for (var i = -ww; i <= ww; i++) { var n3 = fbm((cx + i) * .4, (top + j) * .4, s2); if (n3 < .25 && Math.abs(i) > ww * .6) continue; set(cx + i, top + j, n3 > .7 && lvl < .35 ? C.pineS : (i < 0 ? cols[0] : cols[1])); } }
  }
  pine(4, 40, 160, 16, [C.pine1, C.pine2], 61); pine(18, 96, 120, 14, [C.pine1, C.pine2], 62); pine(-4, 120, 100, 18, [C.pine1, C.pine1], 63);
  pine(90, 150, 70, 14, [C.pine3, C.pine2], 64); pine(78, 172, 50, 11, [C.pine3, C.pine3], 65); pine(60, 186, 40, 10, [C.pine3, C.pine3], 66); pine(28, 182, 40, 10, [C.pine3, C.pine2], 67);
  // nieve y niebla del primer plano
  for (var y3 = 190; y3 < H; y3++) for (var x3 = 0; x3 < W; x3++) { if (fbm(x3 * .08, y3 * .1, 71) + (y3 - 190) / 40 > .8) set(x3, y3, fbm(x3 * .3, y3 * .3, 72) > .55 ? C.snow : C.mist); }
  g.putImageData(img, 0, 0);
  return 'url("' + cv.toDataURL() + '")';
}

export function init() {
  patchPal("yuki", {
    bg: "#e4e9f8", surface: "#fbfcff", raised: "#e9edf9", hairline: "#c6cfee", text: "#1d2752", muted: "#4f5d94", faint: "#8a96c4",
    accent: "#c8443a", status: "#4f62a8", grad: "linear-gradient(180deg, #b9c5ec 0%, #dfe5f7 40%, #eef1fb 100%)", surfA: "e0",
    pantone: "Inspirada en PANTONE Very Peri 17-3938 (sombras de la nieve), Bright White 11-0601 (niebla) y Fiery Red 18-1664 (pagoda)"
  });
}
