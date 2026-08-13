import type { FeatureModule } from "../../core/types/feature";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RootRedirect } from "./pages/RootRedirect";

const allRoles = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"] as const;

const authFeature: FeatureModule = {
  id: "foundation-auth",
  routes: [
    { path: "/", component: RootRedirect, allowedRoles: [], isPublic: true },
    { path: "/login", component: LoginPage, allowedRoles: [], isPublic: true },
    { path: "/dashboard", component: DashboardPage, allowedRoles: [...allRoles] },
    { path: "/403", component: AccessDeniedPage, allowedRoles: [], isPublic: true },
  ],
  navigation: [
    { label: "Panel principal", path: "/dashboard", allowedRoles: [...allRoles], order: 10 },
  ],
};

export default authFeature;
