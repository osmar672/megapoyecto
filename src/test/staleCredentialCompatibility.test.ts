import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { storageKeys } from "../core/storage/storageKeys";
import { authService, AuthenticationError } from "../features/auth/services/authService";

const legacyUsers = [
  {
    id: "usr_admin_001",
    firstName: "Admin",
    lastName: "Sistema",
    email: "admin@escuela.test",
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
];

const legacyCredentials = [
  {
    userId: "usr_admin_001",
    passwordSalt: "demo",
    passwordHash: "admin123",
  },
];

describe("compatibilidad con datos del prototipo anterior", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(storageKeys.users, JSON.stringify(legacyUsers));
    localStorage.setItem(storageKeys.credentials, JSON.stringify(legacyCredentials));
  });

  it("migra las cuentas antiguas y habilita las credenciales actuales", async () => {
    await initializeSeedData();

    await expect(
      authService.login("admin@escuela.test", "admin123"),
    ).rejects.toBeInstanceOf(AuthenticationError);

    const user = await authService.login(
      "admin@colegiohorizonte.edu.cr",
      "Admin2026!",
    );
    expect(user.id).toBe("usr_admin_001");
    expect(user.firstName).toBe("Elena");
  });
});
