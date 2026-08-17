import { beforeEach,describe,expect,it } from "vitest"; import { transportRepository } from "../service"; import { transportNavigation,transportWidget } from "../feature"; import { transportSearch } from "../search"; import { routeBuses,sortedStops } from "../domain";
describe("Transport Module",()=>{beforeEach(()=>transportRepository.reset());
it("maintains exactly four buses and two shifts",()=>{expect(transportRepository.buses()).toHaveLength(4);expect(new Set(transportRepository.routes().map(r=>r.shift))).toEqual(new Set(["MORNING","AFTERNOON"]))});
it("orders stops and filters buses by route",()=>{const route=transportRepository.routes()[0];expect(sortedStops(route).map(s=>s.order)).toEqual([1,2,3]);expect(routeBuses(transportRepository.buses(),route.id)).toHaveLength(2)});
it("exposes ROUTES search and both transport paths",()=>{expect(transportSearch.search("ruta")[0]?.category).toBe("ROUTES");expect(transportNavigation.path).toBe("/transport")});
it("uses required navigation and widget orders",()=>{expect(transportNavigation.order).toBe(50);expect(transportWidget.order).toBe(30)});});
