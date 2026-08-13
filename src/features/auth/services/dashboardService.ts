import type { Announcement, AttendanceRecord, Course, Enrollment, Grade, Student, User } from "../../../core/types/domain";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export function getDashboardMetrics(user: User): DashboardMetric[] {
  const users = localStorageService.get<User[]>(storageKeys.users, []).value;
  const students = localStorageService.get<Student[]>(storageKeys.students, []).value;
  const courses = localStorageService.get<Course[]>(storageKeys.courses, []).value;
  const enrollments = localStorageService.get<Enrollment[]>(storageKeys.enrollments, []).value;
  const grades = localStorageService.get<Grade[]>(storageKeys.grades, []).value;
  const attendance = localStorageService.get<AttendanceRecord[]>(storageKeys.attendance, []).value;
  const announcements = localStorageService.get<Announcement[]>(storageKeys.announcements, []).value;

  if (user.role === "ADMIN") {
    return [
      { label: "Usuarios activos", value: String(users.filter((candidate) => candidate.isActive).length), detail: "Accesos institucionales habilitados" },
      { label: "Cursos activos", value: String(courses.filter((course) => course.isActive).length), detail: `${students.filter((student) => student.isActive).length} estudiantes registrados` },
      { label: "Comunicados publicados", value: String(announcements.filter((announcement) => announcement.status === "PUBLISHED").length), detail: "Información disponible para la comunidad" },
    ];
  }

  if (user.role === "TEACHER") {
    const courseIds = new Set(courses.filter((course) => course.isActive && course.teacherUserId === user.id).map((course) => course.id));
    const studentIds = new Set(enrollments.filter((enrollment) => enrollment.status === "ACTIVE" && courseIds.has(enrollment.courseId)).map((enrollment) => enrollment.studentId));
    return [
      { label: "Cursos asignados", value: String(courseIds.size), detail: "Carga académica activa" },
      { label: "Estudiantes", value: String(studentIds.size), detail: "Matrículas en tus cursos" },
      { label: "Registros académicos", value: String(grades.filter((grade) => courseIds.has(grade.courseId)).length + attendance.filter((record) => courseIds.has(record.courseId)).length), detail: "Calificaciones y asistencia registradas" },
    ];
  }

  const student = students.find((candidate) => candidate.id === user.relatedStudentId);
  const ownGrades = grades.filter((grade) => grade.studentId === user.relatedStudentId && grade.maxScore > 0);
  const ownAttendance = attendance.filter((record) => record.studentId === user.relatedStudentId);
  const average = ownGrades.length ? Math.round(ownGrades.reduce((total, grade) => total + grade.score / grade.maxScore * 100, 0) / ownGrades.length) : null;
  const attendanceRate = ownAttendance.length ? Math.round(ownAttendance.filter((record) => record.status === "PRESENT").length / ownAttendance.length * 100) : null;
  return [
    { label: "Promedio general", value: average === null ? "—" : `${average}%`, detail: `${ownGrades.length} evaluaciones disponibles` },
    { label: "Asistencia presente", value: attendanceRate === null ? "—" : `${attendanceRate}%`, detail: `${ownAttendance.length} registros de asistencia` },
    { label: "Nivel y sección", value: student?.gradeLevel ?? "—", detail: student ? `Sección ${student.section}` : "Sin estudiante vinculado" },
  ];
}
