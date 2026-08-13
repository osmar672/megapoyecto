import { describe, expect, it, vi } from 'vitest';
import type { AuthSession } from '../../../core/types/domain';
import { AnnouncementRepository } from '../data/announcementRepository';

const adminSession: AuthSession = {
  userId: 'admin-1',
  role: 'ADMIN',
  issuedAt: '2026-08-13T12:00:00.000Z',
  expiresAt: '2026-08-14T12:00:00.000Z',
};

function createStorage(): Storage {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  };
}

describe('AnnouncementRepository', () => {
  it('sets publishedAt while preserving createdAt', async () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'announcement-1' });
    const repository = new AnnouncementRepository(createStorage());
    const draft = await repository.createDraft(adminSession, {
      title: 'Comunicado general',
      body: 'Contenido ficticio suficientemente largo para la prueba.',
      audience: 'ALL',
    });

    const published = await repository.publish(adminSession, draft.id);

    expect(published.status).toBe('PUBLISHED');
    expect(published.publishedAt).toBeTruthy();
    expect(published.createdAt).toBe(draft.createdAt);
  });
});
