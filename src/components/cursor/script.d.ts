
export interface FluidSimInstance {
  togglePause: () => void;
  config: Record<string, any>;
}
export function initFluidSimulation(canvas: HTMLCanvasElement): FluidSimInstance;