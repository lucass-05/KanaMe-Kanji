/* Estado compartido entre módulos: lo que cambia mientras se usa la app y se lee o modifica desde varios sitios.
   (Un módulo ES no puede reasignar las variables que importa, así que lo mutable vive aquí.)
     progress   tarjeta -> { due, reps, last, seen, ivl, ease }   se carga en storage.js
     DAILY_SIZE tamaño del reto diario: 5, 10 o 20                 storage.js / daily-size.js
     daily      reto de hoy: { date, list, ticked, v }             daily.js
     streak     racha: { cur, best, last }                          streak.js
     level      nivel elegido (0 = «Kanji de hoy»)                  session.js
     fromGroup  «Mostrar kanji a partir de» (1 = desactivado)       session.js / from-group.js
     current, flipped, cramMode, busy   tarjeta en pantalla y animación de giro   ui.js */
export var state = {};
