import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { SchedulesPage } from "./pages/SchedulesPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "schedules", routes: [{ path: "/schedules", component: SchedulesPage, allowedRoles: roles }], navigation: [{ label: "Horario escolar", path: "/schedules", allowedRoles: roles, order: 30 }] };
export default feature;
