import { useMemo } from 'react';
import { findCurrentUser, readDashboardData, readDashboardSession } from '../data/dashboardRepository';
import { buildDashboardMetrics, hasDashboardData } from '../metrics';
import styles from '../Dashboard.module.css';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
}

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <article className={styles.card} aria-label={`${label}: ${value}`}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
      {description ? <p className={styles.cardDescription}>{description}</p> : null}
    </article>
  );
}

export function DashboardPage() {
  const session = useMemo(() => readDashboardSession(), []);
  const data = useMemo(() => readDashboardData(), []);
  const user = session ? findCurrentUser(session, data) : null;
  const metrics = user ? buildDashboardMetrics(user, data) : null;

  if (!session || !user || !metrics) {
    return (
      <main className={styles.page}>
        <div className={styles.message} role="alert">
          No hay una sesión válida o el usuario activo no está disponible.
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Intranet escolar</p>
          <h1>Panel principal</h1>
          <p>Resumen disponible para el perfil {user.role}.</p>
        </div>
      </header>

      {!hasDashboardData(metrics) ? (
        <div className={styles.message} role="status" aria-live="polite">
          Todavía no hay información suficiente para construir el resumen de este perfil.
        </div>
      ) : null}

      {metrics.kind === 'ADMIN' ? (
        <>
          <section className={styles.grid} aria-label="Métricas administrativas">
            <MetricCard label="Usuarios activos" value={metrics.activeUsers} />
            <MetricCard label="Cursos registrados" value={metrics.courses} />
            <MetricCard label="Comunicados publicados" value={metrics.publishedAnnouncements} />
          </section>
          <section className={styles.panel} aria-labelledby="role-distribution-title">
            <h2 id="role-distribution-title">Distribución de usuarios activos por rol</h2>
            <dl className={styles.distribution}>
              <div><dt>Administración</dt><dd>{metrics.usersByRole.ADMIN}</dd></div>
              <div><dt>Docentes</dt><dd>{metrics.usersByRole.TEACHER}</dd></div>
              <div><dt>Estudiante/Familia</dt><dd>{metrics.usersByRole.STUDENT_FAMILY}</dd></div>
            </dl>
          </section>
        </>
      ) : null}

      {metrics.kind === 'TEACHER' ? (
        <section className={styles.grid} aria-label="Métricas docentes">
          <MetricCard label="Cursos asignados" value={metrics.assignedCourses} />
          <MetricCard label="Estudiantes matriculados" value={metrics.enrolledStudents} description="Conteo único dentro de sus cursos activos." />
          <MetricCard label="Comunicados relevantes" value={metrics.relevantAnnouncements} />
        </section>
      ) : null}

      {metrics.kind === 'STUDENT_FAMILY' ? (
        <>
          {!metrics.relatedStudentId ? (
            <div className={styles.message} role="status">
              El perfil no tiene un estudiante relacionado. No se muestran datos académicos.
            </div>
          ) : null}
          <section className={styles.grid} aria-label="Resumen del estudiante relacionado">
            <MetricCard
              label="Calificaciones disponibles"
              value={metrics.availableGrades}
              description={metrics.averageGradePercent === null
                ? 'Sin promedio disponible.'
                : `Promedio relativo: ${metrics.averageGradePercent.toFixed(1)} %.`}
            />
            <MetricCard label="Registros de asistencia" value={metrics.attendanceRecords} />
            <MetricCard label="Comunicados relevantes" value={metrics.relevantAnnouncements} />
          </section>
          {Object.keys(metrics.attendanceByStatus).length > 0 ? (
            <section className={styles.panel} aria-labelledby="attendance-status-title">
              <h2 id="attendance-status-title">Asistencia por estado</h2>
              <dl className={styles.distribution}>
                {Object.entries(metrics.attendanceByStatus).map(([status, count]) => (
                  <div key={status}><dt>{status}</dt><dd>{count}</dd></div>
                ))}
              </dl>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
