/* Interfaz: niveles, tarjetas (kanji y palabras) y valoraciones */
import { state } from "./state.js";
import { CARDS, GRADE_TAG, KINFO, LEVELS } from "./data.js";
import { DAY, MIN, RULES, applyRating, nextIvl } from "./srs.js";
import { LEVEL_KEY, PALETTE_KEY, lsGet, lsSet, save } from "./storage.js";
import { PALETTES, checkDayComplete, currentStreak, setPalette, unlocked } from "./streak.js";
import { buildQueue, humanTime, levelCounts, levelName, mode, nextDueIn, queue, refillQueue, skipped } from "./session.js";
import { completeDaily, dailyComplete, dailyDone, dayStr, rateGood, saveDaily } from "./daily.js";
import { toast } from "./settings.js";
export var $ = function (id) { return document.getElementById(id); };
export var stage;

export function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

export function renderLevels() {
  renderToday(); renderStreak();
  var box = $("levels"); box.innerHTML = "";
  LEVELS.forEach(function (L, i) {
    var n = i + 1, c = levelCounts(n);
    var b = el("button", "level-btn" + (n === state.level ? " active" : "") + (c.available === 0 ? " done" : ""));
    b.setAttribute("aria-label", L.name + ": " + c.available + " tarjetas disponibles de " + c.total);
    b.appendChild(el("span", "n", L.short));
    b.appendChild(el("span", "count", c.available === 0 ? "✓" : String(c.available)));
    b.onclick = function () { selectLevel(n); };
    box.appendChild(b);
  });
}

function renderToday() {
  var b = $("todayBtn"), n = state.daily.list.length, complete = dailyComplete(), done = complete ? n : dailyDone();
  b.className = "today" + (state.level === 0 ? " active" : "") + (complete ? " done" : "");
  b.innerHTML = "";
  b.appendChild(el("span", "jp", "今日"));
  var t = el("span", "txt");
  t.appendChild(el("span", "t", "Kanji de hoy"));
  t.appendChild(el("span", "s", n === 0 ? "No te queda ningún kanji pendiente ahora mismo" : complete ? "Reto superado · repásalos cuando quieras" : "Marca ✓ los " + n + " para superar el reto de hoy"));
  b.appendChild(t);
  b.appendChild(el("span", "right", (complete ? "✓ " : "") + done + "/" + n));
  b.onclick = function () { selectLevel(0); };
}
export function renderStreak() {
  var cur = currentStreak();
  $("streakNum").textContent = cur;
  $("streakBtn").classList.toggle("on", state.streak.last === dayStr());
  $("streakBtn").setAttribute("aria-label", "Racha: " + cur + " días");
}
export function renderStreakSheet() {
  var cur = currentStreak(), next = PALETTES.filter(function (p) { return p.days > state.streak.best; })[0];
  var h = $("streakHero"); h.innerHTML = "";
  var big = el("div", "big", String(cur)); big.appendChild(el("small", null, cur === 1 ? "día" : "días"));
  h.appendChild(big);
  var info = el("div", "info");
  info.appendChild(document.createTextNode("Mejor racha: ")); info.appendChild(el("b", null, state.streak.best + (state.streak.best === 1 ? " día" : " días")));
  info.appendChild(el("br"));
  info.appendChild(document.createTextNode(next ? "Siguiente medalla (" + next.name + ") con " + next.days + (next.days === 1 ? " día" : " días seguidos") + "." : "¡Tienes todas las medallas!"));
  h.appendChild(info);
  var box = $("palettes"); box.innerHTML = "";
  var sel = lsGet(PALETTE_KEY) || "sumi";
  PALETTES.forEach(function (p) {
    var ok = unlocked(p);
    var b = el("button", "pal" + (p.id === sel ? " sel" : "") + (ok ? "" : " locked"));
    b.dataset.id = p.id;
    var well = el("span", "well"), md = el("span", "md"), murl = window.KANAME_MEDAL(p.id); md.style.backgroundImage = murl; md.style.setProperty("--m", murl);
    well.appendChild(md); b.appendChild(well);
    var nm = el("span", "nm");
    if (ok) { nm.appendChild(el("b", null, p.jp)); nm.appendChild(document.createTextNode(p.name)); }
    else nm.textContent = p.days + (p.days === 1 ? " día" : " días");
    b.appendChild(nm);
    b.setAttribute("aria-label", p.name + (ok ? "" : ", se desbloquea con " + p.days + (p.days === 1 ? " día" : " días seguidos")));
    b.onclick = function () {
      if (!ok) { toast(p.days === 1 ? "Se desbloquea al completar tu primer día" : "Se desbloquea con " + p.days + " días seguidos"); return; }
      setPalette(p.id); renderStreakSheet();
    };
    box.appendChild(b);
  });
}

