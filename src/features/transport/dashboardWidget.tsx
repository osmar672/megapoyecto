import type { DashboardWidgetDefinition } from "../../core/dashboard/dashboardWidgetRegistry"; import type { UserRole } from "../../core/types/domain"; import { transportRepository } from "./services/transportRepository";
function TransportWidget() { const buses = transportRepository.listBuses(); const delayed = buses.filter((bus) => bus.status === "DELAYED").length; return <div><strong>{buses.length} buses registrados</strong><p>{delayed ? `${delayed} unidad retrasada` : "Rutas operando sin retrasos."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "transport-status", title: "Estado del transporte", component: TransportWidget, allowedRoles: roles, order: 30 };
export default widget;
