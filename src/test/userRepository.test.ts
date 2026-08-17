import { beforeEach, describe, expect, it, vi } from "vitest";
import { initializeSeedData } from "../core/data/seedService";
import { storageKeys } from "../core/storage/storageKeys";
import { localStorageService } from "../core/storage/storageService";
import type { Credential, User } from "../core/types/domain";
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

  it("rechaza una relación familiar con un estudiante inexistente", () => {
    const errors = validateUserForm({
      firstName: "Daniela",
      lastName: "Familia",
      email: "daniela.familia@colegiohorizonte.edu.cr",
      role: "STUDENT_FAMILY",
      relatedStudentId: "stu_inexistente",
      temporaryPassword: "Temporal2026!",
    });

    expect(errors.relatedStudentId).toMatch(/No existe/);
  });

  it("revierte credenciales y usuarios si una creación no puede completarse", async () => {
    const usersBefore = localStorageService.get<User[]>(storageKeys.users, []).value;
    const credentialsBefore = localStorageService.get<Credential[]>(
      storageKeys.credentials,
      [],
    ).value;
    const originalSetItem = Storage.prototype.setItem;
    let shouldFail = true;
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(function (this: Storage, key, value) {
        if (key === storageKeys.users && shouldFail) {
          shouldFail = false;
          throw new Error("Almacenamiento no disponible");
        }
        originalSetItem.call(this, key, value);
      });

    await expect(
      userRepository.create(
        {
          firstName: "María",
          lastName: "Campos",
          email: "maria.campos@colegiohorizonte.edu.cr",
          role: "TEACHER",
          relatedStudentId: undefined,
        },
        "Temporal2026!",
      ),
    ).rejects.toThrow(/Almacenamiento/);
    setItemSpy.mockRestore();

    expect(localStorageService.get<User[]>(storageKeys.users, []).value).toEqual(usersBefore);
    expect(localStorageService.get<Credential[]>(storageKeys.credentials, []).value).toEqual(
      credentialsBefore,
    );
  });

  it("realiza baja lógica y protege al administrador activo", () => {
    expect(() => userRepository.deactivate("usr_admin_001", "usr_admin_001")).toThrow(
      /sesión activa/,
    );
    userRepository.deactivate("usr_teacher_001", "usr_admin_001");
    expect(userRepository.findById("usr_teacher_001")?.isActive).toBe(false);
  });
});
