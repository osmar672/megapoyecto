import type {
  Announcement,
  AttendanceRecord,
  AuthSession,
  Course,
  Enrollment,
  Grade,
  Student,
  User,
} from '../../../core/types/domain';
import type { DashboardData } from '../metrics';

const keys = {
  users: 'schoolIntranet.v1.users',
  students: 'schoolIntranet.v1.students',
  courses: 'schoolIntranet.v1.courses',
  enrollments: 'schoolIntranet.v1.enrollments',
  grades: 'schoolIntranet.v1.grades',
  attendance: 'schoolIntranet.v1.attendance',
  announcements: 'schoolIntranet.v1.announcements',
  session: 'schoolIntranet.v1.session',
} as const;

function readArray<T>(storage: Storage, key: string): T[] {
  const raw = storage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

export function readDashboardData(storage: Storage = window.localStorage): DashboardData {
  return {
    users: readArray<User>(storage, keys.users),
    students: readArray<Student>(storage, keys.students),
    courses: readArray<Course>(storage, keys.courses),
    enrollments: readArray<Enrollment>(storage, keys.enrollments),
    grades: readArray<Grade>(storage, keys.grades),
    attendance: readArray<AttendanceRecord>(storage, keys.attendance),
    announcements: readArray<Announcement>(storage, keys.announcements),
  };
}

export function readDashboardSession(storage: Storage = window.sessionStorage): AuthSession | null {
  const raw = storage.getItem(keys.session);
  if (!raw) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' ? value as AuthSession : null;
  } catch {
    return null;
  }
}

export function findCurrentUser(session: AuthSession, data: DashboardData): User | null {
  return data.users.find((user) => user.id === session.userId && user.isActive) ?? null;
}
