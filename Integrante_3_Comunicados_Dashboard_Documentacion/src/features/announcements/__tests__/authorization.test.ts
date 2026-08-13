import { describe, expect, it } from 'vitest';
import type { Announcement, AuthSession } from '../../../core/types/domain';
import { canEditAnnouncement, isAnnouncementVisible } from '../authorization';

const teacherSession: AuthSession = {
  userId: 'teacher-1',
  role: 'TEACHER',
  issuedAt: '2026-08-13T12:00:00.000Z',
  expiresAt: '2026-08-14T12:00:00.000Z',
};

const familySession: AuthSession = {
  userId: 'family-1',
  role: 'STUDENT_FAMILY',
  issuedAt: '2026-08-13T12:00:00.000Z',
  expiresAt: '2026-08-14T12:00:00.000Z',
};

function announcement(overrides: Partial<Announcement> = {}): Announcement {
  return {
    id: 'announcement-1',
    title: 'Reunión institucional',
    body: 'Información ficticia para pruebas del prototipo.',
    audience: 'ALL',
    status: 'PUBLISHED',
    authorUserId: 'teacher-1',
    publishedAt: '2026-08-13T12:30:00.000Z',
    createdAt: '2026-08-13T12:00:00.000Z',
    updatedAt: '2026-08-13T12:30:00.000Z',
    ...overrides,
  };
}

describe('announcement authorization', () => {
  it('shows published announcements only to matching audiences', () => {
    expect(isAnnouncementVisible(familySession, announcement({ audience: 'ALL' }))).toBe(true);
    expect(isAnnouncementVisible(familySession, announcement({ audience: 'STUDENT_FAMILY' }))).toBe(true);
    expect(isAnnouncementVisible(familySession, announcement({ audience: 'TEACHER' }))).toBe(false);
  });

  it('excludes drafts from student or family profiles', () => {
    const draft = announcement({ status: 'DRAFT' });
    delete draft.publishedAt;
    expect(isAnnouncementVisible(familySession, draft)).toBe(false);
  });

  it('blocks teachers from editing announcements by another author', () => {
    expect(canEditAnnouncement(
      teacherSession,
      (() => {
        const draft = announcement({ status: 'DRAFT', authorUserId: 'teacher-2' });
        delete draft.publishedAt;
        return draft;
      })(),
    )).toBe(false);
  });
});
