import type {
  Course,
  Credential,
  Enrollment,
  Student,
  User,
} from "../types/domain";
import { createSalt, hashPassword } from "../security/password";
import { localStorageService } from "../storage/storageService";
import { storageKeys } from "../storage/storageKeys";

const now = "2026-02-02T14:00:00.000Z";

const seedUsers: User[] = [
  {
    id: "usr_admin_001",
    firstName: "Elena",
    lastName: "Mora",
    email: "admin@colegiohorizonte.edu.cr",
    role: "ADMIN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_teacher_001",
    firstName: "Mauricio",
    lastName: "Vargas",
    email: "docente@colegiohorizonte.edu.cr",
    role: "TEACHER",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "usr_family_001",
    firstName: "Daniela",
    lastName: "Rojas",
    email: "familia@colegiohorizonte.edu.cr",
    role: "STUDENT_FAMILY",
    isActive: true,
    relatedStudentId: "stu_001",
    createdAt: now,
    updatedAt: now,
  },
];

const seedStudent: Student = {
  id: "stu_001",
  institutionalCode: "EST-2026-001",
  firstName: "Sofía",
  lastName: "Rojas",
  gradeLevel: "Noveno",
  section: "9-1",
  isActive: true,
};

const seedCourse: Course = {
  id: "crs_math_001",
  code: "MAT-9",
  name: "Matemática",
  teacherUserId: "usr_teacher_001",
  gradeLevel: "Noveno",
  section: "9-1",
  isActive: true,
};

const seedEnrollment: Enrollment = {
  id: "enr_001",
  studentId: "stu_001",
  courseId: "crs_math_001",
  academicYear: "2026",
  status: "ACTIVE",
};

const seedPasswords: Record<string, string> = {
  usr_admin_001: "Admin2026!",
  usr_teacher_001: "Docente2026!",
  usr_family_001: "Familia2026!",
};

async function buildCredentials(): Promise<Credential[]> {
  return Promise.all(
    seedUsers.map(async (user) => {
      const passwordSalt = createSalt();
      return {
        userId: user.id,
        passwordSalt,
        passwordHash: await hashPassword(seedPasswords[user.id], passwordSalt),
      };
    }),
  );
}

export async function initializeSeedData(): Promise<void> {
  if (localStorageService.get<User[] | null>(storageKeys.users, null).value === null) {
    localStorageService.set(storageKeys.users, seedUsers);
  }
  if (
    localStorageService.get<Credential[] | null>(storageKeys.credentials, null).value ===
    null
  ) {
    localStorageService.set(storageKeys.credentials, await buildCredentials());
  }
  if (localStorageService.get<Student[] | null>(storageKeys.students, null).value === null) {
    localStorageService.set(storageKeys.students, [seedStudent]);
  }
  if (localStorageService.get<Course[] | null>(storageKeys.courses, null).value === null) {
    localStorageService.set(storageKeys.courses, [seedCourse]);
  }
  if (
    localStorageService.get<Enrollment[] | null>(storageKeys.enrollments, null).value === null
  ) {
    localStorageService.set(storageKeys.enrollments, [seedEnrollment]);
  }
  const emptyKeys = [storageKeys.grades, storageKeys.attendance, storageKeys.announcements];
  emptyKeys.forEach((key) => {
    if (localStorageService.get<unknown[] | null>(key, null).value === null) {
      localStorageService.set(key, []);
    }
  });
}
