import type { EmergencyNotice, User } from "../../core/types";
export const canManageEmergencies=(user:User)=>user.role==="ADMIN";
export const activeEmergencies=(items:EmergencyNotice[])=>items.filter((item)=>item.status==="ACTIVE");
