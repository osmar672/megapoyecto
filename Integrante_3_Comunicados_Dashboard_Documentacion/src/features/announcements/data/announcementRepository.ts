import type { Announcement, AuthSession } from '../../../core/types/domain';
import {
  canCreateAnnouncement,
  canDeleteAnnouncement,
  canEditAnnouncement,
  canPublishAnnouncement,
  canWithdrawAnnouncement,
  isAnnouncementVisible,
} from '../authorization';
import { validateAnnouncementInput, type AnnouncementInput } from '../validators';

const announcementsKey = 'schoolIntranet.v1.announcements';

export class AnnouncementRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnnouncementRepositoryError';
  }
}

function parseAnnouncements(raw: string | null): Announcement[] {
  if (!raw) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value as Announcement[] : [];
  } catch {
    throw new AnnouncementRepositoryError('No fue posible leer los comunicados almacenados.');
  }
}

export class AnnouncementRepository {
  constructor(private readonly storage: Storage = window.localStorage) {}

  async listVisible(session: AuthSession): Promise<Announcement[]> {
    return this.readAll()
      .filter((announcement) => isAnnouncementVisible(session, announcement))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async createDraft(session: AuthSession, input: AnnouncementInput): Promise<Announcement> {
    if (!canCreateAnnouncement(session.role)) {
      throw new AnnouncementRepositoryError('No tiene permisos para crear comunicados.');
    }

    const validated = validateAnnouncementInput(input);
    if (!validated.isValid || !validated.value) {
      throw new AnnouncementRepositoryError(validated.errors.join(' '));
    }

    const now = new Date().toISOString();
    const announcement: Announcement = {
      id: crypto.randomUUID(),
      title: validated.value.title,
      body: validated.value.body,
      audience: validated.value.audience,
      status: 'DRAFT',
      authorUserId: session.userId,
      createdAt: now,
      updatedAt: now,
    };

    const announcements = this.readAll();
    announcements.push(announcement);
    this.writeAll(announcements);

    return announcement;
  }

  async update(session: AuthSession, id: string, input: AnnouncementInput): Promise<Announcement> {
    const announcements = this.readAll();
    const index = announcements.findIndex((announcement) => announcement.id === id);

    if (index < 0) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    const current = announcements[index];
    if (!current) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    if (!canEditAnnouncement(session, current)) {
      throw new AnnouncementRepositoryError('No tiene permisos para editar este comunicado.');
    }

    const validated = validateAnnouncementInput(input);
    if (!validated.isValid || !validated.value) {
      throw new AnnouncementRepositoryError(validated.errors.join(' '));
    }

    const updated: Announcement = {
      ...current,
      title: validated.value.title,
      body: validated.value.body,
      audience: validated.value.audience,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };

    announcements[index] = updated;
    this.writeAll(announcements);

    return updated;
  }

  async publish(session: AuthSession, id: string): Promise<Announcement> {
    if (!canPublishAnnouncement(session.role)) {
      throw new AnnouncementRepositoryError('No tiene permisos para publicar comunicados.');
    }

    const announcements = this.readAll();
    const index = announcements.findIndex((announcement) => announcement.id === id);

    if (index < 0) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    const current = announcements[index];
    if (!current) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    const now = new Date().toISOString();
    const published: Announcement = {
      ...current,
      status: 'PUBLISHED',
      publishedAt: now,
      createdAt: current.createdAt,
      updatedAt: now,
    };

    announcements[index] = published;
    this.writeAll(announcements);

    return published;
  }

  async withdraw(session: AuthSession, id: string): Promise<Announcement> {
    const announcements = this.readAll();
    const index = announcements.findIndex((announcement) => announcement.id === id);

    if (index < 0) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    const current = announcements[index];
    if (!current) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    if (!canWithdrawAnnouncement(session.role, current)) {
      throw new AnnouncementRepositoryError('No tiene permisos para retirar este comunicado.');
    }

    const withdrawn: Announcement = {
      ...current,
      status: 'DRAFT',
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    delete withdrawn.publishedAt;

    announcements[index] = withdrawn;
    this.writeAll(announcements);

    return withdrawn;
  }

  async remove(session: AuthSession, id: string): Promise<void> {
    if (!canDeleteAnnouncement(session.role)) {
      throw new AnnouncementRepositoryError('No tiene permisos para eliminar comunicados.');
    }

    const announcements = this.readAll();
    const next = announcements.filter((announcement) => announcement.id !== id);

    if (next.length === announcements.length) {
      throw new AnnouncementRepositoryError('El comunicado no existe.');
    }

    this.writeAll(next);
  }

  private readAll(): Announcement[] {
    return parseAnnouncements(this.storage.getItem(announcementsKey));
  }

  private writeAll(announcements: Announcement[]): void {
    this.storage.setItem(announcementsKey, JSON.stringify(announcements));
  }
}
