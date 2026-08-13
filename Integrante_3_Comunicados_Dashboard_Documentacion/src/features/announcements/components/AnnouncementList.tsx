import type { Announcement, AuthSession } from '../../../core/types/domain';
import {
  canDeleteAnnouncement,
  canEditAnnouncement,
  canPublishAnnouncement,
  canWithdrawAnnouncement,
} from '../authorization';
import styles from '../Announcements.module.css';

interface AnnouncementListProps {
  session: AuthSession;
  announcements: Announcement[];
  busyId: string | null;
  onEdit: (announcement: Announcement) => void;
  onPublish: (announcement: Announcement) => Promise<void>;
  onWithdraw: (announcement: Announcement) => Promise<void>;
  onDelete: (announcement: Announcement) => Promise<void>;
}

function formatDate(value: string | undefined): string {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AnnouncementList({
  session,
  announcements,
  busyId,
  onEdit,
  onPublish,
  onWithdraw,
  onDelete,
}: AnnouncementListProps) {
  return (
    <div className={styles.list} aria-label="Listado de comunicados">
      {announcements.map((announcement) => {
        const busy = busyId === announcement.id;
        const canEdit = canEditAnnouncement(session, announcement);
        const canPublish = canPublishAnnouncement(session.role) && announcement.status === 'DRAFT';
        const canWithdraw = canWithdrawAnnouncement(session.role, announcement);
        const canDelete = canDeleteAnnouncement(session.role);

        return (
          <article className={styles.card} key={announcement.id}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.meta}>
                  <span>{announcement.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}</span>
                  <span>Audiencia: {announcement.audience}</span>
                </p>
                <h2>{announcement.title}</h2>
              </div>
              <span className={styles.statusBadge}>{announcement.status}</span>
            </div>

            <p className={styles.body}>{announcement.body}</p>

            <dl className={styles.details}>
              <div>
                <dt>Actualizado</dt>
                <dd>{formatDate(announcement.updatedAt)}</dd>
              </div>
              {announcement.publishedAt ? (
                <div>
                  <dt>Publicado</dt>
                  <dd>{formatDate(announcement.publishedAt)}</dd>
                </div>
              ) : null}
            </dl>

            {canEdit || canPublish || canWithdraw || canDelete ? (
              <div className={styles.actions} aria-label={`Acciones para ${announcement.title}`}>
                {canEdit ? (
                  <button type="button" className={styles.secondaryButton} onClick={() => onEdit(announcement)} disabled={busy}>
                    Editar
                  </button>
                ) : null}
                {canPublish ? (
                  <button type="button" className={styles.primaryButton} onClick={() => onPublish(announcement)} disabled={busy}>
                    Publicar
                  </button>
                ) : null}
                {canWithdraw ? (
                  <button type="button" className={styles.secondaryButton} onClick={() => onWithdraw(announcement)} disabled={busy}>
                    Retirar publicación
                  </button>
                ) : null}
                {canDelete ? (
                  <button type="button" className={styles.dangerButton} onClick={() => onDelete(announcement)} disabled={busy}>
                    Eliminar
                  </button>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
