import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { ScheduleEntry, User } from "../../../core/types/domain";

type ScheduleViewer = Pick<User, "id" | "role" | "relatedStudentId">;

export type ScheduleUpdateInput = Pick<
  ScheduleEntry,
  "id" | "startTime" | "endTime" | "location"
>;

function readAll(): ScheduleEntry[] {
  return localStorageService.get<ScheduleEntry[]>(storageKeys.scheduleEntries, []).value;
}

export const scheduleRepository = {
  listForUser(user: ScheduleViewer): ScheduleEntry[] {
    const entries = readAll();
    let visible: ScheduleEntry[];
    if (user.role === "ADMIN" || user.role === "STAFF") {
      visible = entries;
    } else if (user.role === "TEACHER") {
      visible = entries.filter((entry) => entry.userId === user.id);
    } else {
      visible = user.relatedStudentId
        ? entries.filter((entry) => entry.studentId === user.relatedStudentId)
        : [];
    }
    return visible.sort((first, second) => first.dayOfWeek - second.dayOfWeek || first.startTime.localeCompare(second.startTime));
  },

  findNextForUser(user: ScheduleViewer, from = new Date()): ScheduleEntry | undefined {
    const entries = this.listForUser(user);
    if (entries.length === 0) return undefined;

    const dayOfWeek = from.getDay();
    const currentTime = `${String(from.getHours()).padStart(2, "0")}:${String(
      from.getMinutes(),
    ).padStart(2, "0")}`;
    const upcoming = entries.find(
      (entry) =>
        dayOfWeek === 0 ||
        dayOfWeek === 6 ||
        entry.dayOfWeek > dayOfWeek ||
        (entry.dayOfWeek === dayOfWeek && entry.startTime >= currentTime),
    );

    // Si la semana lectiva terminó, el primer registro corresponde a la semana siguiente.
    return upcoming ?? entries[0];
  },

  update(actor: User, input: ScheduleUpdateInput): ScheduleEntry {
    if (actor.role !== "ADMIN" && actor.role !== "TEACHER" && actor.role !== "STAFF") {
      throw new Error("No tienes permisos para modificar horarios.");
    }
    const entries = readAll();
    const index = entries.findIndex((candidate) => candidate.id === input.id);
    if (index < 0) throw new Error("La entrada de horario ya no existe.");
    const current = entries[index];
    if (actor.role === "TEACHER" && current.userId !== actor.id) {
      throw new Error("No tienes permisos para modificar este horario.");
    }
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timePattern.test(input.startTime) || !timePattern.test(input.endTime) || input.startTime >= input.endTime) {
      throw new Error("La hora final debe ser posterior a la hora inicial.");
    }
    const location = input.location.trim();
    if (!location) throw new Error("Indica el aula o lugar del horario.");
    const updated: ScheduleEntry = {
      ...current,
      startTime: input.startTime,
      endTime: input.endTime,
      location,
      updatedAt: new Date().toISOString(),
    };
    entries[index] = updated;
    localStorageService.set(storageKeys.scheduleEntries, entries);
    appEventBus.emit("schedule:changed", { entry: updated });
    const familyUsers = localStorageService
      .get<User[]>(storageKeys.users, [])
      .value.filter((user) => user.relatedStudentId === updated.studentId);
    familyUsers.forEach((user) => notificationService.create({
      userId: user.id,
      type: "SCHEDULE",
      title: "Horario actualizado",
      message: `${updated.subject} ahora inicia a las ${updated.startTime}.`,
      link: "/schedules",
    }));
    return updated;
  },
};