export function renderStatus() {
  $("levelLabel").textContent = levelName(state.level);
  if (state.level === 0 && state.daily.list.length) {
    var n = state.daily.list.length, t = dailyDone(), m = mode();
    $("statusRight").innerHTML = "";
    $("statusRight").appendChild(el("b", null, m === "daily" ? (n - t) + " por acertar" : "Reto superado"));
    $("statusRight").appendChild(document.createTextNode(m === "daily" ? " · " + t + " ✓" : " · repaso libre"));
    $("progressBar").style.width = (m === "daily" ? (t / n) * 100 : 100) + "%";
    return;
  }
  var c = levelCounts(state.level);
  var left = state.cramMode ? queue.length + (state.current ? 1 : 0) : c.available;
  $("statusRight").innerHTML = "";
  var b = el("b", null, left + " por repasar");
  $("statusRight").appendChild(b);
  if (c.waiting && !state.cramMode) $("statusRight").appendChild(document.createTextNode(" · " + c.waiting + " en espera"));
  var learned = c.total - c.fresh;
  $("progressBar").style.width = (c.total ? (learned / c.total) * 100 : 0) + "%";
}

function buildCard() {
  stage.innerHTML = "";
  var wrap = el("div", "card-wrap"), card = el("div", "card"); card.id = "card";
  var front = el("div", "face face-front");
  front.appendChild(el("div", "tag")).id = "tagFront";
  front.appendChild(el("div", "kanji-big")).id = "kFront";
  front.appendChild(el("div", "hint", "Toca para ver la respuesta"));
  var back = el("div", "face face-back"); back.id = "back";
  card.appendChild(front); card.appendChild(back); wrap.appendChild(card);
  stage.appendChild(wrap);

  var m = mode(), r = el("div", "ratings " + m); r.id = "ratings"; r.dataset.mode = m;
  if (m === "srs") {
    [["again", "Again"], ["hard", "Hard"], ["good", "Good"], ["easy", "Easy"]].forEach(function (x) {
      var b = el("button", "rate-btn " + x[0]);
      b.appendChild(el("span", "label", x[1])); b.appendChild(el("span", "interval")).dataset.choice = x[0];
      b.onclick = function (e) { e.stopPropagation(); rate(x[0]); };
      r.appendChild(b);
    });
  } else if (m === "daily" || m === "cram") {
    [["again", "✕", "Repetir", false], ["good", "✓", "Me lo sé", true]].forEach(function (x) {
      var b = el("button", "rate-btn " + x[0]);
      b.setAttribute("aria-label", x[2]);
      b.appendChild(el("span", "mark", x[1])); b.appendChild(el("span", "interval", x[2]));
      b.onclick = function (e) { e.stopPropagation(); if (m === "cram") markCram(x[3]); else markDaily(x[3]); };
      r.appendChild(b);
    });
  } else {
    var nx = el("button", "pill-btn next-btn", "Siguiente →");
    nx.onclick = function (e) { e.stopPropagation(); nextBrowse(); };
    r.appendChild(nx);
  }
  stage.appendChild(r);
  card.onclick = flip;
}

