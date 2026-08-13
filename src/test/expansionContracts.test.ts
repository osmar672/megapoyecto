import { describe, expect, it } from "vitest";
import { storageKeys } from "../core/storage/storageKeys";
import type {
  AccessibilityPreferences,
  AssistantMessage,
  AvatarConfig,
  Bus,
  Notification,
  SearchResult,
  StudentProfile,
  UserRole,
} from "../core/types/domain";

describe("contratos de expansión", () => {
  it("mantiene las claves nuevas dentro de schoolIntranet.v1", () => {
    expect(Object.values(storageKeys).every((key) => key.startsWith("schoolIntranet.v1.")))
      .toBe(true);
    expect(storageKeys).toMatchObject({
      profiles: "schoolIntranet.v1.profiles",
      avatars: "schoolIntranet.v1.avatars",
      notifications: "schoolIntranet.v1.notifications",
      busRoutes: "schoolIntranet.v1.busRoutes",
    });
  });

  it("expone contratos compatibles para los módulos consumidores", () => {
    const role: UserRole = "STAFF";
    const contracts: [
      StudentProfile?,
      AvatarConfig?,
      AccessibilityPreferences?,
      Bus?,
      Notification?,
      SearchResult?,
      AssistantMessage?,
    ] = [];

    expect(role).toBe("STAFF");
    expect(contracts).toHaveLength(0);
  });
});
