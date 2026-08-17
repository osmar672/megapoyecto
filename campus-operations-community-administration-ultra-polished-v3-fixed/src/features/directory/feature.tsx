import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { DirectoryPage } from "./page";
import { searchProvider } from "./searchProvider";

const roles=allRoles;
export const navigation:NavigationItem={label:"Directorio institucional",path:"/directory",allowedRoles:roles,order:105};
export const directoryFeature={id:"directory",navigation,routes:[{path:"/directory",element:<DirectoryPage/>,allowedRoles:roles}],search:searchProvider,widget:undefined};
