import type { Announcement, AnnouncementAudience, AuthSession } from "../../../core/types/domain";
import type { User } from "../../../core/types/domain";
import { appEventBus } from "../../../core/events/appEventBus";
import { notificationService } from "../../../core/notifications/notificationService";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import { createId } from "../../../core/utils/createId";
import { canCreateAnnouncement, canEditAnnouncement, isAnnouncementVisible } from "../authorization";

export interface AnnouncementInput {
  title: string;
  body: string;
  audience: AnnouncementAudience;
}

export class AnnouncementRepositoryError extends Error {}

function readAll(): Announcement[] {
  return localStorageService.get<Announcement[]>(storageKeys.announcements, []).value;
}

function writeAll(announcements: Announcement[]): void {
  localStorageService.set(storageKeys.announcements, announcements);
}

function validate(input: AnnouncementInput): AnnouncementInput {
  const value = { ...input, title: input.title.trim(), body: input.body.trim() };
  if (value.title.length < 3 || value.title.length > 120) {
    throw new AnnouncementRepositoryError("El título debe tener entre 3 y 120 caracteres.");
  }
  if (value.body.length < 10 || value.body.length > 4000) {
    throw new AnnouncementRepositoryError("El contenido debe tener entre 10 y 4000 caracteres.");
  }
  return value;
}

function findOrFail(announcements: Announcement[], id: string): [Announcement, number] {
  const index = announcements.findIndex((announcement) => announcement.id === id);
  const announcement = announcements[index];
  if (!announcement) throw new AnnouncementRepositoryError("El comunicado ya no existe.");
  return [announcement, index];
}

export const announcementRepository = {
  listVisible(session: AuthSession): Announcement[] {
    return readAll()
      .filter((announcement) => isAnnouncementVisible(session, announcement))
      .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
  },

  save(session: AuthSession, input: AnnouncementInput, id?: string): Announcement {
    const value = validate(input);
    const announcements = readAll();
    const timestamp = new Date().toISOString();
    if (!id) {
      if (!canCreateAnnouncement(session.role)) throw new AnnouncementRepositoryError("No tienes permisos para crear comunicados.");
      const created: Announcement = {
        id: createId("ann"),
        ...value,
        status: "DRAFT",
        authorUserId: session.userId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      writeAll([...announcements, created]);
      return created;
    }

    const [current, index] = findOrFail(announcements, id);
    if (!canEditAnnouncement(session, current)) throw new AnnouncementRepositoryError("No tienes permisos para editar este comunicado.");
    const updated = { ...current, ...value, updatedAt: timestamp };
    announcements[index] = updated;
    writeAll(announcements);
    return updated;
  },

  publish(session: AuthSession, id: string): Announcement {
    if (session.role !== "ADMIN") throw new AnnouncementRepositoryError("Solo Administración puede publicar comunicados.");
    const announcements = readAll();
    const [current, index] = findOrFail(announcements, id);
    const timestamp = new Date().toISOString();
    const published: Announcement = { ...current, status: "PUBLISHED", publishedAt: timestamp, updatedAt: timestamp };
    announcements[index] = published;
    writeAll(announcements);
    appEventBus.emit("announcement:published", { announcement: published });
    const recipients = localStorageService.get<User[]>(storageKeys.users, []).value.filter(
      (user) => published.audience === "ALL" || published.audience === user.role,
    );
    recipients.forEach((user) => notificationService.create({
      userId: user.id,
      type: "ANNOUNCEMENT",
      title: published.title,
      message: published.body,
      link: "/announcements",
    }));
    return published;
  },

  withdraw(session: AuthSession, id: string): Announcement {
    if (session.role !== "ADMIN") throw new AnnouncementRepositoryError("Solo Administración puede retirar comunicados.");
    const announcements = readAll();
    const [current, index] = findOrFail(announcements, id);
    const updated: Announcement = { ...current, status: "ARCHIVED", updatedAt: new Date().toISOString() };
    announcements[index] = updated;
    writeAll(announcements);
    return updated;
  },

  remove(session: AuthSession, id: string): void {
    if (session.role !== "ADMIN") throw new AnnouncementRepositoryError("Solo Administración puede eliminar comunicados.");
    const announcements = readAll();
    findOrFail(announcements, id);
    writeAll(announcements.filter((announcement) => announcement.id !== id));
  },
};
