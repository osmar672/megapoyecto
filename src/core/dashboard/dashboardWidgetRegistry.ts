import type { ComponentType } from "react";
import type { User, UserRole } from "../types/domain";

export interface DashboardWidgetProps {
  user: User;
}

export interface DashboardWidgetDefinition {
  id: string;
  title: string;
  component: ComponentType<DashboardWidgetProps>;
  allowedRoles: UserRole[];
  order: number;
}

export class DashboardWidgetRegistry {
  private readonly widgets = new Map<string, DashboardWidgetDefinition>();

  constructor(widgets: DashboardWidgetDefinition[] = []) {
    widgets.forEach((widget) => this.register(widget));
  }

  register(widget: DashboardWidgetDefinition): void {
    this.widgets.set(widget.id, widget);
  }

  listForRole(role: UserRole): DashboardWidgetDefinition[] {
    return [...this.widgets.values()]
      .filter((widget) => widget.allowedRoles.includes(role))
      .sort((first, second) => first.order - second.order);
  }
}

const modules = import.meta.glob(
  "../../features/**/dashboardWidget.tsx",
  { eager: true, import: "default" },
) as Record<string, DashboardWidgetDefinition>;

export const dashboardWidgetRegistry = new DashboardWidgetRegistry(
  Object.values(modules),
);
