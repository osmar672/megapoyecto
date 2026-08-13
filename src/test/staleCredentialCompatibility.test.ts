import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { storageKeys } from "../core/storage/storageKeys";
import { authService } from "../features/auth/services/authService";

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

describe("migración aditiva de cuentas", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(storageKeys.users, JSON.stringify(legacyUsers));
    localStorage.setItem(storageKeys.credentials, JSON.stringify(legacyCredentials));
  });

  it("conserva cuentas guardadas y agrega solamente cuentas ausentes", async () => {
    await initializeSeedData();
    await initializeSeedData();

    const users = JSON.parse(localStorage.getItem(storageKeys.users) ?? "[]") as typeof legacyUsers;
    const credentials = JSON.parse(
      localStorage.getItem(storageKeys.credentials) ?? "[]",
    ) as typeof legacyCredentials;

    expect(users.filter((user) => user.id === "usr_admin_001")).toEqual(legacyUsers);
    expect(users.filter((user) => user.id === "usr_staff_001")).toHaveLength(1);
    expect(credentials.filter((item) => item.userId === "usr_admin_001")).toEqual(
      legacyCredentials,
    );
    expect(credentials.filter((item) => item.userId === "usr_staff_001")).toHaveLength(1);

    const staffUser = await authService.login(
      "personal@colegiohorizonte.edu.cr",
      "Personal2026!",
    );
    expect(staffUser.role).toBe("STAFF");
  });
});
