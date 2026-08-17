import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { ForumPage } from "./pages/ForumPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "forum", routes: [{ path: "/forum", component: ForumPage, allowedRoles: roles }], navigation: [{ label: "Foro", path: "/forum", allowedRoles: roles, order: 120 }] };
export default feature;
