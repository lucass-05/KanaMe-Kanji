/* KanaMe Kanji — punto de entrada.
   Primero se preparan las paletas (colores y fondo), después la app. Cada módulo exporta init(),
   que se ejecuta aquí en orden: los módulos solo declaran funciones y datos, y todo lo que hace
   algo (leer ajustes, enganchar botones, pintar) ocurre dentro de su init(). */
import { init as initShapes } from "./palettes/shapes.js";
import { init as initMedals } from "./palettes/medals.js";
import { init as initScenesV5 } from "./palettes/scenes-v5.js";
import { init as initList } from "./palettes/list.js";
import { init as initScenesKoi } from "./palettes/scenes/koi.js";
import { init as initScenesSakuraMatcha } from "./palettes/scenes/sakura-matcha.js";
import { init as initScenesEdoSansui } from "./palettes/scenes/edo-sansui.js";
import { init as initScenesVarias } from "./palettes/scenes/varias.js";
import { init as initScenesFuji } from "./palettes/scenes/fuji.js";
import { init as initScenesRyu } from "./palettes/scenes/ryu.js";
import { init as initScenesOnsenColors } from "./palettes/scenes/onsen-colors.js";
import { init as initScenesDaruma } from "./palettes/scenes/daruma.js";
import { init as initScenesYuki } from "./palettes/scenes/yuki.js";
import { init as initScenesHanabi } from "./palettes/scenes/hanabi.js";
import { init as initScenesUmi } from "./palettes/scenes/umi.js";
import { init as initScenesEdo } from "./palettes/scenes/edo.js";
import { init as initScenesMachiGeisha } from "./palettes/scenes/machi-geisha.js";
import { init as initScenesAkibaShibuya } from "./palettes/scenes/akiba-shibuya.js";
import { init as initScenesOnsenTanabata } from "./palettes/scenes/onsen-tanabata.js";
import { init as initEngine } from "./palettes/engine.js";

import { init as initData } from "./app/data.js";
import { init as initSrs } from "./app/srs.js";
import { init as initStorage } from "./app/storage.js";
import { init as initStreak } from "./app/streak.js";
import { init as initSession } from "./app/session.js";
import { init as initUi } from "./app/ui.js";
import { init as initReminder } from "./app/reminder.js";
import { init as initSettings } from "./app/settings.js";
import { init as initCommands } from "./app/commands.js";
import { init as initLifecycle } from "./app/lifecycle.js";
import { init as initInstall } from "./app/install.js";
import { init as initStart } from "./app/start.js";

// Paletas
initShapes();
initMedals();
initScenesV5();
initList();
initScenesKoi();
initScenesSakuraMatcha();
initScenesEdoSansui();
initScenesVarias();
initScenesFuji();
initScenesRyu();
initScenesOnsenColors();
initScenesDaruma();
initScenesYuki();
initScenesHanabi();
initScenesUmi();
initScenesEdo();
initScenesMachiGeisha();
initScenesAkibaShibuya();
initScenesOnsenTanabata();
initEngine();

// App
initData();
initSrs();
initStorage();
initStreak();
initSession();
initUi();
initReminder();
initSettings();
initCommands();
initLifecycle();
initInstall();
initStart();
