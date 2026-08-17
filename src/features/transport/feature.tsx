import type { UserRole } from "../../core/types/domain"; import type { FeatureModule } from "../../core/types/feature"; import { BusSchedulesPage, TransportPage } from "./pages/TransportPage";
const roles: UserRole[] = ["ADMIN", "TEACHER", "STUDENT_FAMILY", "STAFF"];
const feature: FeatureModule = { id: "transport", routes: [{ path: "/transport", component: TransportPage, allowedRoles: roles }, { path: "/transport/schedules", component: BusSchedulesPage, allowedRoles: roles }], navigation: [{ label: "Transporte", path: "/transport", allowedRoles: roles, order: 60 }, { label: "Horarios de buses", path: "/transport/schedules", allowedRoles: roles, order: 61 }] };
export default feature;
