import type { FeatureModule } from "../../core/types/feature";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";

const allRoles = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"] as const;

const announcementsFeature: FeatureModule = {
  id: "announcements",
  routes: [{ path: "/announcements", component: AnnouncementsPage, allowedRoles: [...allRoles] }],
  navigation: [{ label: "Comunicados", path: "/announcements", allowedRoles: [...allRoles], order: 30 }],
};

export default announcementsFeature;
