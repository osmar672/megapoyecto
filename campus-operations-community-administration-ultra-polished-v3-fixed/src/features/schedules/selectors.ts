import type { ScheduleEntry } from "../../core/types"; export const selectDay=(items:ScheduleEntry[],day?:number)=>day?items.filter(e=>e.dayOfWeek===day):items;
