import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { ScheduleEntry, User } from "../../../core/types/domain";

function readAll(): ScheduleEntry[] {
  return localStorageService.get<ScheduleEntry[]>(storageKeys.scheduleEntries, []).value;
}

export const scheduleRepository = {
  listForUser(user: User): ScheduleEntry[] {
    const entries = readAll();
    const visible = user.role === "STUDENT_FAMILY" && user.relatedStudentId
      ? entries.filter((entry) => entry.studentId === user.relatedStudentId)
      : user.role === "TEACHER"
        ? entries.filter((entry) => entry.userId === user.id)
        : entries;
    return visible.sort((first, second) => first.dayOfWeek - second.dayOfWeek || first.startTime.localeCompare(second.startTime));
  },

  update(actor: User, entry: ScheduleEntry): ScheduleEntry {
    if (actor.role === "STUDENT_FAMILY") {
      throw new Error("No tienes permisos para modificar horarios.");
    }
    const entries = readAll();
    const index = entries.findIndex((candidate) => candidate.id === entry.id);
    if (index < 0) throw new Error("La entrada de horario ya no existe.");
    const updated = { ...entry, updatedAt: new Date().toISOString() };
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
