/* 江戸 Edo: paisaje a tinta (sansui) */
import { MINCHO } from "./varias.js";
import { WC, seeded, svg, washi } from "../shapes.js";
import { edoLandscape } from "./edo.js";
import { f } from "../medals.js";
import { patchPal } from "./common.js";

export function init() {
  patchPal("edo", {
    edo: false, scene: edoLandscape, tile: washi(), tileSize: "220px 220px",
    bg: "#e6e1d2", surface: "#f3f0e6", raised: "#e2ddcc", hairline: "#c8c1ab",
    text: "#1f1d18", muted: "#5a574b", faint: "#8c8878", status: "#3f4a3a", accent: "#b5332a",
    grad: "linear-gradient(180deg, #ebe7da 0%, #e4dfcf 60%, #dcd6c3 100%)", glow: "rgba(60,70,50,.12)",
    pantone: "Inspirada en PANTONE Sand Dollar 13-1106 (papel), Agave Green 19-5414 (montes) y True Red 19-1664 (sello)"
  });
}
