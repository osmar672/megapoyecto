import type { ChangeEvent } from 'react';
import type { UserRole } from '../../../core/types/domain';
import { announcementAudiences, type AnnouncementAudience } from '../authorization';
import styles from '../Announcements.module.css';

export interface AnnouncementFiltersValue {
  query: string;
  status: 'ALL' | 'DRAFT' | 'PUBLISHED';
  audience: 'ALL_FILTER' | AnnouncementAudience;
}

interface AnnouncementFiltersProps {
  role: UserRole;
  value: AnnouncementFiltersValue;
  onChange: (value: AnnouncementFiltersValue) => void;
}

export function AnnouncementFilters({ role, value, onChange }: AnnouncementFiltersProps) {
  const canUseAdvancedFilters = role === 'ADMIN' || role === 'TEACHER';

  return (
    <section className={styles.filters} aria-label="Filtros de comunicados">
      <label className={styles.field}>
        <span>Buscar</span>
        <input
          type="search"
          value={value.query}
          placeholder="Buscar por título o contenido"
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ ...value, query: event.target.value })}
        />
      </label>

      {canUseAdvancedFilters ? (
        <>
          <label className={styles.field}>
            <span>Estado</span>
            <select
              value={value.status}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({
                ...value,
                status: event.target.value as AnnouncementFiltersValue['status'],
              })}
            >
              <option value="ALL">Todos</option>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Audiencia</span>
            <select
              value={value.audience}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({
                ...value,
                audience: event.target.value as AnnouncementFiltersValue['audience'],
              })}
            >
              <option value="ALL_FILTER">Todas</option>
              {announcementAudiences.map((audience) => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </label>
        </>
      ) : null}
    </section>
  );
}
