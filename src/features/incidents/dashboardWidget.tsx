import type { DashboardWidgetDefinition, DashboardWidgetProps } from "../../core/dashboard/dashboardWidgetRegistry"; import type { UserRole } from "../../core/types/domain"; import { incidentRepository } from "./services/incidentRepository";
function IncidentWidget({ user }: DashboardWidgetProps) { const open = incidentRepository.listVisible(user).filter((incident) => !["RESOLVED", "CLOSED"].includes(incident.status)); return <div><strong>{open.length} incidencias abiertas</strong><p>{open.length ? "Hay casos pendientes de seguimiento." : "Sin casos pendientes."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "incident-status", title: "Estado de incidencias", component: IncidentWidget, allowedRoles: roles, order: 70 };
export default widget;
