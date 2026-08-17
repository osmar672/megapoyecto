import type { DashboardWidgetDefinition, DashboardWidgetProps } from "../../core/dashboard/dashboardWidgetRegistry"; import type { UserRole } from "../../core/types/domain"; import { achievementRepository } from "./services/achievementRepository";
function AchievementWidget({ user }: DashboardWidgetProps) { const unlocked = achievementRepository.listForUser(user).filter((item) => item.unlockedAt); return <div><strong>{unlocked.length} logros desbloqueados</strong><p>{unlocked.at(-1)?.title ?? "Aún no hay logros recientes."}</p></div>; }
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const widget: DashboardWidgetDefinition = { id: "recent-achievements", title: "Logros recientes", component: AchievementWidget, allowedRoles: roles, order: 50 };
export default widget;
