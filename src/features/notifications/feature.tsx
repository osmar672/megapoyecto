import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { NotificationsPage } from "./pages/NotificationsPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "notifications", routes: [{ path: "/notifications", component: NotificationsPage, allowedRoles: roles }], navigation: [{ label: "Notificaciones", path: "/notifications", allowedRoles: roles, order: 15 }] };
export default feature;
