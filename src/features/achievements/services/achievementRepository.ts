import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import type { Achievement, User } from "../../../core/types/domain";

function readAll(): Achievement[] {
  return localStorageService.get<Achievement[]>(storageKeys.achievements, []).value;
}

export const achievementRepository = {
  listForUser(user: User): Achievement[] {
    return readAll().filter((achievement) => user.role === "ADMIN" || achievement.userId === user.id);
  },

  unlock(actor: User, id: string): Achievement {
    if (actor.role !== "ADMIN") throw new Error("Solo Administración puede desbloquear logros.");
    const achievements = readAll();
    const index = achievements.findIndex((achievement) => achievement.id === id);
    const current = achievements[index];
    if (!current) throw new Error("El logro ya no existe.");
    if (current.progress < current.target) throw new Error("El progreso todavía no alcanza la meta.");
    const timestamp = new Date().toISOString();
    const updated = { ...current, unlockedAt: timestamp, updatedAt: timestamp };
    achievements[index] = updated;
    localStorageService.set(storageKeys.achievements, achievements);
    appEventBus.emit("achievement:unlocked", { achievement: updated });
    notificationService.create({
      userId: updated.userId,
      type: "ACHIEVEMENT",
      title: "Nuevo logro desbloqueado",
      message: updated.title,
      link: "/achievements",
    });
    return updated;
  },
};
