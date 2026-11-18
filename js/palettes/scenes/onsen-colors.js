/* 温泉 Onsen: colores de la paleta (el dibujo del fondo está en onsen-tanabata.js) */
import { patchPal } from "./common.js";

export function init() {
  patchPal("onsen", {
    light: false, bg: "#1b2332", surface: "#232d3e", raised: "#2c3749", hairline: "#3f4c62",
    text: "#f4f1ea", muted: "#c3c8d2", faint: "#8a93a3", accent: "#f2b35e", status: "#7fd6da",
    again: "#e0707a", hard: "#e0a050", good: "#6cc28a", easy: "#7fb4e8",
    grad: "linear-gradient(180deg, #2c3a52 0%, #55667f 40%, #7a8aa2 70%, #8e9cb2 100%)", surfA: "d8", glow: "rgba(242,179,94,.2)",
    amb: [{ kind: "fall", shape: "dot", colors: ["#ffffff", "#eef4fa"], n: 34, size: [3, 7], dur: [9, 16], o: 1 }],
    pantone: "Inspirada en PANTONE Turquoise 15-5519 (agua), Blue Fusion 19-4118 (anochecer) y Mimosa 14-0848 (faroles)"
  });
}
