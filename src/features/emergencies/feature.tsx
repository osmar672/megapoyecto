import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { EmergenciesPage } from "./pages/EmergenciesPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "emergencies", routes: [{ path: "/emergencies", component: EmergenciesPage, allowedRoles: roles }], navigation: [{ label: "Emergencias", path: "/emergencies", allowedRoles: roles, order: 90 }] };
export default feature;
