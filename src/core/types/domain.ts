export type UserRole = "ADMIN" | "TEACHER" | "STUDENT_FAMILY" | "STAFF";
export type AnnouncementAudience = "ALL" | UserRole;
export type SearchResultCategory =
  | "PEOPLE"
  | "PLACES"
  | "EVENTS"
  | "SCHEDULES"
  | "ANNOUNCEMENTS"
  | "PRODUCTS"
  | "ROUTES"
  | "FORUM";

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
  audience: AnnouncementAudience;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorUserId: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  userId?: string;
  displayName: string;
  avatarId?: string;
  gradeLevel: string;
  section: string;
  interests: string[];
  achievementIds: string[];
  activities: string[];
  clubs: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarConfig {
  id: string;
  userId: string;
  hair: string;
  clothing: string;
  accessory: string;
  background: string;
  updatedAt: string;
}

export interface AccessibilityPreferences {
  userId: string;
  theme: "LIGHT" | "DARK";
  highContrast: boolean;
  fontScale: number;
  largeText: boolean;
  legibleFont: boolean;
  underlineLinks: boolean;
  increasedLetterSpacing: boolean;
  reducedMotion: boolean;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  type: "ACADEMIC" | "ACTIVITY" | "DEADLINE" | "ANNOUNCEMENT";
  startsAt: string;
  endsAt?: string;
  location?: string;
  audience: AnnouncementAudience;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: "ACADEMIC" | "PARTICIPATION" | "COMMUNITY" | "PERSONAL";
  iconKey: string;
  progress: number;
  target: number;
  unlockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPost {
  id: string;
  authorUserId: string;
  title: string;
  body: string;
  category: string;
  status: "ACTIVE" | "CLOSED" | "HIDDEN";
  reactionUserIds: string[];
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  parentCommentId?: string;
  authorUserId: string;
  body: string;
  status: "ACTIVE" | "HIDDEN";
  createdAt: string;
  updatedAt: string;
}

export interface IncidentEvidence {
  name: string;
  mimeType: string;
  size: number;
  dataUrl?: string;
}

export interface Incident {
  id: string;
  reporterUserId: string;
  assignedUserId?: string;
  type: string;
  description: string;
  location: string;
  occurredAt: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "REPORTED" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  evidence: IncidentEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: string;
  description: string;
  x: number;
  y: number;
  isAccessible: boolean;
  searchTerms: string[];
  updatedAt: string;
}

export interface EmergencyNotice {
  id: string;
  title: string;
  body: string;
  kind: "INFORMATION" | "WARNING" | "EVACUATION" | "ALL_CLEAR";
  status: "ACTIVE" | "RESOLVED";
  authorUserId: string;
  publishedAt: string;
  resolvedAt?: string;
  updatedAt: string;
}

export interface BusPosition {
  x: number;
  y: number;
}

export interface Bus {
  id: string;
  number: string;
  routeId: string;
  driverName: string;
  nextStop: string;
  estimatedArrival: string;
  status: "ON_TIME" | "DELAYED" | "OUT_OF_SERVICE" | "FINISHED";
  position: BusPosition;
  updatedAt: string;
}

export interface BusStop {
  id: string;
  name: string;
  order: number;
  scheduledTime: string;
  locationId?: string;
}

export interface BusRoute {
  id: string;
  name: string;
  shift: "MORNING" | "AFTERNOON";
  departureTime: string;
  arrivalTime: string;
  stops: BusStop[];
  isActive: boolean;
  updatedAt: string;
}

export interface CafeteriaProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availability: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  imageUrl?: string;
  imageAlt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  id: string;
  userId?: string;
  studentId?: string;
  courseId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  location: string;
  type: "CLASS" | "ACTIVITY" | "TASK";
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  category: SearchResultCategory;
  title: string;
  description: string;
  path: string;
  keywords: string[];
  allowedRoles: UserRole[];
  source: string;
}

export interface AssistantMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  status: "SENDING" | "SENT" | "ERROR";
  createdAt: string;
}
