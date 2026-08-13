import { describe, expect, it } from "vitest";
import type { AuthSession } from "../core/types/domain";
import { resolveRouteAccess } from "../features/auth/components/ProtectedRoute";

const teacherSession: AuthSession = {
  userId: "usr_teacher_001",
  role: "TEACHER",
  issuedAt: "2026-08-13T12:00:00.000Z",
  expiresAt: "2026-08-13T20:00:00.000Z",
};

describe("protección de rutas", () => {
  it("solicita acceso cuando no existe sesión", () => {
    expect(resolveRouteAccess(false, null, ["ADMIN"])).toBe("login");
  });

  it("deniega usuarios sin el rol requerido", () => {
    expect(resolveRouteAccess(false, teacherSession, ["ADMIN"])).toBe("denied");
  });

  it("permite el rol autorizado", () => {
    expect(resolveRouteAccess(false, { ...teacherSession, role: "ADMIN" }, ["ADMIN"])).toBe(
      "allowed",
    );
  });
});
