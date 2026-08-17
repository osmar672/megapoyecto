import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { storageKeys } from "../core/storage/storageKeys";
import type { Bus, BusRoute, CafeteriaProduct, CampusLocation, Incident, TimelineEvent } from "../core/types/domain";

describe("datos demostrativos de expansión", () => {
  beforeEach(async () => initializeSeedData());

  it("crea todas las colecciones requeridas", () => {
    expect(JSON.parse(localStorage.getItem(storageKeys.timelineEvents) ?? "[]") as TimelineEvent[]).toHaveLength(10);
    expect(JSON.parse(localStorage.getItem(storageKeys.campusLocations) ?? "[]") as CampusLocation[]).toHaveLength(12);
    expect(JSON.parse(localStorage.getItem(storageKeys.buses) ?? "[]") as Bus[]).toHaveLength(4);
    expect(JSON.parse(localStorage.getItem(storageKeys.cafeteriaProducts) ?? "[]") as CafeteriaProduct[]).toHaveLength(15);
    expect(JSON.parse(localStorage.getItem(storageKeys.incidents) ?? "[]") as Incident[]).toHaveLength(10);
  });

  it("genera horas válidas para cada parada de transporte", () => {
    const routes = JSON.parse(localStorage.getItem(storageKeys.busRoutes) ?? "[]") as BusRoute[];
    const southernRoute = routes.find((route) => route.id === "route_south");

    expect(southernRoute?.stops.map((stop) => stop.scheduledTime)).toEqual(["05:55", "06:10", "06:25", "06:40"]);
    expect(routes.flatMap((route) => route.stops).every((stop) => /^([01]\d|2[0-3]):[0-5]\d$/.test(stop.scheduledTime))).toBe(true);
  });

  it("es idempotente y conserva registros creados por el usuario", async () => {
    const events = JSON.parse(localStorage.getItem(storageKeys.timelineEvents) ?? "[]") as TimelineEvent[];
    localStorage.setItem(storageKeys.timelineEvents, JSON.stringify([...events, { ...events[0], id: "evt_custom" }]));
    await initializeSeedData();
    const migrated = JSON.parse(localStorage.getItem(storageKeys.timelineEvents) ?? "[]") as TimelineEvent[];
    expect(migrated).toHaveLength(11);
    expect(migrated.filter((event) => event.id === "evt_001")).toHaveLength(1);
    expect(migrated.some((event) => event.id === "evt_custom")).toBe(true);
  });
});
