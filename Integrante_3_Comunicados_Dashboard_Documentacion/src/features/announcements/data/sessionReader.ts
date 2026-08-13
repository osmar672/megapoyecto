import type { AuthSession } from '../../../core/types/domain';

const sessionKey = 'schoolIntranet.v1.session';

export function readCurrentSession(storage: Storage = window.sessionStorage): AuthSession | null {
  const raw = storage.getItem(sessionKey);

  if (!raw) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Partial<AuthSession>;
    if (!candidate.userId || !candidate.role || !candidate.issuedAt || !candidate.expiresAt) {
      return null;
    }

    if (new Date(candidate.expiresAt).getTime() <= Date.now()) {
      return null;
    }

    return candidate as AuthSession;
  } catch {
    return null;
  }
}
