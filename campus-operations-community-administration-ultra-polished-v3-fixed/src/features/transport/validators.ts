import type { Bus, BusRoute } from "../../core/types";
export const isValidBus=(bus:Bus)=>Boolean(bus.id&&bus.number&&bus.routeId&&bus.driverName);
export const isValidRoute=(route:BusRoute)=>Boolean(route.id&&route.name&&route.stops.length>0);
