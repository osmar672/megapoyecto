import { beforeEach, describe, expect, it } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { userRepository } from "../features/users/services/userRepository";
import { validateUserForm } from "../features/users/validation/userValidation";

describe("administración de usuarios", () => {
  beforeEach(async () => {
    await initializeSeedData();
  });

  it("impide correos institucionales duplicados", () => {
    const errors = validateUserForm({
      firstName: "Otra",
      lastName: "Cuenta",
      email: "admin@colegiohorizonte.edu.cr",
      role: "ADMIN",
      relatedStudentId: "",
      temporaryPassword: "Temporal2026!",
    });
    expect(errors.email).toMatch(/Ya existe/);
  });

  it("crea un usuario con credencial cifrada", async () => {
    const created = await userRepository.create(
      {
        firstName: "Laura",
        lastName: "Jiménez",
        email: "laura.jimenez@colegiohorizonte.edu.cr",
        role: "TEACHER",
        relatedStudentId: undefined,
      },
      "Temporal2026!",
    );
    expect(userRepository.findById(created.id)?.isActive).toBe(true);
    expect(localStorage.getItem("schoolIntranet.v1.credentials")).not.toContain("Temporal2026!");
  });

  it("realiza baja lógica y protege al administrador activo", () => {
    expect(() => userRepository.deactivate("usr_admin_001", "usr_admin_001")).toThrow(
      /sesión activa/,
    );
    userRepository.deactivate("usr_teacher_001", "usr_admin_001");
    expect(userRepository.findById("usr_teacher_001")?.isActive).toBe(false);
  });
});
