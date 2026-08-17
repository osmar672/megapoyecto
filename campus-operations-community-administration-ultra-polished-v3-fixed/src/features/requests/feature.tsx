import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { RequestsPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=allRoles;
export const navigation:NavigationItem={label:"Solicitudes administrativas",path:"/requests",allowedRoles:roles,order:95};
export const requestsFeature={id:"requests",navigation,routes:[{path:"/requests",element:<RequestsPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
