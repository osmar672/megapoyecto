import type {
  Announcement,
  AttendanceRecord,
  Course,
  Enrollment,
  Grade,
  Student,
  User,
  UserRole,
} from '../../core/types/domain';

export interface DashboardData {
  users: User[];
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
}

export interface AdminDashboardMetrics {
  kind: 'ADMIN';
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  courses: number;
  publishedAnnouncements: number;
}

export interface TeacherDashboardMetrics {
  kind: 'TEACHER';
  assignedCourses: number;
  enrolledStudents: number;
  relevantAnnouncements: number;
}

export interface StudentFamilyDashboardMetrics {
  kind: 'STUDENT_FAMILY';
  relatedStudentId: string | null;
  availableGrades: number;
  averageGradePercent: number | null;
  attendanceRecords: number;
  attendanceByStatus: Record<string, number>;
  relevantAnnouncements: number;
}

export type DashboardMetrics = AdminDashboardMetrics | TeacherDashboardMetrics | StudentFamilyDashboardMetrics;

function publishedForAudience(announcements: Announcement[], audience: UserRole): Announcement[] {
  return announcements.filter((announcement) => announcement.status === 'PUBLISHED'
    && (announcement.audience === 'ALL' || announcement.audience === audience));
}

export function buildDashboardMetrics(user: User, data: DashboardData): DashboardMetrics {
  if (user.role === 'ADMIN') {
    const activeUsers = data.users.filter((candidate) => candidate.isActive);
    const usersByRole: Record<UserRole, number> = {
      ADMIN: 0,
      TEACHER: 0,
      STUDENT_FAMILY: 0,
    };

    activeUsers.forEach((candidate) => {
      usersByRole[candidate.role] += 1;
    });

    return {
      kind: 'ADMIN',
      activeUsers: activeUsers.length,
      usersByRole,
      courses: data.courses.length,
      publishedAnnouncements: data.announcements.filter((announcement) => announcement.status === 'PUBLISHED').length,
    };
  }

  if (user.role === 'TEACHER') {
    const assignedCourseIds = new Set(
      data.courses
        .filter((course) => course.teacherUserId === user.id && course.isActive)
        .map((course) => course.id),
    );
    const enrolledStudentIds = new Set(
      data.enrollments
        .filter((enrollment) => assignedCourseIds.has(enrollment.courseId))
        .map((enrollment) => enrollment.studentId),
    );

    return {
      kind: 'TEACHER',
      assignedCourses: assignedCourseIds.size,
      enrolledStudents: enrolledStudentIds.size,
      relevantAnnouncements: publishedForAudience(data.announcements, 'TEACHER').length,
    };
  }

  const relatedStudentId = user.relatedStudentId ?? null;
  if (!relatedStudentId) {
    return {
      kind: 'STUDENT_FAMILY',
      relatedStudentId: null,
      availableGrades: 0,
      averageGradePercent: null,
      attendanceRecords: 0,
      attendanceByStatus: {},
      relevantAnnouncements: publishedForAudience(data.announcements, 'STUDENT_FAMILY').length,
    };
  }

  const ownGrades = data.grades.filter((grade) => grade.studentId === relatedStudentId);
  const percentages = ownGrades
    .filter((grade) => grade.maxScore > 0)
    .map((grade) => (grade.score / grade.maxScore) * 100);
  const averageGradePercent = percentages.length > 0
    ? percentages.reduce((total, percentage) => total + percentage, 0) / percentages.length
    : null;
  const ownAttendance = data.attendance.filter((record) => record.studentId === relatedStudentId);
  const attendanceByStatus = ownAttendance.reduce<Record<string, number>>((totals, record) => {
    totals[record.status] = (totals[record.status] ?? 0) + 1;
    return totals;
  }, {});

  return {
    kind: 'STUDENT_FAMILY',
    relatedStudentId,
    availableGrades: ownGrades.length,
    averageGradePercent,
    attendanceRecords: ownAttendance.length,
    attendanceByStatus,
    relevantAnnouncements: publishedForAudience(data.announcements, 'STUDENT_FAMILY').length,
  };
}

export function hasDashboardData(metrics: DashboardMetrics): boolean {
  if (metrics.kind === 'ADMIN') {
    return metrics.activeUsers > 0 || metrics.courses > 0 || metrics.publishedAnnouncements > 0;
  }

  if (metrics.kind === 'TEACHER') {
    return metrics.assignedCourses > 0 || metrics.enrolledStudents > 0 || metrics.relevantAnnouncements > 0;
  }

  return metrics.availableGrades > 0 || metrics.attendanceRecords > 0 || metrics.relevantAnnouncements > 0;
}
