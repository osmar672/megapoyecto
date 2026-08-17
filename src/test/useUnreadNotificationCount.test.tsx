import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { appEventBus } from "../core/events/appEventBus";
import { notificationService } from "../core/notifications/notificationService";
import { useUnreadNotificationCount } from "../core/notifications/useUnreadNotificationCount";

describe("useUnreadNotificationCount", () => {
  beforeEach(() => appEventBus.clear());

  it("sincroniza el contador al crear y leer notificaciones", () => {
    const { result } = renderHook(() => useUnreadNotificationCount("usr_staff_001"));
    expect(result.current).toBe(0);

    let notificationId = "";
    act(() => {
      notificationId = notificationService.create({
        userId: "usr_staff_001",
        type: "SYSTEM",
        title: "Actualización",
        message: "Contenido actualizado",
      }).id;
    });
    expect(result.current).toBe(1);

    act(() => {
      notificationService.markRead("usr_staff_001", notificationId);
    });
    expect(result.current).toBe(0);
  });
});
