import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { AchievementsPage } from "./pages/AchievementsPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "achievements", routes: [{ path: "/achievements", component: AchievementsPage, allowedRoles: roles }], navigation: [{ label: "Logros", path: "/achievements", allowedRoles: roles, order: 110 }] };
export default feature;
