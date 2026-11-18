/* だるま Daruma: pared de daruma con 勝 */
import { MINCHO } from "./varias.js";
import { f } from "../medals.js";
import { patchPal } from "./common.js";
import { seeded, svg } from "../shapes.js";
function darumaFull(x, y, R, sd, eyes, flip) {
  var r = seeded(sd), id = "dm" + sd, w = R, h = R * 1.08;
  var o = '<g transform="translate(' + f(x) + ' ' + f(y) + ')' + (flip ? ' scale(-1 1)' : '') + '">';
  o += '<defs><radialGradient id="' + id + '" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff6a4a"/><stop offset=".55" stop-color="#e2321f"/><stop offset="1" stop-color="#8e1410"/></radialGradient></defs>';
  var body = 'M0 ' + f(-h) + 'C' + f(w * .78) + ' ' + f(-h) + ' ' + f(w) + ' ' + f(-h * .3) + ' ' + f(w) + ' ' + f(h * .18) + 'C' + f(w) + ' ' + f(h * .7) + ' ' + f(w * .6) + ' ' + f(h * .95) + ' 0 ' + f(h * .95) + 'S' + f(-w) + ' ' + f(h * .7) + ' ' + f(-w) + ' ' + f(h * .18) + 'C' + f(-w) + ' ' + f(-h * .3) + ' ' + f(-w * .78) + ' ' + f(-h) + ' 0 ' + f(-h) + 'Z';
  o += '<path d="' + body + '" fill="url(#' + id + ')" stroke="#5a0c0a" stroke-width="' + f(R * .03) + '"/>';
  // franjas doradas de los costados
  for (var k = 0; k < 5; k++) { var xx = w * (.58 + k * .08); [-1, 1].forEach(function (sd2) { o += '<path d="M' + f(sd2 * xx * .7) + ' ' + f(-h * .2) + 'Q' + f(sd2 * xx * 1.02) + ' ' + f(h * .25) + ' ' + f(sd2 * xx * .62) + ' ' + f(h * .82) + '" fill="none" stroke="#e8b84a" stroke-opacity=".7" stroke-width="' + f(R * .025) + '"/>'; }); }
  // cara blanca
  var fw = w * .7, fy = -h * .3, fh = h * .5;
  o += '<path d="M' + f(-fw) + ' ' + f(fy) + 'C' + f(-fw) + ' ' + f(fy - fh * .95) + ' ' + f(fw) + ' ' + f(fy - fh * .95) + ' ' + f(fw) + ' ' + f(fy) + 'C' + f(fw) + ' ' + f(fy + fh * .9) + ' ' + f(-fw) + ' ' + f(fy + fh * .9) + ' ' + f(-fw) + ' ' + f(fy) + 'Z" fill="#fbf6ec" stroke="#2a1a16" stroke-width="' + f(R * .025) + '"/>';
  // zonas naranjas alrededor de los ojos y cejas de grulla
  [-1, 1].forEach(function (s2) {
    var ex = s2 * fw * .42, ey = fy - fh * .12;
    o += '<ellipse cx="' + f(ex) + '" cy="' + f(ey) + '" rx="' + f(fw * .36) + '" ry="' + f(fh * .34) + '" fill="#f39a2e"/>';
    o += '<path d="M' + f(ex - s2 * fw * .34) + ' ' + f(ey - fh * .2) + 'Q' + f(ex) + ' ' + f(ey - fh * .62) + ' ' + f(ex + s2 * fw * .4) + ' ' + f(ey - fh * .16) + 'Q' + f(ex) + ' ' + f(ey - fh * .4) + ' ' + f(ex - s2 * fw * .34) + ' ' + f(ey - fh * .2) + 'Z" fill="#1d1412"/>';
    for (var q = 0; q < 4; q++) o += '<path d="M' + f(ex + s2 * fw * (.1 + q * .08)) + ' ' + f(ey - fh * (.36 - q * .03)) + 'l' + f(s2 * fw * .1) + ' ' + f(-fh * .12) + '" stroke="#1d1412" stroke-width="' + f(R * .018) + '" stroke-linecap="round"/>';
    o += '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(fw * .22) + '" fill="#ffffff" stroke="#1d1412" stroke-width="' + f(R * .02) + '"/>';
    if ((s2 < 0 && eyes > 0) || (s2 > 0 && eyes > 1)) o += '<circle cx="' + f(ex) + '" cy="' + f(ey) + '" r="' + f(fw * .13) + '" fill="#1d1412"/><circle cx="' + f(ex - fw * .04) + '" cy="' + f(ey - fw * .04) + '" r="' + f(fw * .035) + '" fill="#fff"/>';
  });
  // nariz y barba/bigote con trazos
  o += '<path d="M' + f(-fw * .1) + ' ' + f(fy + fh * .14) + 'Q0 ' + f(fy + fh * .22) + ' ' + f(fw * .1) + ' ' + f(fy + fh * .14) + '" fill="none" stroke="#c0321f" stroke-width="' + f(R * .025) + '"/>';
  [-1, 1].forEach(function (s3) { for (var b = 0; b < 6; b++) o += '<path d="M' + f(s3 * fw * .08) + ' ' + f(fy + fh * .26) + 'Q' + f(s3 * fw * (.3 + b * .07)) + ' ' + f(fy + fh * (.2 + b * .03)) + ' ' + f(s3 * fw * (.55 + b * .07)) + ' ' + f(fy + fh * (.44 + b * .05)) + '" fill="none" stroke="#1d1412" stroke-opacity=".85" stroke-width="' + f(R * .018) + '" stroke-linecap="round"/>'; });
  o += '<path d="M' + f(-fw * .5) + ' ' + f(fy + fh * .62) + 'Q0 ' + f(fy + fh * .74) + ' ' + f(fw * .5) + ' ' + f(fy + fh * .62) + '" fill="none" stroke="#1d1412" stroke-width="' + f(R * .02) + '"/>';
  // 勝 en la barriga
  o += '<text x="0" y="' + f(h * .58) + '" font-family="' + MINCHO + '" font-weight="900" font-size="' + f(R * .62) + '" text-anchor="middle" fill="#fdf6ea" transform="' + (flip ? 'scale(-1 1)' : '') + '">勝</text>';
  // brillo
  o += '<path d="M' + f(-w * .6) + ' ' + f(-h * .55) + 'Q' + f(-w * .4) + ' ' + f(-h * .9) + ' ' + f(-w * .05) + ' ' + f(-h * .92) + '" fill="none" stroke="#ffb09a" stroke-opacity=".55" stroke-width="' + f(R * .06) + '" stroke-linecap="round"/>';
  return o + '</g>';
}
function darumaWall() {
  var r = seeded(5), s = '<rect width="400" height="860" fill="#3a0c0a"/>', items = [];
  for (var row = 0; row < 10; row++) {
    var y = 30 + row * 98, x = -30 + (row % 2) * 50;
    while (x < 440) { var R = 44 + r() * 34; items.push([x + r() * 10, y + r() * 16, R, Math.floor(r() * 1000), r() > .6 ? 2 : (r() > .3 ? 1 : 0), r() > .5]); x += R * 1.55; }
  }
  items.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (it) { s += darumaFull(it[0], it[1], it[2], it[3], it[4], it[5]); });
  // velo para que el texto de la app se lea encima
  s += '<rect width="400" height="860" fill="#2a0806" fill-opacity=".38"/>';
  s += '<defs><linearGradient id="dtop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e0504" stop-opacity=".85"/><stop offset="1" stop-color="#1e0504" stop-opacity="0"/></linearGradient></defs><rect width="400" height="150" fill="url(#dtop)"/>';
  return svg(s, 400, 860);
}

export function init() {
  (window.KANAME_PALETTES || []).forEach(function (p) { if (p.id === "daruma") p.scene = darumaWall; });
  patchPal("daruma", {
    light: false, tile: null, bg: "#2a0a08", surface: "#3a1210", raised: "#4a1a16", hairline: "#6a2a22",
    text: "#fff4ea", muted: "#f0c2b4", faint: "#b88a80", accent: "#ffb347", status: "#ffb347",
    again: "#ff8a7a", hard: "#f2b35e", good: "#7ccf8a", easy: "#8ab8f0",
    grad: "#3a0c0a", surfA: "ee", glow: "rgba(255,179,71,.2)",
    pantone: "Inspirada en PANTONE True Red 19-1664, Chili Pepper 19-1557 y Radiant Yellow 15-1058 (el naranja de los ojos)"
  });
}
