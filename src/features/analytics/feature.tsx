import type { FeatureModule } from "../../core/types/feature"; import { AnalyticsPage } from "./pages/AnalyticsPage";
const feature: FeatureModule = { id: "analytics", routes: [{ path: "/statistics", component: AnalyticsPage, allowedRoles: ["ADMIN"] }], navigation: [{ label: "Estadísticas", path: "/statistics", allowedRoles: ["ADMIN"], order: 100 }] };
export default feature;
