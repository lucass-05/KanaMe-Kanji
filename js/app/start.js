/* Arranque de la app */
import { state } from "./state.js";
import { GROUPS } from "./data.js";
import { LEVEL_KEY, loadProgress, lsSet } from "./storage.js";
import { buildQueue } from "./session.js";
import { dailyComplete, ensureDaily } from "./daily.js";
import { firstOpenLevel, renderLevels, showNext, stage } from "./ui.js";
import { maybeAskReminder, syncReminder } from "./reminder.js";
import { maybeAskSize } from "./daily-size.js";
import { maybeShowStreakIntro, requestPersistence } from "./streak.js";
import { maybeStartTour } from "./tour.js";

export function init() {
  if (!GROUPS.length) { stage.textContent = "No se pudieron cargar los datos (data/kanji.js)."; return; }
  loadProgress().then(function () {
    requestPersistence();
    ensureDaily();
    if (state.level === 0 && dailyComplete()) { state.level = firstOpenLevel(); lsSet(LEVEL_KEY, String(state.level)); }
    buildQueue(); renderLevels(); showNext();
    syncReminder();
    var afterTour = function () { if (!maybeShowStreakIntro()) maybeAskReminder(); };
    var startTour2 = function () { if (!maybeStartTour(afterTour)) afterTour(); };
    var firstRun = function () { if (!maybeAskSize(startTour2)) startTour2(); };
    firstRun();
  });
}
