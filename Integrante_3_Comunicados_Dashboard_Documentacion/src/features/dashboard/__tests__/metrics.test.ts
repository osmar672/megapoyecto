import { describe, expect, it } from 'vitest';
import type { Announcement, AttendanceRecord, Course, Enrollment, Grade, User } from '../../../core/types/domain';
import { buildDashboardMetrics, hasDashboardData, type DashboardData } from '../metrics';

const baseUserFields = {
  firstName: 'Usuario',
  lastName: 'Prueba',
  email: 'demo@example.test',
  isActive: true,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

function emptyData(): DashboardData {
  return {
    users: [],
    students: [],
    courses: [],
    enrollments: [],
    grades: [],
    attendance: [],
    announcements: [],
  };
}

describe('dashboard metrics', () => {
  it('calculates administrative metrics by active role', () => {
    const admin: User = { id: 'admin-1', role: 'ADMIN', ...baseUserFields };
    const teacher: User = { id: 'teacher-1', role: 'TEACHER', ...baseUserFields };
    const inactiveTeacher: User = { id: 'teacher-2', role: 'TEACHER', ...baseUserFields, isActive: false };
    const data = emptyData();
    data.users = [admin, teacher, inactiveTeacher];
    data.courses = [{ id: 'course-1' } as Course];
    data.announcements = [{ status: 'PUBLISHED' } as Announcement];

    const metrics = buildDashboardMetrics(admin, data);

    expect(metrics.kind).toBe('ADMIN');
    if (metrics.kind === 'ADMIN') {
      expect(metrics.activeUsers).toBe(2);
      expect(metrics.usersByRole.TEACHER).toBe(1);
      expect(metrics.courses).toBe(1);
      expect(metrics.publishedAnnouncements).toBe(1);
    }
  });

  it('calculates teacher courses, unique students and relevant announcements', () => {
    const teacher: User = { id: 'teacher-1', role: 'TEACHER', ...baseUserFields };
    const data = emptyData();
    data.courses = [
      { id: 'course-1', teacherUserId: teacher.id, isActive: true } as Course,
      { id: 'course-2', teacherUserId: teacher.id, isActive: true } as Course,
    ];
    data.enrollments = [
      { id: 'enrollment-1', courseId: 'course-1', studentId: 'student-1' } as Enrollment,
      { id: 'enrollment-2', courseId: 'course-2', studentId: 'student-1' } as Enrollment,
      { id: 'enrollment-3', courseId: 'course-2', studentId: 'student-2' } as Enrollment,
    ];
    data.announcements = [
      { status: 'PUBLISHED', audience: 'ALL' } as Announcement,
      { status: 'PUBLISHED', audience: 'TEACHER' } as Announcement,
      { status: 'PUBLISHED', audience: 'STUDENT_FAMILY' } as Announcement,
    ];

    const metrics = buildDashboardMetrics(teacher, data);

    expect(metrics.kind).toBe('TEACHER');
    if (metrics.kind === 'TEACHER') {
      expect(metrics.assignedCourses).toBe(2);
      expect(metrics.enrolledStudents).toBe(2);
      expect(metrics.relevantAnnouncements).toBe(2);
    }
  });

  it('does not mix academic data from another student', () => {
    const family: User = {
      id: 'family-1',
      role: 'STUDENT_FAMILY',
      relatedStudentId: 'student-1',
      ...baseUserFields,
    };
    const data = emptyData();
    data.grades = [
      { studentId: 'student-1', score: 90, maxScore: 100 } as Grade,
      { studentId: 'student-2', score: 10, maxScore: 100 } as Grade,
    ];
    data.attendance = [
      { studentId: 'student-1', status: 'PRESENT' } as AttendanceRecord,
      { studentId: 'student-2', status: 'ABSENT' } as AttendanceRecord,
    ];

    const metrics = buildDashboardMetrics(family, data);

    expect(metrics.kind).toBe('STUDENT_FAMILY');
    if (metrics.kind === 'STUDENT_FAMILY') {
      expect(metrics.availableGrades).toBe(1);
      expect(metrics.averageGradePercent).toBe(90);
      expect(metrics.attendanceRecords).toBe(1);
      expect(metrics.attendanceByStatus).toEqual({ PRESENT: 1 });
    }
  });

  it('returns a safe empty state without throwing', () => {
    const family: User = { id: 'family-1', role: 'STUDENT_FAMILY', ...baseUserFields };
    const metrics = buildDashboardMetrics(family, emptyData());

    expect(metrics.kind).toBe('STUDENT_FAMILY');
    expect(hasDashboardData(metrics)).toBe(false);
  });
});
