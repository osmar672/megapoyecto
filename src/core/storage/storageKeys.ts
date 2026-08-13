const prefix = "schoolIntranet.v1";

export const storageKeys = {
  users: `${prefix}.users`,
  credentials: `${prefix}.credentials`,
  students: `${prefix}.students`,
  courses: `${prefix}.courses`,
  enrollments: `${prefix}.enrollments`,
  grades: `${prefix}.grades`,
  attendance: `${prefix}.attendance`,
  announcements: `${prefix}.announcements`,
  session: `${prefix}.session`,
} as const;
