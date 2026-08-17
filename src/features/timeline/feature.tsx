import type { FeatureModule } from "../../core/types/feature";
import type { UserRole } from "../../core/types/domain";
import { TimelinePage } from "./pages/TimelinePage";

const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = {
  id: "timeline",
  routes: [{ path: "/timeline", component: TimelinePage, allowedRoles: roles }],
  navigation: [{ label: "Línea de tiempo", path: "/timeline", allowedRoles: roles, order: 40 }],
};
export default feature;
