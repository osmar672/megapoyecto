import { beforeEach, describe, expect, it, vi } from "vitest";
import { appEventBus } from "../core/events/appEventBus";
import { notificationService } from "../core/notifications/notificationService";

describe("notificationService", () => {
  beforeEach(() => appEventBus.clear());

  it("crea, consulta y emite una notificación para su usuario", () => {
    const listener = vi.fn();
    appEventBus.on("notification:created", listener);

    const created = notificationService.create({
      userId: "usr_staff_001",
      type: "ANNOUNCEMENT",
      title: "  Nuevo comunicado  ",
      message: "  Revisa la información institucional.  ",
      link: "/announcements",
    });

    expect(created.title).toBe("Nuevo comunicado");
    expect(notificationService.listForUser("usr_staff_001")).toEqual([created]);
    expect(notificationService.listForUser("usr_teacher_001")).toEqual([]);
    expect(notificationService.getUnreadCount("usr_staff_001")).toBe(1);
    expect(listener).toHaveBeenCalledWith({ notification: created });
  });

  it("marca una, restaura su estado y marca todas las notificaciones", () => {
    const changedListener = vi.fn();
    appEventBus.on("notification:changed", changedListener);
    const first = notificationService.create({
      userId: "usr_staff_001",
      type: "SYSTEM",
      title: "Primera",
      message: "Primera notificación",
    });
    notificationService.create({
      userId: "usr_staff_001",
      type: "SYSTEM",
      title: "Segunda",
      message: "Segunda notificación",
    });

    expect(notificationService.markRead("usr_teacher_001", first.id)).toBeUndefined();
    expect(notificationService.markRead("usr_staff_001", first.id)?.isRead).toBe(true);
    expect(notificationService.markRead("usr_staff_001", first.id, false)?.isRead).toBe(false);
    expect(notificationService.markAllRead("usr_staff_001")).toBe(2);
    expect(notificationService.getUnreadCount("usr_staff_001")).toBe(0);
    expect(notificationService.markAllRead("usr_staff_001")).toBe(0);
    expect(changedListener).toHaveBeenCalledTimes(3);
    expect(changedListener).toHaveBeenLastCalledWith({ userId: "usr_staff_001" });
  });
});
