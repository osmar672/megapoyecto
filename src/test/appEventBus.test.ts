import { describe, expect, it, vi } from "vitest";
import { AppEventBus } from "../core/events/appEventBus";
import type { Notification } from "../core/types/domain";

const notification: Notification = {
  id: "ntf_001",
  userId: "usr_staff_001",
  type: "SYSTEM",
  title: "Actualización",
  message: "La información fue actualizada.",
  isRead: false,
  createdAt: "2026-08-13T14:00:00.000Z",
};

describe("AppEventBus", () => {
  it("entrega cargas tipadas y permite cancelar la suscripción", () => {
    const eventBus = new AppEventBus();
    const listener = vi.fn();
    const unsubscribe = eventBus.on("notification:created", listener);

    eventBus.emit("notification:created", { notification });
    unsubscribe();
    eventBus.emit("notification:created", { notification });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ notification });
  });
});
