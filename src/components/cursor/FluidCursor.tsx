// FluidCanvas.tsx
import { useEffect } from "react";
// @ts-ignore
import { initFluidSimulation } from "./script.js";
import type { FluidSimInstance } from "./script";

export default function FluidCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("fluid-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const sim: FluidSimInstance = initFluidSimulation(canvas);
    console.log("Started simulation");
    return () => {
      sim.togglePause();
    };
  }, []);

  return (
    <canvas
      id="fluid-canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        cursor: "none",
      }}
    />
  );
}