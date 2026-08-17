import type {
  DashboardWidgetDefinition,
  DashboardWidgetProps,
} from "../../core/dashboard/dashboardWidgetRegistry";
import type { UserRole } from "../../core/types/domain";
import { scheduleRepository } from "./services/scheduleRepository";

function ScheduleWidget({ user }: DashboardWidgetProps) {
  const next = scheduleRepository.findNextForUser(user);
  return next ? (
    <div>
      <strong>{next.subject}</strong>
      <p>
        {next.startTime} · {next.location}
      </p>
    </div>
  ) : (
    <p>No hay clases próximas.</p>
  );
}

const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];

const widget: DashboardWidgetDefinition = {
  id: "next-class",
  title: "Próxima clase",
  component: ScheduleWidget,
  allowedRoles: roles,
  order: 10,
};

export default widget;
