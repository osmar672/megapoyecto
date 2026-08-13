export type UserRole = "ADMIN" | "TEACHER" | "STUDENT_FAMILY";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  relatedStudentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  userId: string;
  passwordSalt: string;
  passwordHash: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  issuedAt: string;
  expiresAt: string;
}

export interface Student {
  id: string;
  institutionalCode: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  section: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  teacherUserId: string;
  gradeLevel: string;
  section: string;
  isActive: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  academicYear: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  period: string;
  score: number;
  maxScore: number;
  comment?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: UserRole[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorUserId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
