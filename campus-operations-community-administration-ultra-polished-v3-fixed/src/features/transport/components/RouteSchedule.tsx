import type { BusRoute } from "../../../core/types";
export function RouteSchedule({route}:{route:BusRoute}){return <div>{route.stops.map((stop)=><div className="meta" key={stop.id}>{stop.scheduledTime} · {stop.name}</div>)}</div>}
