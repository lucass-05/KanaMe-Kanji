# Recordatorios diarios de KanaMe

Una web no puede programar sola un aviso a una hora concreta con la app cerrada. Lo hace este pequeño servidor gratuito en **Cloudflare Workers**: guarda la hora que elige cada usuario y, cada 15 minutos, envía una notificación push a quien le toca y aún no ha hecho los kanji del día.

- Sin coste: cabe de sobra en el plan gratuito de Cloudflare.
- Sin claves que copiar: las claves de envío (VAPID) se generan solas la primera vez.
- Sin datos personales: solo guarda la dirección anónima de notificaciones del móvil, la hora y el último día completado.

## Ponerlo en marcha (≈10 minutos)

1. **Crea una cuenta gratuita** en [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. **Crea el almacén de datos.** En el menú, *Storage & Databases → KV → Create* (o *Create namespace*). Nombre: `kaname-push`.
3. **Crea el Worker.** *Workers & Pages → Create → Worker* (plantilla «Hello World»). Nombre: `kaname-push` → *Deploy*.
4. **Pega el código.** En el Worker, pulsa *Edit code*, borra lo que haya, pega el contenido de [`worker.js`](worker.js) y pulsa *Deploy*.
5. **Conecta el almacén.** En el Worker: *Settings → Bindings → Add → KV namespace*.
   - *Variable name*: `SUBS`
   - *KV namespace*: `kaname-push`
6. **Programa el envío.** En el Worker: *Settings → Triggers → Cron Triggers → Add*. Expresión: `*/15 * * * *` (cada 15 minutos).
7. **Comprueba que funciona.** Abre la dirección del Worker añadiendo `/key` al final, por ejemplo `https://kaname-push.tu-usuario.workers.dev/key`. Debe mostrar `{"publicKey":"B…"}`.
8. **Conecta la app.** En `index.html`, pon esa dirección (sin `/key`) en la línea:
   ```js
   var PUSH_URL = "https://kaname-push.tu-usuario.workers.dev";
   ```
   Sube el cambio y la app empezará a ofrecer el recordatorio.

> Los nombres de los menús de Cloudflare pueden cambiar ligeramente con el tiempo, pero los pasos son siempre los mismos: KV, Worker, binding `SUBS` y cron cada 15 minutos.

## Cómo funciona

| Petición | Qué hace |
|---|---|
| `GET /key` | Devuelve la clave pública con la que el móvil se suscribe |
| `POST /subscribe` | Guarda o actualiza la suscripción y la hora (en franjas UTC de 15 min) |
| `POST /unsubscribe` | Borra la suscripción |
| `POST /done` | Marca que hoy ya se han completado los kanji, para no avisar |
| cron cada 15 min | Envía el aviso a quien le toca en esa franja |

El aviso se envía sin contenido; el service worker de la app (`sw.js`) compone el mensaje con la racha guardada en el móvil («🔥 Racha de 12 días: completa los kanji de hoy para no perderla»).

**Compatibilidad:** Android (Chrome, Samsung Internet, Firefox) y ordenador. En iPhone y iPad funciona con iOS 16.4 o posterior, **solo si KanaMe está añadida a la pantalla de inicio**.

**Límites del plan gratuito:** cada usuario que completa el día hace una escritura en KV, y el plan gratuito permite 1000 escrituras diarias. Si algún día tienes cientos de usuarios activos a diario, basta con pasar al plan de pago de Workers (unos 5 $/mes).
