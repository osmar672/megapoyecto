import type {
  Announcement,
  AttendanceRecord,
  Course,
  Credential,
  Enrollment,
  Grade,
  Student,
  User,
} from "../types/domain";
import { createSalt, hashPassword } from "../security/password";
import { localStorageService } from "../storage/storageService";
import { storageKeys } from "../storage/storageKeys";

const now = "2026-08-13T14:00:00.000Z";

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
  {
    id: "usr_staff_001",
    firstName: "Andrea",
    lastName: "Castillo",
    email: "personal@colegiohorizonte.edu.cr",
    role: "STAFF",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

const seedStudents: Student[] = [
  { id: "stu_001", institutionalCode: "EST-2026-001", firstName: "Sofía", lastName: "Rojas", gradeLevel: "Noveno", section: "9-1", isActive: true },
  { id: "stu_002", institutionalCode: "EST-2026-002", firstName: "Diego", lastName: "Solano", gradeLevel: "Noveno", section: "9-1", isActive: true },
];

const seedCourses: Course[] = [
  { id: "crs_math_001", code: "MAT-9", name: "Matemática", teacherUserId: "usr_teacher_001", gradeLevel: "Noveno", section: "9-1", isActive: true },
  { id: "crs_science_001", code: "CIE-9", name: "Ciencias", teacherUserId: "usr_teacher_001", gradeLevel: "Noveno", section: "9-1", isActive: true },
];

const seedEnrollments: Enrollment[] = [
  { id: "enr_001", studentId: "stu_001", courseId: "crs_math_001", academicYear: "2026", status: "ACTIVE" },
  { id: "enr_002", studentId: "stu_001", courseId: "crs_science_001", academicYear: "2026", status: "ACTIVE" },
  { id: "enr_003", studentId: "stu_002", courseId: "crs_math_001", academicYear: "2026", status: "ACTIVE" },
];

const seedGrades: Grade[] = [
  { id: "grd_001", studentId: "stu_001", courseId: "crs_math_001", period: "I trimestre", score: 88, maxScore: 100, comment: "Muy buen dominio de los contenidos.", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
  { id: "grd_002", studentId: "stu_001", courseId: "crs_science_001", period: "I trimestre", score: 92, maxScore: 100, comment: "Excelente trabajo experimental.", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
  { id: "grd_003", studentId: "stu_002", courseId: "crs_math_001", period: "I trimestre", score: 76, maxScore: 100, recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
];

const seedAttendance: AttendanceRecord[] = [
  { id: "att_001", studentId: "stu_001", courseId: "crs_math_001", date: "2026-08-10", status: "PRESENT", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
  { id: "att_002", studentId: "stu_001", courseId: "crs_science_001", date: "2026-08-11", status: "LATE", notes: "Ingreso diez minutos después del inicio.", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
  { id: "att_003", studentId: "stu_001", courseId: "crs_math_001", date: "2026-08-12", status: "PRESENT", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
  { id: "att_004", studentId: "stu_002", courseId: "crs_math_001", date: "2026-08-12", status: "EXCUSED", notes: "Ausencia justificada.", recordedBy: "usr_teacher_001", createdAt: now, updatedAt: now },
];

const seedAnnouncements: Announcement[] = [
  { id: "ann_001", title: "Bienvenida al segundo trimestre", body: "La institución da la bienvenida a toda la comunidad educativa y recuerda revisar el calendario académico.", audience: "ALL", status: "PUBLISHED", authorUserId: "usr_admin_001", publishedAt: now, createdAt: now, updatedAt: now },
  { id: "ann_002", title: "Reunión de familias", body: "La reunión de seguimiento académico se realizará el viernes 21 de agosto a las 4:00 p. m.", audience: "STUDENT_FAMILY", status: "PUBLISHED", authorUserId: "usr_admin_001", publishedAt: now, createdAt: now, updatedAt: now },
];

const seedPasswords: Record<string, string> = {
  usr_admin_001: "Admin2026!",
  usr_teacher_001: "Docente2026!",
  usr_family_001: "Familia2026!",
  usr_staff_001: "Personal2026!",
};

async function buildCredentials(users: User[]): Promise<Credential[]> {
  return Promise.all(users.map(async (user) => {
    const passwordSalt = createSalt();
    return {
      userId: user.id,
      passwordSalt,
      passwordHash: await hashPassword(seedPasswords[user.id] ?? "", passwordSalt),
    };
  }));
}

async function addMissingAccounts(): Promise<void> {
  const users = localStorageService.get<User[]>(storageKeys.users, []).value;
  const credentials = localStorageService.get<Credential[]>(storageKeys.credentials, []).value;
  const storedUserIds = new Set(users.map((user) => user.id));
  const storedCredentialIds = new Set(credentials.map((credential) => credential.userId));
  const missingUsers = seedUsers.filter((user) => !storedUserIds.has(user.id));
  const missingCredentialUsers = seedUsers.filter(
    (user) => !storedCredentialIds.has(user.id),
  );

  if (missingUsers.length > 0) {
    localStorageService.set(storageKeys.users, [...users, ...missingUsers]);
  }
  if (missingCredentialUsers.length > 0) {
    localStorageService.set(
      storageKeys.credentials,
      [...credentials, ...(await buildCredentials(missingCredentialUsers))],
    );
  }
}

function initializeCollection<T extends { id: string }>(key: string, values: T[]): void {
  const stored = localStorageService.get<T[] | null>(key, null).value;
  if (stored === null) {
    localStorageService.set(key, values);
    return;
  }
  const storedIds = new Set(stored.map((item) => item.id));
  const missingSeeds = values.filter((item) => !storedIds.has(item.id));
  if (missingSeeds.length > 0) {
    localStorageService.set(key, [...stored, ...missingSeeds]);
  }
}

export async function initializeSeedData(): Promise<void> {
  await addMissingAccounts();

  initializeCollection(storageKeys.students, seedStudents);
  initializeCollection(storageKeys.courses, seedCourses);
  initializeCollection(storageKeys.enrollments, seedEnrollments);
  initializeCollection(storageKeys.grades, seedGrades);
  initializeCollection(storageKeys.attendance, seedAttendance);
  initializeCollection(storageKeys.announcements, seedAnnouncements);
}
