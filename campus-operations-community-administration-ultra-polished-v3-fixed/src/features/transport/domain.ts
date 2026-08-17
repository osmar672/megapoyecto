import type { Bus, BusRoute } from "../../core/types";
export const activeRoutes=(routes:BusRoute[])=>routes.filter(r=>r.isActive); export const routeBuses=(buses:Bus[],routeId:string)=>buses.filter(b=>b.routeId===routeId); export const sortedStops=(route:BusRoute)=>[...route.stops].sort((a,b)=>a.order-b.order);
