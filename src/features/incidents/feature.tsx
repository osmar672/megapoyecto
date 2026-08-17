import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { IncidentsPage } from "./pages/IncidentsPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "incidents", routes: [{ path: "/incidents", component: IncidentsPage, allowedRoles: roles }], navigation: [{ label: "Incidencias", path: "/incidents", allowedRoles: roles, order: 130 }] };
export default feature;
