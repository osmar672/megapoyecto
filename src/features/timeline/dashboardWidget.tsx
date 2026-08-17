import type {
  DashboardWidgetDefinition,
  DashboardWidgetProps,
} from "../../core/dashboard/dashboardWidgetRegistry";
import type { UserRole } from "../../core/types/domain";
import { timelineRepository } from "./services/timelineRepository";

function TimelineWidget({ user }: DashboardWidgetProps) {
  const next = timelineRepository.findNext(user.role);
  return next ? (
    <div>
      <strong>{next.title}</strong>
      <p>
        {new Intl.DateTimeFormat("es-CR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(next.startsAt))}
      </p>
    </div>
  ) : (
    <p>No hay actividades próximas.</p>
  );
}

const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];

const widget: DashboardWidgetDefinition = {
  id: "next-activity",
  title: "Próxima actividad",
  component: TimelineWidget,
  allowedRoles: roles,
  order: 20,
};

export default widget;
