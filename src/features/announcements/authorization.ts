import type { Announcement, AuthSession, UserRole } from "../../core/types/domain";

export function canCreateAnnouncement(role: UserRole): boolean {
  return role === "ADMIN" || role === "TEACHER";
}

export function canEditAnnouncement(session: AuthSession, announcement: Announcement): boolean {
  return session.role === "ADMIN"
    || (session.role === "TEACHER" && announcement.status === "DRAFT" && announcement.authorUserId === session.userId);
}

export function isAnnouncementVisible(session: AuthSession, announcement: Announcement): boolean {
  if (session.role === "ADMIN") return true;
  if (session.role === "TEACHER" && announcement.status === "DRAFT") {
    return announcement.authorUserId === session.userId;
  }
  return announcement.status === "PUBLISHED"
    && (announcement.audience === "ALL" || announcement.audience === session.role);
}
