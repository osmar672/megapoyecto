import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { LibraryPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=allRoles;
export const navigation:NavigationItem={label:"Biblioteca escolar",path:"/library",allowedRoles:roles,order:70};
export const libraryFeature={id:"library",navigation,routes:[{path:"/library",element:<LibraryPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