// Lecturas, significado y palabras de ejemplo de un kanji (el reverso de su tarjeta)
function kanjiInfo(box, c) {
  var rd = el("div", "readings");
  [["ON", c.on], ["KUN", c.kun]].forEach(function (x) {
    if (!x[1]) return;
    var row = el("div", "reading"); row.appendChild(el("span", "lbl", x[0])); row.appendChild(el("span", "val", x[1])); rd.appendChild(row);
  });
  if (rd.children.length) box.appendChild(rd);
  box.appendChild(el("div", "meaning", c.sig));
  var pals = Array.isArray(c.pal) ? c.pal : (c.pal ? [c.pal] : []);
  if (pals.length) {
    var w = el("div", "word");
    w.appendChild(el("div", "lbl", pals.length > 1 ? "PALABRAS DE EJEMPLO" : "PALABRA DE EJEMPLO"));
    var ul = el("ul");
    pals.forEach(function (txt) {
      var li = el("li");
      // Formato: "palabra (lectura) – significado"
      var m = /^(.+?) \((.+?)\) – (.+)$/.exec(txt);
      if (m) {
        var word = el("span", "w");
        m[1].split(c.k).forEach(function (part, i) {
          if (i > 0) word.appendChild(el("mark", null, c.k));
          if (part) word.appendChild(document.createTextNode(part));
        });
        li.appendChild(word);
        li.appendChild(el("span", "r", m[2]));
        li.appendChild(el("span", "m", m[3]));
      } else {
        li.appendChild(el("span", "w", txt));
      }
      ul.appendChild(li);
    });
    w.appendChild(ul);
    box.appendChild(w);
  }
}
function fillBack(c) {
  var back = $("back"); back.innerHTML = "";
  back.appendChild(el("div", "tag", GRADE_TAG[c.grade]));
  if (c.word) { fillWordBack(back, c); back.scrollTop = 0; return; }
  back.appendChild(el("div", "kanji-small", c.k));
  kanjiInfo(back, c);
  back.scrollTop = 0;
}
/* Reverso de una palabra (modo JLPT): la palabra arriba, su lectura en hiragana y su significado; debajo, un recuadro
   con el reverso completo de uno de sus kanji (al principio el primero). Tocando otro kanji de la palabra se cambia. */
function fillWordBack(back, c) {
  var top = el("div", "word-top"), sel = c.ks[0], spans = [], n = Array.from(c.k).length;
  if (n > 4) top.style.fontSize = Math.max(22, Math.floor(170 / n)) + "px";   // palabras largas: más pequeñas para que quepan
  Array.from(c.k).forEach(function (ch) {
    if (c.ks.indexOf(ch) >= 0) {
      var b = el("button", "wk" + (ch === sel ? " sel" : ""), ch);
      b.setAttribute("aria-label", "Ver el kanji " + ch);
      b.onclick = function (e) { e.stopPropagation(); if (ch === sel) return; sel = ch; spans.forEach(function (x) { x.classList.toggle("sel", x.textContent === ch); }); show(); };
      spans.push(b); top.appendChild(b);
    } else top.appendChild(el("span", "wc", ch));
  });
  back.appendChild(top);
  back.appendChild(el("div", "word-read", c.read));
  back.appendChild(el("div", "meaning", c.sig));
  if (!c.ks.length) return;
  if (c.ks.length > 1) back.appendChild(el("div", "wk-hint", "Toca un kanji de la palabra para ver su explicación"));
  var box = el("div", "kbox");
  back.appendChild(box);
  function show() {
    box.innerHTML = "";
    var i = KINFO[sel];
    box.appendChild(el("div", "kanji-small", sel));
    kanjiInfo(box, i);
  }
  show();
}

