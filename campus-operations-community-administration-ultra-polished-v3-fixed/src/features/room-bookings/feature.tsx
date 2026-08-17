import type { NavigationItem } from "../../core/types";
import { allRoles, adminStaffTeacher } from "../shared";
import { RoomBookingsPage } from "./page";
import { searchProvider } from "./searchProvider";
import { dashboardWidget } from "./dashboardWidget";
const roles=adminStaffTeacher;
export const navigation:NavigationItem={label:"Reserva de espacios",path:"/room-bookings",allowedRoles:roles,order:75};
export const roombookingsFeature={id:"room-bookings",navigation,routes:[{path:"/room-bookings",element:<RoomBookingsPage/>,allowedRoles:roles}],search:searchProvider,widget:dashboardWidget};
