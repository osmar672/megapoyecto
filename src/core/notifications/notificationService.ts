import { appEventBus } from "../events/appEventBus";
import { storageKeys } from "../storage/storageKeys";
import { localStorageService } from "../storage/storageService";
import type { Notification } from "../types/domain";
import { createId } from "../utils/createId";

export type CreateNotificationInput = Pick<
  Notification,
  "userId" | "type" | "title" | "message" | "link"
>;

function readNotifications(): Notification[] {
  return localStorageService.get<Notification[]>(storageKeys.notifications, []).value;
}

function writeNotifications(notifications: Notification[]): void {
  localStorageService.set(storageKeys.notifications, notifications);
}

export const notificationService = {
  create(input: CreateNotificationInput): Notification {
    const notification: Notification = {
      id: createId("ntf"),
      userId: input.userId,
      type: input.type,
      title: input.title.trim(),
      message: input.message.trim(),
      link: input.link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    writeNotifications([...readNotifications(), notification]);
    appEventBus.emit("notification:created", { notification });
    return notification;
  },

  listForUser(userId: string): Notification[] {
    return readNotifications()
      .filter((notification) => notification.userId === userId)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  },

  getUnreadCount(userId: string): number {
    return readNotifications().filter(
      (notification) => notification.userId === userId && !notification.isRead,
    ).length;
  },

  markRead(userId: string, notificationId: string, isRead = true): Notification | undefined {
    let updatedNotification: Notification | undefined;
    const notifications = readNotifications().map((notification) => {
      if (notification.id !== notificationId || notification.userId !== userId) {
        return notification;
      }
      updatedNotification = { ...notification, isRead };
      return updatedNotification;
    });
    if (updatedNotification) {
      writeNotifications(notifications);
      appEventBus.emit("notification:changed", { userId });
    }
    return updatedNotification;
  },

  markAllRead(userId: string): number {
    let updatedCount = 0;
    const notifications = readNotifications().map((notification) => {
      if (notification.userId !== userId || notification.isRead) return notification;
      updatedCount += 1;
      return { ...notification, isRead: true };
    });
    if (updatedCount > 0) {
      writeNotifications(notifications);
      appEventBus.emit("notification:changed", { userId });
    }
    return updatedCount;
  },
};
