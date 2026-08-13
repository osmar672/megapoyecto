import type {
  AttendanceRecord,
  Course,
  Enrollment,
  Grade,
  Student,
  User,
} from "../../../core/types/domain";
import { localStorageService } from "../../../core/storage/storageService";
import { storageKeys } from "../../../core/storage/storageKeys";
import { createId } from "../../../core/utils/createId";

export interface AcademicView {
  courses: Course[];
  students: Student[];
  enrollments: Enrollment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
}

export interface GradeInput {
  studentId: string;
  courseId: string;
  period: string;
  score: number;
  maxScore: number;
  comment?: string;
}

export interface AttendanceInput {
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceRecord["status"];
  notes?: string;
}

export class AcademicRepositoryError extends Error {}

function readData(): AcademicView {
  return {
    courses: localStorageService.get<Course[]>(storageKeys.courses, []).value,
    students: localStorageService.get<Student[]>(storageKeys.students, []).value,
    enrollments: localStorageService.get<Enrollment[]>(storageKeys.enrollments, []).value,
    grades: localStorageService.get<Grade[]>(storageKeys.grades, []).value,
    attendance: localStorageService.get<AttendanceRecord[]>(storageKeys.attendance, []).value,
  };
}

function allowedCourseIds(user: User, data: AcademicView): Set<string> {
  if (user.role === "ADMIN") return new Set(data.courses.filter((course) => course.isActive).map((course) => course.id));
  if (user.role === "TEACHER") return new Set(data.courses.filter((course) => course.isActive && course.teacherUserId === user.id).map((course) => course.id));
  const studentId = user.relatedStudentId;
  return new Set(data.enrollments.filter((enrollment) => enrollment.status === "ACTIVE" && enrollment.studentId === studentId).map((enrollment) => enrollment.courseId));
}

function allowedStudentIds(user: User, data: AcademicView, courseIds: Set<string>): Set<string> {
  if (user.role === "STUDENT_FAMILY") return new Set(user.relatedStudentId ? [user.relatedStudentId] : []);
  return new Set(data.enrollments.filter((enrollment) => enrollment.status === "ACTIVE" && courseIds.has(enrollment.courseId)).map((enrollment) => enrollment.studentId));
}

function ensureWriteAccess(user: User, data: AcademicView, studentId: string, courseId: string): void {
  if (user.role === "STUDENT_FAMILY") throw new AcademicRepositoryError("Este perfil solo puede consultar información académica.");
  const course = data.courses.find((candidate) => candidate.id === courseId && candidate.isActive);
  if (!course || (user.role === "TEACHER" && course.teacherUserId !== user.id)) {
    throw new AcademicRepositoryError("No tienes permisos sobre el curso seleccionado.");
  }
  const enrolled = data.enrollments.some((enrollment) => enrollment.courseId === courseId && enrollment.studentId === studentId && enrollment.status === "ACTIVE");
  if (!enrolled) throw new AcademicRepositoryError("El estudiante no está matriculado en el curso seleccionado.");
}

export const academicRepository = {
  getView(user: User): AcademicView {
    const data = readData();
    const courseIds = allowedCourseIds(user, data);
    const studentIds = allowedStudentIds(user, data, courseIds);
    return {
      courses: data.courses.filter((course) => courseIds.has(course.id)),
      students: data.students.filter((student) => studentIds.has(student.id) && student.isActive),
      enrollments: data.enrollments.filter((enrollment) => courseIds.has(enrollment.courseId) && studentIds.has(enrollment.studentId) && enrollment.status === "ACTIVE"),
      grades: data.grades.filter((grade) => courseIds.has(grade.courseId) && studentIds.has(grade.studentId)).sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)),
      attendance: data.attendance.filter((record) => courseIds.has(record.courseId) && studentIds.has(record.studentId)).sort((first, second) => second.date.localeCompare(first.date)),
    };
  },

  saveGrade(user: User, input: GradeInput): Grade {
    const data = readData();
    ensureWriteAccess(user, data, input.studentId, input.courseId);
    const period = input.period.trim();
    if (!period) throw new AcademicRepositoryError("Indica el periodo de evaluación.");
    if (!Number.isFinite(input.score) || !Number.isFinite(input.maxScore) || input.maxScore <= 0 || input.score < 0 || input.score > input.maxScore) {
      throw new AcademicRepositoryError("La calificación debe estar entre cero y el puntaje máximo.");
    }
    const timestamp = new Date().toISOString();
    const index = data.grades.findIndex((grade) => grade.studentId === input.studentId && grade.courseId === input.courseId && grade.period.toLowerCase() === period.toLowerCase());
    const current = data.grades[index];
    const grade: Grade = current ? {
      ...current,
      score: input.score,
      maxScore: input.maxScore,
      comment: input.comment?.trim() || undefined,
      recordedBy: user.id,
      updatedAt: timestamp,
    } : {
      id: createId("grd"),
      studentId: input.studentId,
      courseId: input.courseId,
      period,
      score: input.score,
      maxScore: input.maxScore,
      comment: input.comment?.trim() || undefined,
      recordedBy: user.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    if (current) data.grades[index] = grade;
    else data.grades.push(grade);
    localStorageService.set(storageKeys.grades, data.grades);
    return grade;
  },

  saveAttendance(user: User, input: AttendanceInput): AttendanceRecord {
    const data = readData();
    ensureWriteAccess(user, data, input.studentId, input.courseId);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new AcademicRepositoryError("Selecciona una fecha válida.");
    const timestamp = new Date().toISOString();
    const index = data.attendance.findIndex((record) => record.studentId === input.studentId && record.courseId === input.courseId && record.date === input.date);
    const current = data.attendance[index];
    const record: AttendanceRecord = current ? {
      ...current,
      status: input.status,
      notes: input.notes?.trim() || undefined,
      recordedBy: user.id,
      updatedAt: timestamp,
    } : {
      id: createId("att"),
      studentId: input.studentId,
      courseId: input.courseId,
      date: input.date,
      status: input.status,
      notes: input.notes?.trim() || undefined,
      recordedBy: user.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    if (current) data.attendance[index] = record;
    else data.attendance.push(record);
    localStorageService.set(storageKeys.attendance, data.attendance);
    return record;
  },
};
