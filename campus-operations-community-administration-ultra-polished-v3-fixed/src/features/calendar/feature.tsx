import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { CalendarPage } from "./page";
import { searchProvider } from "./searchProvider";

const roles=allRoles;
export const navigation:NavigationItem={label:"Calendario institucional",path:"/calendar",allowedRoles:roles,order:25};
export const calendarFeature={id:"calendar",navigation,routes:[{path:"/calendar",element:<CalendarPage/>,allowedRoles:roles}],search:searchProvider,widget:undefined};
