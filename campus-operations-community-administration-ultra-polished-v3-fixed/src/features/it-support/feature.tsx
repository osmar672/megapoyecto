import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { ItSupportPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=allRoles;
export const navigation:NavigationItem={label:"Soporte tecnológico",path:"/it-support",allowedRoles:roles,order:110};
export const itsupportFeature={id:"it-support",navigation,routes:[{path:"/it-support",element:<ItSupportPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
