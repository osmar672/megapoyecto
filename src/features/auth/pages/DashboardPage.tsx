"use client";

import { Link } from "react-router-dom";
import { roleLabels } from "../../../core/utils/roleLabels";
import { dashboardWidgetRegistry } from "../../../core/dashboard/dashboardWidgetRegistry";
import { registeredNavigation } from "../../../core/featureRegistry";
import { useAuth } from "../context/AuthContext";
import { getDashboardMetrics } from "../services/dashboardService";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  const metrics = getDashboardMetrics(user);
  const widgets = dashboardWidgetRegistry.listForRole(user.role);
  const today = new Date();
  const quickLinks = registeredNavigation.filter((item) => item.allowedRoles.includes(user.role) && !["/login", "/dashboard"].includes(item.path)).slice(0, 6);

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div>
          <p className={styles.eyebrow}>Resumen institucional</p>
          <h1>Buenos días, {user.firstName}</h1>
          <p>Esta es la información disponible para tu perfil de {roleLabels[user.role].toLowerCase()}.</p>
        </div>
        <div className={styles.date}><span>{new Intl.DateTimeFormat("es-CR", { weekday: "long" }).format(today)}</span><strong>{new Intl.DateTimeFormat("es-CR", { day: "numeric", month: "long" }).format(today)}</strong><small>Curso lectivo {today.getFullYear()}</small></div>
      </section>

      {widgets.length > 0 && <section className={styles.widgetSection} aria-label="Información actual de servicios"><div className={styles.panelHeader}><div><p className={styles.eyebrow}>Servicios conectados</p><h2>Información para tu jornada</h2></div></div><div className={styles.widgetGrid}>{widgets.map((widget) => { const Widget = widget.component; return <article className={styles.widgetCard} key={widget.id}><span>{widget.title}</span><Widget user={user} /></article>; })}</div></section>}

      <section className={styles.metrics} aria-label="Indicadores principales">
        {metrics.map((metric, index) => (
          <article key={metric.label} className={styles.metric}>
            <div className={styles.metricTop}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /></div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}><div><p className={styles.eyebrow}>Accesos frecuentes</p><h2>Continúa tu jornada</h2></div></div>
          <div className={styles.actions}>
            {quickLinks.map((item) => <Link key={item.path} to={item.path}><span>Acceso</span><strong>{item.label}</strong><small>Abrir módulo autorizado para tu perfil</small></Link>)}
          </div>
        </section>
        <aside className={styles.sidePanel}>
          <p className={styles.eyebrow}>Estado del portal</p>
          <h2>Todo en orden</h2>
          <div className={styles.statusRow}><span>Acceso</span><strong>Protegido</strong></div>
          <div className={styles.statusRow}><span>Perfil</span><strong>{roleLabels[user.role]}</strong></div>
          <div className={styles.statusRow}><span>Datos</span><strong>Dispositivo local</strong></div>
          <p className={styles.note}>Este prototipo utiliza únicamente información ficticia para demostrar los flujos del sistema.</p>
        </aside>
      </div>
    </div>
  );
}
