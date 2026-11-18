/* Motor de paletas: fondo decorado, lluvia de efectos y aplicar una paleta (window.applyKanamePalette) */
import { akiScene } from "./scenes/varias.js";
import { bigWave, edoHerons, edoKoi, frost, fujiScene, greatWave, kaguyaScene, koiSprite, kumo, lotusScene, pixelNight, svg, wave, wisteriaForest } from "./shapes.js";
import { koiWater } from "./scenes/koi.js";
import { matchaScene, sakuraScene } from "./scenes/sakura-matcha.js";
import { pixelSnow } from "./scenes/yuki.js";
  function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function node(cls, style) { var e = document.createElement("div"); if (cls) e.className = cls; if (style) e.setAttribute("style", style); return e; }

// Fondo decorativo de la paleta
function buildDecor(pal) {
  var d = document.getElementById("decor");
  if (!d) { d = node(); d.id = "decor"; d.setAttribute("aria-hidden", "true"); document.body.insertBefore(d, document.body.firstChild); }
  d.innerHTML = "";
  d.style.background = pal.grad || "transparent";
  if (pal.id === "sumi") return;
  if (pal.tile) {
    var t = node("tile"); t.style.backgroundImage = pal.tile; t.style.backgroundSize = pal.tileSize;
    if (pal.tileOpacity) t.style.opacity = pal.tileOpacity;
    if (pal.tileMask) { t.style.webkitMaskImage = pal.tileMask; t.style.maskImage = pal.tileMask; }
    d.appendChild(t);
  }
  if (pal.bamboo) { var bb = node("bamboo"); bb.style.backgroundImage = pal.bamboo; d.appendChild(bb); }
  if (pal.wisteria) { var w = node("wisteria"); w.style.backgroundImage = pal.wisteria; d.appendChild(w); }
  if (pal.mark) { var m = node("mark"); m.textContent = pal.mark; d.appendChild(m); }
  if (pal.steam) for (var s = 0; s < 3; s++) d.appendChild(node("steam", "left:" + (18 + s * 26) + "%;animation-delay:" + (-s * 4.5) + "s;animation-duration:" + (13 + s * 2) + "s"));
  if (pal.matchaDust) d.appendChild(node("dust"));
  if (pal.liquid) {
    d.appendChild(node("tea-body"));
    d.appendChild(node("wave tw2", "background-image:" + wave("#cfe5a6")));
    d.appendChild(node("wave tw1", "background-image:" + wave("#a9cf6a")));
    for (var bq = 0; bq < 7; bq++) d.appendChild(node("foam", "left:" + rnd(3, 95) + "%;width:" + rnd(3, 7) + "px;height:" + rnd(3, 7) + "px;animation-delay:" + (-rnd(0, 6)) + "s;animation-duration:" + rnd(4, 7) + "s"));
  }
  if (pal.waves) { d.appendChild(node("wave w1", "background-image:" + wave("rgba(63,193,187,.07)"))); d.appendChild(node("wave w2", "background-image:" + wave("rgba(162,215,221,.05)"))); }
  if (pal.moon) d.appendChild(node("moon"));
  if (pal.stars) {
    for (var i = 0; i < 46; i++) {
      var sz = rnd(1, 2.6);
      if (i % 8 === 0) { var s4 = rnd(9, 15); d.appendChild(node("star star4", "left:" + rnd(4, 94) + "%;top:" + rnd(4, 80) + "%;width:" + s4 + "px;height:" + s4 + "px;background-image:" + window.KANAME_SHAPE("star", "#fff3cf") + ";animation-duration:" + rnd(3, 6) + "s;animation-delay:" + (-rnd(0, 6)) + "s;--o:.9")); continue; }
      d.appendChild(node("star", "left:" + rnd(0, 100) + "%;top:" + rnd(0, 92) + "%;width:" + sz + "px;height:" + sz + "px;animation-duration:" + rnd(2.5, 6) + "s;animation-delay:" + (-rnd(0, 6)) + "s;--o:" + rnd(0.45, 0.95)));
    }
    d.appendChild(node("shoot"));
  }
  if (pal.shimmer) d.appendChild(node("shimmer"));
  if (pal.rays) d.appendChild(node("godrays", "--rc:" + pal.rays));
  if (pal.mist) { d.appendChild(node("mist m1", "--mc:" + pal.mist)); d.appendChild(node("mist m2", "--mc:" + pal.mist)); }
  if (pal.caustics) { d.appendChild(node("caus c1")); d.appendChild(node("caus c2")); }
  if (pal.nebula) d.appendChild(node("nebula"));
  if (pal.mountains) {
    d.appendChild(node("mount", "background-image:" + svg('<path d="M0 120V70L40 48 70 62 120 20 160 52 190 40 240 78 280 55 330 30 370 58 400 50V120Z" fill="#5a160c" fill-opacity=".55"/><path d="M0 120V92L50 70 90 86 140 60 200 90 250 72 300 94 350 76 400 88V120Z" fill="#2c0905" fill-opacity=".8"/>', 400, 120)));
  }
  if (pal.corners) {
    var c = svg('<g fill="none" stroke="#f5c84c" stroke-linecap="round"><path d="M4 70V12Q4 4 12 4H70" stroke-width="1.6"/><path d="M10 52V18Q10 10 18 10H52" stroke-width=".8" stroke-opacity=".7"/><path d="M16 16h5v5h-5z" transform="rotate(45 18.5 18.5)" fill="#f5c84c" fill-opacity=".6" stroke-width=".6"/><circle cx="4" cy="76" r="1.6" fill="#f5c84c"/><circle cx="76" cy="4" r="1.6" fill="#f5c84c"/></g>', 80, 80);
    ["tl", "tr", "bl", "br"].forEach(function (k) { d.appendChild(node("corner " + k, "background-image:" + c)); });
  }
  if (pal.sheen) { var sh = node("sheen"); sh.style.webkitMaskImage = pal.sheen; sh.style.maskImage = pal.sheen; sh.style.webkitMaskSize = pal.sheenSize || pal.tileSize; sh.style.maskSize = pal.sheenSize || pal.tileSize; d.appendChild(sh); }
  if (pal.glints) for (var g = 0; g < 16; g++) {
    var gs = rnd(10, 22);
    d.appendChild(node("glint", "left:" + rnd(2, 96) + "%;top:" + rnd(3, 95) + "%;width:" + gs + "px;height:" + gs + "px;background-image:" + window.KANAME_SHAPE("star", pick(pal.glintColors || ["#fff6d0", "#ffe48f", "#ffffff"])) + ";animation-duration:" + rnd(5, 10) + "s;animation-delay:" + (-rnd(0, 10)) + "s"));
  }
  if (pal.relief) { var rl = node("tile relief"); rl.style.backgroundImage = pal.relief; rl.style.backgroundSize = "260px 300px"; d.insertBefore(rl, d.firstChild); }
  if (pal.sun) d.appendChild(node("sun", "--sc:" + pal.sun));
  if (pal.land) d.appendChild(node("mount land", "background-image:" + pal.land));
  if (pal.edo) {
    d.appendChild(node("edo-herons", "background-image:" + edoHerons()));
    d.appendChild(node("edo-koi", "background-image:" + edoKoi()));
    var seal = node("edo-seal"); seal.innerHTML = "江<br>戸"; d.appendChild(seal);
  }
  if (pal.fujiScene) {
    d.appendChild(node("fj-sun"));
    d.appendChild(node("fj-mount", "background-image:" + fujiScene()));
    [["c1", "#ffffff"], ["c2", "#fbf7f0"], ["c3", "#ffffff"], ["c4", "#f6efe4"]].forEach(function (c) { d.appendChild(node("kumo " + c[0], "background-image:" + kumo(c[1]))); });
  }
  if (pal.frost) {
    d.appendChild(node("frost-haze"));
    ["tl", "tr", "bl", "br"].forEach(function (k, i) { d.appendChild(node("frost " + k, "background-image:" + frost(7 + i * 13))); });
  }
  if (pal.bigWave) d.appendChild(node("bigwave", "background-image:" + bigWave()));
  if (pal.koiPond) { d.appendChild(node("scene", "background-image:" + koiWater())); for (var kq = 0; kq < 3; kq++) d.appendChild(node("koi k" + kq, "background-image:" + koiSprite(kq))); }
  if (pal.sakuraScene) d.appendChild(node("scene", "background-image:" + sakuraScene()));
  if (pal.matchaScene) d.appendChild(node("scene", "background-image:" + matchaScene()));
  if (pal.pixelSnow) {
    d.appendChild(node("scene pixel", "background-image:" + pixelSnow()));
    for (var sn = 0; sn < 40; sn++) { var sz2 = Math.random() < .3 ? 6 : 3, du = rnd(7, 14); d.appendChild(node("px-snow", "left:" + rnd(0, 100) + "%;width:" + sz2 + "px;height:" + sz2 + "px;animation-duration:" + du + "s;animation-delay:" + (-rnd(0, du)) + "s;--dx:" + rnd(-10, 10) + "vw")); }
  }
  if (pal.lotus) d.appendChild(node("scene", "background-image:" + lotusScene()));
  if (pal.kaguyaScene) d.appendChild(node("scene", "background-image:" + kaguyaScene()));
  if (pal.greatWave) d.appendChild(node("scene", "background-image:" + greatWave()));
  if (pal.akiScene) d.appendChild(node("scene", "background-image:" + akiScene()));
  if (pal.wForest) { d.appendChild(node("scene", "background-image:" + wisteriaForest())); d.appendChild(node("topshade")); }
  if (pal.pixelNight) {
    d.appendChild(node("scene pixel", "background-image:" + pixelNight()));
    for (var tw = 0; tw < 22; tw++) d.appendChild(node("px-star", "left:" + rnd(2, 97) + "%;top:" + rnd(2, 62) + "%;animation-duration:" + rnd(1.6, 4) + "s;animation-delay:" + (-rnd(0, 4)) + "s"));
    for (var ff = 0; ff < 12; ff++) d.appendChild(node("px-fly", "left:" + rnd(4, 94) + "%;top:" + rnd(74, 96) + "%;animation-duration:" + rnd(3, 6) + "s;animation-delay:" + (-rnd(0, 6)) + "s"));
    d.appendChild(node("shoot"));
  }
  if (pal.scene) d.appendChild(node("scene", "background-image:" + pal.scene()));
  if (pal.fx) pal.fx(d, node, rnd);
  if (pal.tileDrift && d.querySelector(".tile:not(.relief)")) d.querySelector(".tile:not(.relief)").classList.add("drift");
  (pal.amb || []).forEach(function (a) {
    for (var j = 0; j < a.n; j++) {
      var size = rnd(a.size[0], a.size[1]), dur = rnd(a.dur[0], a.dur[1]);
      var o = node(a.kind, "left:" + rnd(-5, 100) + "%;animation-duration:" + dur + "s;animation-delay:" + (-rnd(0, dur)) + "s;--dx:" + rnd(-18, 18) + "vw;--r:" + rnd(-540, 540) + "deg;--o:" + (a.o * rnd(0.6, 1)));
      var i2 = document.createElement("i");
      i2.setAttribute("style", "width:" + size + "px;height:" + size + "px;background-image:" + window.KANAME_SHAPE(a.shape, pick(a.colors)) + ";animation-duration:" + rnd(2.5, 5) + "s;--sw:" + rnd(8, 26) + "px");
      o.appendChild(i2); d.appendChild(o);
    }
  });
}
var current = null;

