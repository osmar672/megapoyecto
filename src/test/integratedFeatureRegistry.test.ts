import { describe, expect, it } from "vitest";
import { registeredNavigation, registeredRoutes } from "../core/featureRegistry";
import { dashboardWidgetRegistry } from "../core/dashboard/dashboardWidgetRegistry";
import { searchProviderRegistry } from "../core/search/searchProviderRegistry";

describe("integración automática de módulos", () => {
  it("registra todas las rutas operativas y de comunidad", () => {
    const paths = registeredRoutes.map((route) => route.path);
    expect(paths).toEqual(expect.arrayContaining(["/timeline", "/campus-map", "/emergencies", "/transport", "/transport/schedules", "/cafeteria", "/schedules", "/statistics", "/achievements", "/forum", "/incidents", "/notifications"]));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("registra navegación, búsquedas y widgets sin arreglos centrales", () => {
    expect(registeredNavigation.some((item) => item.path === "/campus-map")).toBe(true);
    expect(searchProviderRegistry.list().map((provider) => provider.id)).toEqual(expect.arrayContaining(["timeline", "campus-map", "transport", "cafeteria", "schedules", "forum", "incidents", "announcements"]));
    expect(dashboardWidgetRegistry.listForRole("STUDENT_FAMILY").length).toBeGreaterThanOrEqual(6);
    expect(dashboardWidgetRegistry.listForRole("TEACHER").every((widget) => widget.id !== "administrative-statistics")).toBe(true);
  });
});
