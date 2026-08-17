import type { Bus } from "../../core/types";
export const advanceBus=(bus:Bus,delta=5):Bus=>({...bus,position:{...bus.position,x:Math.min(100,bus.position.x+delta)}});