export function init() {
  // Lluvia de pétalos/hojas/estrellas: «small» al acertar una tarjeta, «big» al completar el día o ganar una paleta
  window.kanameBurst = function (big, fromEl) {
    var pal = current;
    if (!pal || !pal.burst || !document.body) return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var layer = document.getElementById("burst");
    if (!layer) { layer = node(); layer.id = "burst"; layer.setAttribute("aria-hidden", "true"); document.body.appendChild(layer); }
    var W = window.innerWidth, H = window.innerHeight, ox = W / 2, oy = H * 0.45;
    if (fromEl && fromEl.getBoundingClientRect) { var r = fromEl.getBoundingClientRect(); ox = r.left + r.width / 2; oy = r.top + r.height * 0.42; }
    function one(x, y, dx, dy, dur, delay, size) {
      var e = document.createElement("i");
      e.style.cssText = "left:" + (x - size / 2) + "px;top:" + (y - size / 2) + "px;width:" + size + "px;height:" + size + "px;background-image:" + window.KANAME_SHAPE(pick(pal.burst.shapes), pick(pal.burst.colors));
      layer.appendChild(e);
      var rot = rnd(-420, 420);
      if (!e.animate) { setTimeout(function () { e.remove(); }, 50); return; }
      var a = e.animate([
        { transform: "translate(0,0) rotate(0deg) scale(.4)", opacity: 0 },
        { transform: "translate(" + dx * 0.55 + "px," + dy * 0.35 + "px) rotate(" + rot * 0.4 + "deg) scale(1)", opacity: 1, offset: 0.25 },
        { transform: "translate(" + dx + "px," + (dy + H * 0.18) + "px) rotate(" + rot + "deg) scale(.9)", opacity: 0 }
      ], { duration: dur, delay: delay, easing: "cubic-bezier(.2,.65,.35,1)", fill: "both" });
      a.onfinish = function () { e.remove(); };
    }
    var PL = window.KANAME_PALETTES, tier = Math.max(0, Math.round((PL.indexOf(pal) - 2) * 12 / (PL.length - 3))); // 0 = Sakura … 12 = Kin
    if (big && tier >= 3) { var fl = node("flash"); fl.style.left = ox + "px"; fl.style.top = oy + "px"; layer.appendChild(fl); setTimeout(function () { fl.remove(); }, 1300); }
    var n = (big ? 26 : 8) + tier * (big ? 3 : 1);
    for (var k = 0; k < n; k++) {
      var ang = rnd(0, Math.PI * 2), sp = rnd(60, big ? 230 : 140);
      one(ox, oy, Math.cos(ang) * sp, Math.sin(ang) * sp - (big ? 80 : 40), rnd(1100, big ? 2200 : 1600), rnd(0, big ? 200 : 80), rnd(10, 18));
    }
    if (big) for (var q = 0; q < 34 + tier * 5; q++) one(rnd(0, W), -20, rnd(-60, 60), H * rnd(0.75, 1.05), rnd(2600, 4200), rnd(0, 1400), rnd(10, 19));
  };

  window.applyKanamePalette = function (id) {
    var P = window.KANAME_PALETTES, pal = P[0];
    for (var i = 0; i < P.length; i++) if (P[i].id === id) pal = P[i];
    current = pal;
    var r = document.documentElement.style, deco = pal.id !== "sumi";
    var surface = pal.surface || "#1c1c1c";
    r.setProperty("--accent", pal.accent);
    r.setProperty("--accent-soft", pal.accent + "2e");
    r.setProperty("--bg", pal.bg || "#121212");
    r.setProperty("--surface-solid", surface);
    r.setProperty("--surface", deco ? surface + (pal.surfA || (pal.light ? "e8" : "e3")) : surface); // un poco translúcida para que se intuya el fondo
    r.setProperty("--surface-raised", pal.raised || "#262626");
    r.setProperty("--hairline", pal.hairline || "#333");
    r.setProperty("--text", pal.text || "#ebebeb");
    r.setProperty("--text-muted", pal.muted || "#9a9a9a");
    r.setProperty("--text-faint", pal.faint || "#686868");
    r.setProperty("--status", pal.status || "#121212");
    r.setProperty("--glow", pal.glow || "transparent");
    var RATE = { again: "#d0685c", hard: "#c99a4a", good: "#6fae84", easy: "#7fb8e0" };
    for (var k in RATE) { var c = pal[k] || RATE[k]; r.setProperty("--" + k, c); r.setProperty("--" + k + "-soft", c + (k === "easy" ? "3d" : "38")); }
    r.setProperty("color-scheme", pal.light ? "light" : "dark");
    document.documentElement.classList.toggle("light", !!pal.light);
    document.documentElement.setAttribute("data-pal", pal.id);
    document.documentElement.classList.toggle("brush", !!pal.font);
    // copia para aplicarla antes de pintar la próxima vez que se abra la app (ver index.html)
    try { localStorage.setItem("kaname.paletteBoot", JSON.stringify({ style: document.documentElement.getAttribute("style"), cls: document.documentElement.className, pal: pal.id })); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", pal.bg || "#121212");
    var cs = document.querySelector('meta[name="color-scheme"]'); if (cs) cs.setAttribute("content", pal.light ? "light" : "dark");
    if (pal.font && !document.getElementById("kanameFont")) {
      var lk = document.createElement("link"); lk.id = "kanameFont"; lk.rel = "stylesheet";
      lk.href = "https://fonts.googleapis.com/css2?family=" + pal.font.replace(/ /g, "+") + "&display=swap";
      document.head.appendChild(lk);
    }
    if (document.body) buildDecor(pal);
    else document.addEventListener("DOMContentLoaded", function () { if (current === pal) buildDecor(pal); });
  };
  try { window.applyKanamePalette(localStorage.getItem("kaname.palette.v1") || "sumi"); } catch (e) { window.applyKanamePalette("sumi"); }
}
