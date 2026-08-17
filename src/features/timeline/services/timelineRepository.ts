import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { TimelineEvent, UserRole } from "../../../core/types/domain";

export type TimelineRange = "TODAY" | "WEEK" | "MONTH" | "YEAR";

function readAll(): TimelineEvent[] {
  return localStorageService.get<TimelineEvent[]>(storageKeys.timelineEvents, []).value;
}

function endOfRange(range: TimelineRange, from: Date): Date {
  const end = new Date(from);
  if (range === "TODAY") end.setHours(23, 59, 59, 999);
  if (range === "WEEK") end.setDate(end.getDate() + 7);
  if (range === "MONTH") end.setMonth(end.getMonth() + 1);
  if (range === "YEAR") end.setFullYear(end.getFullYear() + 1);
  return end;
}

export const timelineRepository = {
  list(role: UserRole): TimelineEvent[] {
    return readAll()
      .filter((event) => event.audience === "ALL" || event.audience === role)
      .sort((first, second) => first.startsAt.localeCompare(second.startsAt));
  },

  listInRange(role: UserRole, range: TimelineRange, from = new Date()): TimelineEvent[] {
    const end = endOfRange(range, from).getTime();
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    return this.list(role).filter((event) => {
      const eventTime = new Date(event.startsAt).getTime();
      return eventTime >= start.getTime() && eventTime <= end;
    });
  },

  findNext(role: UserRole, from = new Date()): TimelineEvent | undefined {
    const fromTime = from.getTime();
    return this.list(role).find((event) => new Date(event.startsAt).getTime() >= fromTime);
  },
};
