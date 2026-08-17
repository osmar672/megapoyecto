import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { DocumentsPage } from "./page";
import { searchProvider } from "./searchProvider";

const roles=allRoles;
export const navigation:NavigationItem={label:"Documentos institucionales",path:"/documents",allowedRoles:roles,order:90};
export const documentsFeature={id:"documents",navigation,routes:[{path:"/documents",element:<DocumentsPage/>,allowedRoles:roles}],search:searchProvider,widget:undefined};
