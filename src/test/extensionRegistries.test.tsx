import { describe, expect, it } from "vitest";
import {
  DashboardWidgetRegistry,
  type DashboardWidgetDefinition,
} from "../core/dashboard/dashboardWidgetRegistry";
import {
  SearchProviderRegistry,
  type SearchProvider,
} from "../core/search/searchProviderRegistry";

describe("registros automáticos de extensión", () => {
  it("agrupa resultados y excluye los que no permite el rol", () => {
    const provider: SearchProvider = {
      id: "test-provider",
      search: () => [
        {
          id: "result_teacher",
          category: "PEOPLE",
          title: "Docente",
          description: "Perfil docente",
          path: "/profile/teacher",
          keywords: ["docente"],
          allowedRoles: ["ADMIN"],
          source: "test-provider",
        },
        {
          id: "result_library",
          category: "PLACES",
          title: "Biblioteca",
          description: "Edificio principal",
          path: "/map/library",
          keywords: ["biblioteca"],
          allowedRoles: ["ADMIN", "STAFF"],
          source: "test-provider",
        },
      ],
    };
    const registry = new SearchProviderRegistry([provider]);

    expect(registry.search("biblioteca", { userId: "usr_staff_001", role: "STAFF" }))
      .toHaveLength(1);
    expect(registry.search("  ", { userId: "usr_staff_001", role: "STAFF" })).toEqual([]);
  });

  it("ordena widgets y aplica permisos por rol", () => {
    const StubWidget = () => null;
    const widgets: DashboardWidgetDefinition[] = [
      {
        id: "second",
        title: "Segundo",
        component: StubWidget,
        allowedRoles: ["STAFF"],
        order: 20,
      },
      {
        id: "first",
        title: "Primero",
        component: StubWidget,
        allowedRoles: ["ADMIN", "STAFF"],
        order: 10,
      },
    ];
    const registry = new DashboardWidgetRegistry(widgets);

    expect(registry.listForRole("STAFF").map((widget) => widget.id)).toEqual([
      "first",
      "second",
    ]);
    expect(registry.listForRole("TEACHER")).toEqual([]);
  });
});
