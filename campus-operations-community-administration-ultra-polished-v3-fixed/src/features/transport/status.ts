import type { Bus } from "../../core/types";
export const statusLabel=(status:Bus["status"])=>({ON_TIME:"A tiempo",DELAYED:"Con demora",UNAVAILABLE:"No disponible"}[status]);
