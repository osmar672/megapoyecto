"use client";

import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { timelineRepository, type TimelineRange } from "../services/timelineRepository";

const rangeLabels: Record<TimelineRange, string> = { TODAY: "Hoy", WEEK: "Semana", MONTH: "Mes", YEAR: "Año" };
const typeLabels = { ACADEMIC: "Académico", ACTIVITY: "Actividad", DEADLINE: "Entrega", ANNOUNCEMENT: "Comunicado" } as const;

export function TimelinePage() {
  const { user } = useAuth();
  const [range, setRange] = useState<TimelineRange>("MONTH");
  if (!user) return null;
  const events = timelineRepository.listInRange(user.role, range);

  return (
    <div className={styles.page}>
      <FeatureHeader eyebrow="Calendario institucional" title="Línea de tiempo" description="Exámenes, actividades, entregas, reuniones y fechas importantes en una vista cronológica." />
      <div className={styles.toolbar} role="group" aria-label="Filtrar período">
        {(Object.keys(rangeLabels) as TimelineRange[]).map((value) => (
          <button key={value} type="button" className={`${styles.button} ${range !== value ? styles.buttonSecondary : ""}`} aria-pressed={range === value} onClick={() => setRange(value)}>{rangeLabels[value]}</button>
        ))}
      </div>
      <section className={styles.grid} aria-label="Próximos eventos">
        {events.length === 0 ? <EmptyState>No hay eventos en el período seleccionado.</EmptyState> : events.map((event) => (
          <article key={event.id} className={styles.card}>
            <div className={styles.cardTop}><StatusBadge tone={event.isHighlighted ? "info" : "neutral"}>{typeLabels[event.type]}</StatusBadge><time dateTime={event.startsAt}>{new Intl.DateTimeFormat("es-CR", { day: "numeric", month: "short" }).format(new Date(event.startsAt))}</time></div>
            <h2>{event.title}</h2><p>{event.description}</p>
            <div className={styles.meta}><span>{new Intl.DateTimeFormat("es-CR", { hour: "numeric", minute: "2-digit" }).format(new Date(event.startsAt))}</span>{event.location && <span>{event.location}</span>}</div>
          </article>
        ))}
      </section>
    </div>
  );
}
