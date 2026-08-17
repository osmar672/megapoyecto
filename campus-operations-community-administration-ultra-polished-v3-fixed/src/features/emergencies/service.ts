import { storage } from "../../core/storage"; import { eventBus } from "../../core/events"; import { emergencySeed } from "./data"; import { assertEmergencyAdmin } from "./permissions"; import type { EmergencyNotice, User } from "../../core/types";
const KEY="emergencies";
export const emergencyRepository={
 list(){return storage.get<EmergencyNotice[]>(KEY, emergencySeed);},
 publish(user:User,input:Omit<EmergencyNotice,"id"|"authorUserId"|"publishedAt"|"status">){assertEmergencyAdmin(user); const notice:EmergencyNotice={...input,id:crypto.randomUUID(),authorUserId:user.id,publishedAt:new Date().toISOString(),status:"ACTIVE"}; storage.set(KEY,[notice,...this.list()]); eventBus.emit("emergency:changed",{notice}); return notice;},
 resolve(user:User,id:string){assertEmergencyAdmin(user); const data=this.list().map((item)=>item.id===id?{...item,status:"RESOLVED" as const,resolvedAt:new Date().toISOString()}:item); storage.set(KEY,data); eventBus.emit("emergency:changed",{id}); return data.find((item)=>item.id===id);},
 reset(){storage.set(KEY,emergencySeed);},
};
