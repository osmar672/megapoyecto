import { useEffect, useMemo, useState } from 'react';
import type { Announcement, AuthSession } from '../../../core/types/domain';
import { canCreateAnnouncement } from '../authorization';
import { AnnouncementFilters, type AnnouncementFiltersValue } from '../components/AnnouncementFilters';
import { AnnouncementForm } from '../components/AnnouncementForm';
import { AnnouncementList } from '../components/AnnouncementList';
import { AnnouncementStatus } from '../components/AnnouncementStatus';
import { AnnouncementRepository } from '../data/announcementRepository';
import { readCurrentSession } from '../data/sessionReader';
import type { AnnouncementInput } from '../validators';
import styles from '../Announcements.module.css';

const repository = new AnnouncementRepository();

const initialFilters: AnnouncementFiltersValue = {
  query: '',
  status: 'ALL',
  audience: 'ALL_FILTER',
};

export function AnnouncementsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formBusy, setFormBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  async function refresh(activeSession: AuthSession) {
    const visible = await repository.listVisible(activeSession);
    setAnnouncements(visible);
  }

  useEffect(() => {
    const activeSession = readCurrentSession();
    setSession(activeSession);

    if (!activeSession) {
      setLoading(false);
      return;
    }

    refresh(activeSession)
      .catch((error: unknown) => {
        setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'No fue posible cargar los comunicados.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLocaleLowerCase('es');

    return announcements.filter((announcement) => {
      const matchesQuery = normalizedQuery.length === 0
        || announcement.title.toLocaleLowerCase('es').includes(normalizedQuery)
        || announcement.body.toLocaleLowerCase('es').includes(normalizedQuery);
      const matchesStatus = filters.status === 'ALL' || announcement.status === filters.status;
      const matchesAudience = filters.audience === 'ALL_FILTER' || announcement.audience === filters.audience;

      return matchesQuery && matchesStatus && matchesAudience;
    });
  }, [announcements, filters]);

  if (loading) {
    return <AnnouncementStatus kind="loading" message="Cargando comunicados." />;
  }

  if (!session) {
    return <AnnouncementStatus kind="error" message="No hay una sesión válida para consultar comunicados." />;
  }

  async function handleSubmit(input: AnnouncementInput) {
    if (!session) {
      return;
    }

    setFormBusy(true);
    setFeedback(null);

    try {
      if (editing) {
        await repository.update(session, editing.id, input);
        setFeedback({ kind: 'success', message: 'El comunicado fue actualizado correctamente.' });
      } else {
        await repository.createDraft(session, input);
        setFeedback({ kind: 'success', message: 'El borrador fue creado correctamente.' });
      }

      setEditing(null);
      await refresh(session);
    } catch (error: unknown) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'No fue posible guardar el comunicado.' });
    } finally {
      setFormBusy(false);
    }
  }

  async function runAnnouncementAction(
    announcement: Announcement,
    action: 'publish' | 'withdraw' | 'delete',
  ) {
    if (!session) {
      return;
    }

    const confirmations = {
      publish: `¿Desea publicar "${announcement.title}"?`,
      withdraw: `¿Desea retirar la publicación "${announcement.title}"?`,
      delete: `¿Desea eliminar "${announcement.title}"? Esta acción no se puede deshacer.`,
    };

    if (!window.confirm(confirmations[action])) {
      return;
    }

    setBusyId(announcement.id);
    setFeedback(null);

    try {
      if (action === 'publish') {
        await repository.publish(session, announcement.id);
        setFeedback({ kind: 'success', message: 'El comunicado fue publicado correctamente.' });
      } else if (action === 'withdraw') {
        await repository.withdraw(session, announcement.id);
        setFeedback({ kind: 'success', message: 'La publicación fue retirada y volvió a borrador.' });
      } else {
        await repository.remove(session, announcement.id);
        setFeedback({ kind: 'success', message: 'El comunicado fue eliminado correctamente.' });
      }

      if (editing?.id === announcement.id) {
        setEditing(null);
      }

      await refresh(session);
    } catch (error: unknown) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : 'No fue posible completar la acción.' });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Intranet escolar</p>
          <h1>Comunicados</h1>
          <p>Consulte información institucional según los permisos de su perfil.</p>
        </div>
      </header>

      {feedback ? <AnnouncementStatus kind={feedback.kind} message={feedback.message} /> : null}

      {canCreateAnnouncement(session.role) ? (
        <AnnouncementForm
          editing={editing}
          busy={formBusy}
          onCancelEdit={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      ) : null}

      <AnnouncementFilters role={session.role} value={filters} onChange={setFilters} />

      {filteredAnnouncements.length === 0 ? (
        <AnnouncementStatus
          kind="empty"
          message={announcements.length === 0
            ? 'No hay comunicados disponibles para su perfil.'
            : 'No hay comunicados que coincidan con los filtros seleccionados.'}
        />
      ) : (
        <AnnouncementList
          session={session}
          announcements={filteredAnnouncements}
          busyId={busyId}
          onEdit={setEditing}
          onPublish={(announcement) => runAnnouncementAction(announcement, 'publish')}
          onWithdraw={(announcement) => runAnnouncementAction(announcement, 'withdraw')}
          onDelete={(announcement) => runAnnouncementAction(announcement, 'delete')}
        />
      )}
    </main>
  );
}
