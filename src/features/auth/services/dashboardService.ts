import type { Course, Student, User, UserRole } from "../../../core/types/domain";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export function getDashboardMetrics(role: UserRole): DashboardMetric[] {
  const users = localStorageService.get<User[]>(storageKeys.users, []).value;
  const students = localStorageService.get<Student[]>(storageKeys.students, []).value;
  const courses = localStorageService.get<Course[]>(storageKeys.courses, []).value;

  if (role === "ADMIN") {
    return [
      { label: "Usuarios activos", value: String(users.filter((user) => user.isActive).length), detail: "Accesos institucionales habilitados" },
      { label: "Perfiles docentes", value: String(users.filter((user) => user.role === "TEACHER" && user.isActive).length), detail: "Personal con acceso académico" },
      { label: "Estudiantes", value: String(students.filter((student) => student.isActive).length), detail: "Registros de demostración" },
    ];
  }
  if (role === "TEACHER") {
    return [
      { label: "Cursos asignados", value: String(courses.filter((course) => course.isActive).length), detail: "Carga académica activa" },
      { label: "Secciones", value: "1", detail: "Grupo vinculado al perfil" },
      { label: "Próxima revisión", value: "18 ago", detail: "Cierre parcial de seguimiento" },
    ];
  }
  return [
    { label: "Estudiante vinculado", value: String(students.filter((student) => student.isActive).length), detail: "Perfil familiar autorizado" },
    { label: "Nivel", value: students[0]?.gradeLevel ?? "Sin asignar", detail: students[0] ? `Sección ${students[0].section}` : "Pendiente de registro" },
    { label: "Curso lectivo", value: "2026", detail: "Segundo trimestre" },
  ];
}
