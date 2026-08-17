import type { BusRoute } from "../../core/types";
export const getRouteSchedule=(route:BusRoute)=>route.stops.map(stop=>({stop:stop.name,time:stop.scheduledTime}));
