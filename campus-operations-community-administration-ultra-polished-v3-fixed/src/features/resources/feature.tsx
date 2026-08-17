import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { ResourcesPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=adminStaffTeacher;
export const navigation:NavigationItem={label:"Recursos tecnológicos",path:"/resources",allowedRoles:roles,order:85};
export const resourcesFeature={id:"resources",navigation,routes:[{path:"/resources",element:<ResourcesPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
