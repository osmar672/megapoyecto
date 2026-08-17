import type { User } from "../../core/types";
export const assertEmergencyAdmin=(user:User)=>{ if(user.role!=="ADMIN") throw new Error("FORBIDDEN"); };
