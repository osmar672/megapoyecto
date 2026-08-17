import type { DashboardWidgetDefinition } from "../../core/dashboard/dashboardWidgetRegistry"; import type { ForumPost, UserRole } from "../../core/types/domain"; import { localStorageService } from "../../core/storage/storageService"; import { storageKeys } from "../../core/storage/storageKeys";
function ForumWidget() { const posts = localStorageService.get<ForumPost[]>(storageKeys.forumPosts, []).value.filter((post) => post.status === "ACTIVE"); return <div><strong>{posts.length} conversaciones activas</strong><p>{posts[0]?.title ?? "El foro está al día."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "forum-activity", title: "Actividad del foro", component: ForumWidget, allowedRoles: roles, order: 60 };
export default widget;
