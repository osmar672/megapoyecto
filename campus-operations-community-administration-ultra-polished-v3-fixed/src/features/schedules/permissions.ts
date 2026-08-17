import type { User } from "../../core/types"; export const canManageSchedules=(user:User)=>user.role==="ADMIN";
