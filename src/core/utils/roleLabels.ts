import type { UserRole } from "../types/domain";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administración",
  TEACHER: "Docente",
  STUDENT_FAMILY: "Estudiante y familia",
};
