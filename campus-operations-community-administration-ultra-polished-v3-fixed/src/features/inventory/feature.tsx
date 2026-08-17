import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { InventoryPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=adminStaffTeacher;
export const navigation:NavigationItem={label:"Inventario escolar",path:"/inventory",allowedRoles:roles,order:100};
export const inventoryFeature={id:"inventory",navigation,routes:[{path:"/inventory",element:<InventoryPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
