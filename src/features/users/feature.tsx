import type { FeatureModule } from "../../core/types/feature";
import { UsersPage } from "./pages/UsersPage";

const usersFeature: FeatureModule = {
  id: "users",
  routes: [{ path: "/users", component: UsersPage, allowedRoles: ["ADMIN"] }],
  navigation: [{ label: "Usuarios", path: "/users", allowedRoles: ["ADMIN"], order: 40 }],
};

export default usersFeature;
