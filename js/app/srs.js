/* Repetición espaciada: plazos, multiplicador personal y valoraciones */

export var MIN = 60 * 1000, DAY;
export var RULES;
export var MAX_IVL, MASTERED;
var LEGACY_IVL;
export function ivlOf(p) { return !p ? 0 : typeof p.ivl === "number" ? p.ivl : (LEGACY_IVL[p.last] || 0); }
/* Multiplicador personal de cada kanji («ease», como en Anki): empieza en ×2,5 (Good) y Easy usa ese valor ×1,2.
   Again lo baja 0,20 y Hard 0,15 (los kanji que cuestan vuelven más a menudo); Easy lo sube 0,15. Entre ×1,3 y ×3,5. */
var EASE0 = 2.5, EASE_MIN = 1.3, EASE_MAX = 3.5, EASE_STEP = { again: -.2, hard: -.15, good: 0, easy: .15 };
function easeOf(p) { return p && typeof p.ease === "number" ? p.ease : EASE0; }
function multOf(p, choice) { return choice === "hard" ? RULES.hard.mult : choice === "easy" ? easeOf(p) * 1.2 : choice === "good" ? easeOf(p) : 0; }
export function nextIvl(p, choice) { var r = RULES[choice]; return Math.min(MAX_IVL, Math.max(r.min, Math.round(ivlOf(p) * multOf(p, choice)))); }
// Aplica una valoración a un kanji: plazo nuevo y ajuste de su multiplicador personal
export function applyRating(p, choice, now) {
  p.reps = (p.reps || 0) + 1;
  p.ivl = choice === "again" ? 0 : nextIvl(p, choice);
  p.due = now + (choice === "again" ? RULES.again.min : p.ivl);
  p.ease = Math.round(Math.min(EASE_MAX, Math.max(EASE_MIN, easeOf(p) + EASE_STEP[choice])) * 100) / 100;
  p.last = choice;
  p.seen = now;
  return p;
}

export function init() {
  DAY = 24 * 60 * MIN;
  /* Cada respuesta multiplica el último intervalo de la tarjeta, así los kanji que ya sabes salen cada vez menos:
       Again → 10 min (y vuelve a empezar) · Hard ×1,2 (mín. 1 día) · Good ×2,5 (mín. 3 días) · Easy ×3 (mín. 16 días)
     Ej.: Easy, Easy, Easy → 16 días, ~1,5 meses, ~5 meses. Máximo 1 año. Una tarjeta está «dominada» si no vuelve en 3 semanas o más. */
  RULES = { again: { mult: 0, min: 10 * MIN }, hard: { mult: 1.2, min: 1 * DAY }, good: { mult: 2.5, min: 3 * DAY }, easy: { mult: 3, min: 16 * DAY } };
  MAX_IVL = 365 * DAY;
  MASTERED = 21 * DAY;
  LEGACY_IVL = { again: 0, hard: 1 * DAY, good: 3 * DAY, easy: 16 * DAY }; // progreso guardado antes de existir «ivl»
}
