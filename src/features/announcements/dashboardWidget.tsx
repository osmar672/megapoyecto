import type { DashboardWidgetDefinition, DashboardWidgetProps } from "../../core/dashboard/dashboardWidgetRegistry";
import type { Announcement, UserRole } from "../../core/types/domain";
import { localStorageService } from "../../core/storage/storageService";
import { storageKeys } from "../../core/storage/storageKeys";

function AnnouncementWidget({ user }: DashboardWidgetProps) {
  const latest = localStorageService.get<Announcement[]>(storageKeys.announcements, []).value
    .filter((announcement) => announcement.status === "PUBLISHED" && (announcement.audience === "ALL" || announcement.audience === user.role))
    .sort((first, second) => (second.publishedAt ?? second.updatedAt).localeCompare(first.publishedAt ?? first.updatedAt))[0];
  return latest ? <div><strong>{latest.title}</strong><p>{latest.body.slice(0, 110)}</p></div> : <p>No hay comunicados recientes.</p>;
}
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "latest-announcement", title: "Aviso reciente", component: AnnouncementWidget, allowedRoles: roles, order: 35 };
export default widget;
