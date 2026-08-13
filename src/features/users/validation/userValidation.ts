import type { UserRole } from "../../../core/types/domain";
import { userRepository } from "../services/userRepository";

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  relatedStudentId: string;
  temporaryPassword: string;
}

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

const institutionalEmailPattern = /^[^\s@]+@colegiohorizonte\.edu\.cr$/i;

export function validateUserForm(
  values: UserFormValues,
  editingUserId?: string,
): UserFormErrors {
  const errors: UserFormErrors = {};
  if (values.firstName.trim().length < 2) errors.firstName = "Ingresa al menos 2 caracteres.";
  if (values.lastName.trim().length < 2) errors.lastName = "Ingresa al menos 2 caracteres.";
  if (!institutionalEmailPattern.test(values.email.trim())) {
    errors.email = "Usa un correo con dominio @colegiohorizonte.edu.cr.";
  } else if (userRepository.emailExists(values.email, editingUserId)) {
    errors.email = "Ya existe un usuario con este correo institucional.";
  }
  if (!(["ADMIN", "TEACHER", "STUDENT_FAMILY"] as UserRole[]).includes(values.role)) {
    errors.role = "Selecciona un rol válido.";
  }
  if (values.role === "STUDENT_FAMILY" && !values.relatedStudentId.trim()) {
    errors.relatedStudentId = "Indica el identificador del estudiante relacionado.";
  }
  if (!editingUserId && values.temporaryPassword.length < 8) {
    errors.temporaryPassword = "La contraseña temporal debe tener al menos 8 caracteres.";
  }
  return errors;
}
