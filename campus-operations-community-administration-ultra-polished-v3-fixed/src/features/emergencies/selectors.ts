import type { EmergencyNotice } from "../../core/types";
export const selectActive=(items:EmergencyNotice[])=>items.filter((item)=>item.status==="ACTIVE");
export const selectResolved=(items:EmergencyNotice[])=>items.filter((item)=>item.status==="RESOLVED");