function renderEmpty() {
  state.current = null;
  stage.innerHTML = "";
  var box = el("div", "empty");
  var wait = nextDueIn();
  if (state.level === 0) {
    box.appendChild(el("div", "mark", "今"));
    box.appendChild(el("h2", null, state.daily.list.length ? "¡Kanji de hoy completados!" : "¡No te quedan kanji nuevos!"));
    box.appendChild(el("p", null, (wait != null && wait < DAY ? "Los que marcaste con Again vuelven en " + humanTime(wait) + ". " : "") +
      "Mañana tendrás " + state.DAILY_SIZE + " kanji nuevos. Si quieres más, sigue en tu nivel."));
    // Nivel más sencillo con algo pendiente (repasos primero; si no, kanji nuevos)
    var lv = 0, i;
    for (i = 1; i <= LEVELS.length && !lv; i++) if (levelCounts(i).due) lv = i;
    for (i = 1; i <= LEVELS.length && !lv; i++) if (levelCounts(i).available) lv = i;
    lv = lv || 1;
    var go = el("button", "pill-btn", (levelCounts(lv).due ? "Repasar" : "Seguir con el") + " nivel " + LEVELS[lv - 1].short);
    go.onclick = function () { selectLevel(lv); };
    box.appendChild(go);
  } else {
    box.appendChild(el("div", "mark", "休"));
    box.appendChild(el("h2", null, "¡Todo repasado!"));
    box.appendChild(el("p", null, wait != null
      ? "No te queda nada pendiente en este nivel. La siguiente tarjeta vuelve en " + humanTime(wait) + "."
      : "No te queda nada pendiente en este nivel."));
    var b = el("button", "pill-btn", "Repasar todo igualmente");
    b.onclick = function () { state.cramMode = true; buildQueue(); showNext(); };
    box.appendChild(b);
  }
  stage.appendChild(box);
  renderStatus();
}

export function showNext() {
  refillQueue();
  if (!queue.length && state.level === 0 && state.daily.list.length) buildQueue();
  if (!queue.length) { if (state.cramMode) { state.cramMode = false; } renderEmpty(); renderLevels(); return; }
  if (!$("card") || $("ratings").dataset.mode !== mode()) buildCard();
  state.current = queue.shift();
  var c = CARDS[state.current];
  state.flipped = false;
  var card = $("card");
  card.classList.add("no-anim"); card.classList.remove("flipped");
  void card.offsetWidth; card.classList.remove("no-anim");
  $("ratings").classList.toggle("show", mode() === "browse");
  var kf = $("kFront"), len = Array.from(c.k).length;
  kf.textContent = c.k;
  kf.classList.toggle("is-word", !!c.word);
  kf.style.fontSize = c.word && len > 1 ? (len <= 2 ? "clamp(78px, 26vw, 112px)" : len === 3 ? "clamp(60px, 20vw, 88px)" : len === 4 ? "clamp(48px, 16vw, 70px)" : "clamp(36px, " + Math.floor(64 / len) + "vw, " + Math.floor(300 / len) + "px)") : "";
  $("tagFront").textContent = GRADE_TAG[c.grade];
  $("back").innerHTML = ""; // la respuesta se rellena solo al girar, así nunca se ve antes de tiempo
  renderStatus();
}

function ivlLabel(ms) {
  if (ms < DAY) return Math.round(ms / MIN) + " min";
  var d = Math.round(ms / DAY);
  if (d < 60) return d + (d === 1 ? " día" : " días");
  if (d < 365) { var m = Math.round(d / 30 * 2) / 2; return String(m).replace(".", ",") + (m === 1 ? " mes" : " meses"); }
  return "1 año";
}
function updateIntervals() {
  var p = state.progress[state.current];
  [].forEach.call(document.querySelectorAll("#ratings .interval[data-choice]"), function (s) {
    var c = s.dataset.choice;
    s.textContent = c === "again" ? ivlLabel(RULES.again.min) : ivlLabel(nextIvl(p, c));
  });
}

export function flip() {
  if (state.flipped || !state.current || state.busy) return;
  if (mode() === "srs") updateIntervals();
  fillBack(CARDS[state.current]);
  state.flipped = true;
  $("card").classList.add("flipped");
  $("ratings").classList.add("show");
}

