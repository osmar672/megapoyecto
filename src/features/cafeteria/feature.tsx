import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { CafeteriaPage } from "./pages/CafeteriaPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "cafeteria", routes: [{ path: "/cafeteria", component: CafeteriaPage, allowedRoles: roles }], navigation: [{ label: "Soda", path: "/cafeteria", allowedRoles: roles, order: 70 }] };
export default feature;
