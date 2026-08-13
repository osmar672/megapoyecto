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
const seedUserIds = new Set(["usr_admin_001", "usr_teacher_001", "usr_family_001"]);

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
};

async function buildCredentials(): Promise<Credential[]> {
  return Promise.all(seedUsers.map(async (user) => {
    const passwordSalt = createSalt();
    return {
      userId: user.id,
      passwordSalt,
      passwordHash: await hashPassword(seedPasswords[user.id] ?? "", passwordSalt),
    };
  }));
}

function needsCredentialMigration(users: User[], credentials: Credential[]): boolean {
  return seedUsers.some((seedUser) => {
    const storedUser = users.find((user) => user.id === seedUser.id);
    const credential = credentials.find((item) => item.userId === seedUser.id);
    return storedUser?.email.toLowerCase() !== seedUser.email
      || !credential
      || credential.passwordSalt === "demo"
      || credential.passwordHash.length !== 64;
  });
}

async function migrateLegacyAccounts(): Promise<void> {
  const users = localStorageService.get<User[]>(storageKeys.users, []).value;
  const credentials = localStorageService.get<Credential[]>(storageKeys.credentials, []).value;
  if (!needsCredentialMigration(users, credentials)) return;

  const customUsers = users.filter((user) => !seedUserIds.has(user.id));
  const customCredentials = credentials.filter((credential) => !seedUserIds.has(credential.userId));
  localStorageService.set(storageKeys.users, [...seedUsers, ...customUsers]);
  localStorageService.set(storageKeys.credentials, [...(await buildCredentials()), ...customCredentials]);
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
  const usersMissing = localStorageService.get<User[] | null>(storageKeys.users, null).value === null;
  const credentialsMissing = localStorageService.get<Credential[] | null>(storageKeys.credentials, null).value === null;

  if (usersMissing) localStorageService.set(storageKeys.users, seedUsers);
  if (credentialsMissing) localStorageService.set(storageKeys.credentials, await buildCredentials());
  await migrateLegacyAccounts();

  initializeCollection(storageKeys.students, seedStudents);
  initializeCollection(storageKeys.courses, seedCourses);
  initializeCollection(storageKeys.enrollments, seedEnrollments);
  initializeCollection(storageKeys.grades, seedGrades);
  initializeCollection(storageKeys.attendance, seedAttendance);
  initializeCollection(storageKeys.announcements, seedAnnouncements);
}
