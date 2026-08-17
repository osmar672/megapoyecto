export const formatRouteWindow=(departure:string,arrival:string)=>`${departure} — ${arrival}`; export const formatBusStatus=(status:string)=>status.replaceAll("_"," ");
