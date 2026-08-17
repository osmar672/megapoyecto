import { beforeEach,describe,expect,it } from "vitest"; import { cafeteriaRepository } from "../service"; import { cafeteriaNavigation } from "../feature"; import { cafeteriaSearch } from "../search"; import { availableProducts,categories } from "../domain";
describe("Cafeteria Module",()=>{beforeEach(()=>cafeteriaRepository.reset());
it("maintains at least fifteen products",()=>expect(cafeteriaRepository.list()).toHaveLength(15));
it("contains all required categories",()=>expect(new Set(cafeteriaRepository.list().map(p=>p.category))).toEqual(new Set(categories)));
it("filters by query",()=>expect(cafeteriaRepository.list("arroz").every(p=>`${p.name} ${p.description} ${p.category}`.toLowerCase().includes("arroz"))).toBe(true));
it("filters by category",()=>expect(cafeteriaRepository.list("","BEBIDAS").every(p=>p.category==="BEBIDAS")).toBe(true));
it("supports per-user favorites",()=>{expect(cafeteriaRepository.toggleFavorite("u1","prod1")).toContain("prod1");expect(cafeteriaRepository.toggleFavorite("u1","prod1")).not.toContain("prod1")});
it("exposes PRODUCTS search",()=>expect(cafeteriaSearch.search("jugo")[0]?.category).toBe("PRODUCTS"));
it("uses required navigation order and availability selector",()=>{expect(cafeteriaNavigation.path).toBe("/cafeteria");expect(cafeteriaNavigation.order).toBe(60);expect(availableProducts(cafeteriaRepository.list())).toHaveLength(15)});});
