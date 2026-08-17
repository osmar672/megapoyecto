import { beforeEach, describe, expect, it } from "vitest"; import { emergencyRepository } from "../service"; import { emergenciesNavigation, emergenciesWidget } from "../feature";
const admin={id:"a",firstName:"A",lastName:"A",role:"ADMIN" as const,email:"a@x",isActive:true}; const staff={...admin,role:"STAFF" as const};
describe("Emergencies Module",()=>{beforeEach(()=>emergencyRepository.reset());
it("starts with no active emergency",()=>expect(emergencyRepository.list().filter(x=>x.status==="ACTIVE")).toHaveLength(0));
it("allows ADMIN to publish",()=>expect(emergencyRepository.publish(admin,{title:"Test",body:"Body",kind:"WARNING"}).status).toBe("ACTIVE"));
it("rejects non-admin publishing",()=>expect(()=>emergencyRepository.publish(staff,{title:"Test",body:"Body",kind:"WARNING"})).toThrow("FORBIDDEN"));
it("allows ADMIN to resolve",()=>{const n=emergencyRepository.publish(admin,{title:"Test",body:"Body",kind:"WARNING"}); expect(emergencyRepository.resolve(admin,n.id)?.status).toBe("RESOLVED")});
it("matches required navigation and widget orders",()=>{expect(emergenciesNavigation.path).toBe("/emergencies");expect(emergenciesNavigation.order).toBe(80);expect(emergenciesWidget.order).toBe(40)});});
