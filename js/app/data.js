/* Datos: modo de estudio (Jōyō o JLPT), niveles y tarjetas */

var GRADES;
/* Modo de estudio (Ajustes): "joyo" = grupos de primaria + Jōyō (como siempre) · "jlpt" = niveles N5 a N1 con kanji y palabras.
   Los dos modos comparten el progreso: cada tarjeta se guarda por su kanji (o su palabra), así que un kanji repasado
   en un modo está igual de repasado en el otro. Al cambiar de modo la app se recarga. */
export var MODE_KEY = "kaname.mode.v1";
export var JLPT;
export var MODE;
export var KINFO = {};          // kanji -> ficha completa (de los dos modos), para el reverso y el recuadro de las palabras
export var KNOWN = {};          // todas las tarjetas que existen en algún modo (para copias de seguridad)
function isKanji(ch) { return /[\u3400-\u9fff\uf900-\ufaff]/.test(ch); }
export var LEVELS;
export var GRADE_TAG;
export var CARDS = {};          // tarjeta (kanji o palabra) -> datos de la tarjeta
export var GROUPS = [];         // GROUPS[g] = tarjetas que se añaden en el grupo g
export var DECKS = [];          // DECKS[l] = lista de tarjetas del nivel l+1 (acumulativo)

export function init() {
  GRADES = window.KANJI_DATA || [];
  JLPT = window.JLPT_DATA || null;
  MODE = (function () { try { return localStorage.getItem(MODE_KEY) === "jlpt" && JLPT ? "jlpt" : "joyo"; } catch (e) { return "joyo"; } })();
  document.documentElement.setAttribute("data-mode", MODE);
  GRADES.forEach(function (g) { g.forEach(function (r) { KINFO[r[0]] = { k: r[0], on: r[1], kun: r[2], sig: r[3], pal: r[4] }; }); });
  if (JLPT) JLPT.extra.forEach(function (r) { if (!KINFO[r[0]]) KINFO[r[0]] = { k: r[0], on: r[1], kun: r[2], sig: r[3], pal: r[4] }; });
  Object.keys(KINFO).forEach(function (k) { KNOWN[k] = 1; });
  if (JLPT) JLPT.levels.forEach(function (L) { L.w.forEach(function (w) { KNOWN[w[0]] = 1; }); });
  LEVELS = MODE === "jlpt" ? [
    { short: "N5", name: "JLPT N5" },
    { short: "N4", name: "JLPT N5–N4" },
    { short: "N3", name: "JLPT N5–N3" },
    { short: "N2", name: "JLPT N5–N2" },
    { short: "N1", name: "JLPT completo (N5–N1)" }
  ] : [
    { short: "1",  name: "Kyōiku · 1º" },
    { short: "2",  name: "Kyōiku · 1º–2º" },
    { short: "3",  name: "Kyōiku · 1º–3º" },
    { short: "4",  name: "Kyōiku · 1º–4º" },
    { short: "5",  name: "Kyōiku · 1º–5º" },
    { short: "6",  name: "Kyōiku completo" },
    { short: "常", name: "Jōyō completo" }
  ];
  GRADE_TAG = MODE === "jlpt" ? ["N5", "N4", "N3", "N2", "N1"] : ["1º", "2º", "3º", "4º", "5º", "6º", "Jōyō"];
  (function build() {
    var acc = [];
    if (MODE === "jlpt") {
      JLPT.levels.forEach(function (L, li) {
        var g = [];
        Array.from(L.k).forEach(function (k) {
          var i = KINFO[k]; if (!i) return;
          CARDS[k] = { k: k, on: i.on, kun: i.kun, sig: i.sig, pal: i.pal, grade: li }; g.push(k);
        });
        L.w.forEach(function (w) {
          if (CARDS[w[0]]) return;
          CARDS[w[0]] = { k: w[0], word: true, read: w[1], sig: w[2], ks: Array.from(w[0]).filter(function (ch, i, a) { return isKanji(ch) && KINFO[ch] && a.indexOf(ch) === i; }), grade: li };
          g.push(w[0]);
        });
        GROUPS.push(g); acc = acc.concat(g); DECKS.push(acc.slice());
      });
      return;
    }
    GRADES.forEach(function (g, gi) {
      var keys = [];
      g.forEach(function (r) {
        CARDS[r[0]] = { k: r[0], on: r[1], kun: r[2], sig: r[3], pal: r[4], grade: gi };
        keys.push(r[0]); acc.push(r[0]);
      });
      GROUPS.push(keys); DECKS.push(acc.slice());
    });
  })();
}
