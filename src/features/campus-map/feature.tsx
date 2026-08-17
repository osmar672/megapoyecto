import type { UserRole } from "../../core/types/domain";
import type { FeatureModule } from "../../core/types/feature";
import { CampusMapPage } from "./pages/CampusMapPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "campus-map", routes: [{ path: "/campus-map", component: CampusMapPage, allowedRoles: roles }], navigation: [{ label: "Mapa del campus", path: "/campus-map", allowedRoles: roles, order: 50 }] };
export default feature;
