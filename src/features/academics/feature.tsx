import type { FeatureModule } from "../../core/types/feature";
import { AcademicsPage } from "./pages/AcademicsPage";

const allRoles = ["ADMIN", "TEACHER", "STUDENT_FAMILY"] as const;

const academicsFeature: FeatureModule = {
  id: "academics",
  routes: [{ path: "/academics", component: AcademicsPage, allowedRoles: [...allRoles] }],
  navigation: [{ label: "Académico", path: "/academics", allowedRoles: [...allRoles], order: 20 }],
};

export default academicsFeature;