export function rate(choice) {
  if (!state.flipped || !state.current || state.busy) return;
  state.busy = true;
  var now = Date.now();
  state.progress[state.current] = applyRating(state.progress[state.current] || { reps: 0 }, choice, now);
  save();
  if (!state.daily.list.length) checkDayComplete(); // sin kanji nuevos para el reto: cualquier repaso cuenta para la racha
  if (state.cramMode && choice === "again") queue.push(state.current);
  if (choice === "good" || choice === "easy") cardBurst();

  // Gira de vuelta mostrando aún la carta actual; la siguiente se carga al terminar el giro
  $("ratings").classList.remove("show");
  $("card").classList.remove("flipped");
  setTimeout(function () { state.busy = false; renderLevels(); showNext(); }, 460);
}

// Reto diario: ✓ («Me lo sé») cuenta como Good; ✕ («Repetir») cuenta como Again y lo devuelve al final de la cola
export function markDaily(ok) {
  if (!state.flipped || !state.current || state.busy || mode() !== "daily") return;
  state.busy = true;
  var k = state.current;
  if (ok) {
    if (state.daily.ticked.indexOf(k) < 0) { state.daily.ticked.push(k); saveDaily(); rateGood(k, Date.now()); save(); }
  } else {
    // ✕ cuenta como «Again»: el kanji vuelve a empezar y el ✓ final le dará el plazo de un «Good» desde cero
    state.progress[k] = applyRating(state.progress[k] || { reps: 0 }, "again", Date.now()); save();
    queue.push(k);
  }
  var finished = ok && state.daily.ticked.length >= state.daily.list.length;
  if (ok && !finished) cardBurst();
  if (finished) completeDaily();
  $("ratings").classList.remove("show");
  $("card").classList.remove("flipped");
  setTimeout(function () {
    state.busy = false;
    if (finished) {
      var lv = firstOpenLevel();
      selectLevel(lv);
      setTimeout(function () { toast("✓ Reto superado · Seguimos con el nivel " + LEVELS[lv - 1].short); }, 2300);
      return;
    }
    renderLevels(); showNext();
  }, 460);
}
// «Repasar todo igualmente»: ✓ no toca la tarjeta; ✕ funciona como Again (vuelve en 10 min) y se repite en esta sesión.
// Los kanji saltados («Mostrar kanji a partir de») no se tocan: con ✕ solo se repiten en la sesión.
export function markCram(ok) {
  if (!state.flipped || !state.current || state.busy || mode() !== "cram") return;
  state.busy = true;
  var k = state.current;
  if (ok) cardBurst();
  if (!ok) {
    if (!skipped(k)) {
      state.progress[k] = applyRating(state.progress[k] || { reps: 0 }, "again", Date.now()); save();
    }
    queue.push(k);
  }
  $("ratings").classList.remove("show");
  $("card").classList.remove("flipped");
  setTimeout(function () { state.busy = false; renderLevels(); showNext(); }, 460);
}
function cardBurst() { if (window.kanameBurst) window.kanameBurst(false, $("card")); }
// Primer nivel que aún tiene tarjetas por estudiar o repasar
export function firstOpenLevel() {
  for (var i = 1; i <= LEVELS.length; i++) if (levelCounts(i).available) return i;
  return 1;
}
// Repaso libre tras superar el reto
export function nextBrowse() {
  if (!state.current || state.busy) return;
  if (!state.flipped) { showNext(); return; }
  state.busy = true;
  $("card").classList.remove("flipped");
  setTimeout(function () { state.busy = false; showNext(); }, 460);
}

export function selectLevel(n) {
  state.level = n; lsSet(LEVEL_KEY, String(n));
  state.cramMode = false; state.current = null;
  buildQueue(); stage.innerHTML = ""; showNext(); renderLevels();
}

export function init() {
  stage = $("stage");
}
