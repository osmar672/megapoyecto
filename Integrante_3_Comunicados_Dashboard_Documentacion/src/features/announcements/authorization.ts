import type { Announcement, AuthSession, UserRole } from '../../core/types/domain';

export const announcementAudiences = ['ALL', 'ADMIN', 'TEACHER', 'STUDENT_FAMILY'] as const;

export type AnnouncementAudience = (typeof announcementAudiences)[number];

export function canCreateAnnouncement(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'TEACHER';
}

export function canEditAnnouncement(session: AuthSession, announcement: Announcement): boolean {
  if (session.role === 'ADMIN') {
    return true;
  }

  return session.role === 'TEACHER'
    && announcement.status === 'DRAFT'
    && announcement.authorUserId === session.userId;
}

export function canPublishAnnouncement(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canDeleteAnnouncement(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canWithdrawAnnouncement(role: UserRole, announcement: Announcement): boolean {
  return role === 'ADMIN' && announcement.status === 'PUBLISHED';
}

export function isAnnouncementVisible(session: AuthSession, announcement: Announcement): boolean {
  if (session.role === 'ADMIN') {
    return true;
  }

  if (session.role === 'TEACHER') {
    const isOwnDraft = announcement.status === 'DRAFT' && announcement.authorUserId === session.userId;
    const isRelevantPublished = announcement.status === 'PUBLISHED'
      && (announcement.audience === 'ALL' || announcement.audience === 'TEACHER');

    return isOwnDraft || isRelevantPublished;
  }

  return announcement.status === 'PUBLISHED'
    && (announcement.audience === 'ALL' || announcement.audience === 'STUDENT_FAMILY');
}
