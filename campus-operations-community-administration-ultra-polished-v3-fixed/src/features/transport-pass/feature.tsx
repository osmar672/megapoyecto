import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { TransportPassPage } from "./page";
import { searchProvider } from "./searchProvider";

const roles=allRoles;
export const navigation:NavigationItem={label:"Pases de transporte",path:"/transport-pass",allowedRoles:roles,order:55};
export const transportPassFeature={id:"transport-pass",navigation,routes:[{path:"/transport-pass",element:<TransportPassPage/>,allowedRoles:roles}],search:searchProvider,widget:undefined};
