import type { DashboardWidgetDefinition } from "../../core/dashboard/dashboardWidgetRegistry"; import type { UserRole } from "../../core/types/domain"; import { emergencyRepository } from "./services/emergencyRepository";
function EmergencyWidget() { const active = emergencyRepository.list().filter((notice) => notice.status === "ACTIVE"); return <div><strong>{active.length ? `${active.length} aviso activo` : "Operación normal"}</strong><p>{active[0]?.title ?? "Sin alertas activas."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "emergency-status", title: "Estado de emergencia", component: EmergencyWidget, allowedRoles: roles, order: 5 };
export default widget;
