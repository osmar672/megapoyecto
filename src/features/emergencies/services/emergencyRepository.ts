import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { EmergencyNotice, User, UserRole } from "../../../core/types/domain";
import { createId } from "../../../core/utils/createId";

function readAll(): EmergencyNotice[] {
  return localStorageService.get<EmergencyNotice[]>(storageKeys.emergencyNotices, []).value;
}

function canManage(role: UserRole): boolean {
  return role === "ADMIN" || role === "STAFF";
}

function notifyCommunity(notice: EmergencyNotice): void {
  const users = localStorageService.get<User[]>(storageKeys.users, []).value;
  users.forEach((user) => notificationService.create({
    userId: user.id,
    type: "EMERGENCY",
    title: notice.title,
    message: notice.body,
    link: "/emergencies",
  }));
}

export const emergencyRepository = {
  list(): EmergencyNotice[] {
    return readAll().sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
  },

  publish(actor: User, input: Pick<EmergencyNotice, "title" | "body" | "kind">): EmergencyNotice {
    if (!canManage(actor.role)) throw new Error("No tienes permisos para publicar una alerta.");
    const timestamp = new Date().toISOString();
    const notice: EmergencyNotice = {
      id: createId("emg"),
      title: input.title.trim(),
      body: input.body.trim(),
      kind: input.kind,
      status: input.kind === "ALL_CLEAR" ? "RESOLVED" : "ACTIVE",
      authorUserId: actor.id,
      publishedAt: timestamp,
      resolvedAt: input.kind === "ALL_CLEAR" ? timestamp : undefined,
      updatedAt: timestamp,
    };
    localStorageService.set(storageKeys.emergencyNotices, [...readAll(), notice]);
    appEventBus.emit("emergency:changed", { notice });
    notifyCommunity(notice);
    return notice;
  },

  resolve(actor: User, id: string): EmergencyNotice {
    if (!canManage(actor.role)) throw new Error("No tienes permisos para cerrar una alerta.");
    const notices = readAll();
    const index = notices.findIndex((notice) => notice.id === id);
    const current = notices[index];
    if (!current) throw new Error("La alerta ya no existe.");
    const timestamp = new Date().toISOString();
    const notice = { ...current, status: "RESOLVED" as const, resolvedAt: timestamp, updatedAt: timestamp };
    notices[index] = notice;
    localStorageService.set(storageKeys.emergencyNotices, notices);
    appEventBus.emit("emergency:changed", { notice });
    return notice;
  },
};
