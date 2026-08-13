import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { storageKeys } from "../core/storage/storageKeys";
import { authService, AuthenticationError } from "../features/auth/services/authService";

describe("authService", () => {
  beforeEach(async () => {
    await initializeSeedData();
  });

  it("inicia sesión con credenciales correctas", async () => {
    const user = await authService.login("admin@colegiohorizonte.edu.cr", "Admin2026!");
    expect(user.id).toBe("usr_admin_001");
    expect(authService.getSession()?.role).toBe("ADMIN");
  });

  it("rechaza credenciales inválidas", async () => {
    await expect(
      authService.login("admin@colegiohorizonte.edu.cr", "incorrecta"),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("cierra una sesión expirada", async () => {
    await authService.login("admin@colegiohorizonte.edu.cr", "Admin2026!");
    const session = authService.getSession();
    expect(session).not.toBeNull();
    sessionStorage.setItem(
      storageKeys.session,
      JSON.stringify({ ...session, expiresAt: "2020-01-01T00:00:00.000Z" }),
    );
    expect(authService.getSession()).toBeNull();
  });
});
