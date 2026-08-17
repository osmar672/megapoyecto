import type { User } from "../../core/types"; export const canManageTransport=(user:User)=>user.role==="ADMIN"||user.role==="STAFF";
