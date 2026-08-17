import type { DashboardWidgetDefinition, DashboardWidgetProps } from "../../core/dashboard/dashboardWidgetRegistry"; import type { UserRole } from "../../core/types/domain"; import { notificationService } from "../../core/notifications/notificationService";
function NotificationWidget({ user }: DashboardWidgetProps) { const count = notificationService.getUnreadCount(user.id); return <div><strong>{count} sin leer</strong><p>{count ? "Revisa las actualizaciones recientes." : "Estás al día."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "unread-notifications", title: "Notificaciones", component: NotificationWidget, allowedRoles: roles, order: 40 };
export default widget;
