"use client";

import { Link } from "react-router-dom";
import { roleLabels } from "../../../core/utils/roleLabels";
import { useAuth } from "../context/AuthContext";
import { getDashboardMetrics } from "../services/dashboardService";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;
  const metrics = getDashboardMetrics(user.role);

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div>
          <p className={styles.eyebrow}>Resumen institucional</p>
          <h1>Buenos días, {user.firstName}</h1>
          <p>Esta es la información disponible para tu perfil de {roleLabels[user.role].toLowerCase()}.</p>
        </div>
        <div className={styles.date}><span>Jueves</span><strong>13 de agosto</strong><small>Curso lectivo 2026</small></div>
      </section>

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
            {user.role === "ADMIN" ? (
              <Link to="/users"><span>Administración</span><strong>Gestionar usuarios</strong><small>Altas, edición y control de acceso</small></Link>
            ) : (
              <article><span>Perfil habilitado</span><strong>Acceso verificado</strong><small>La información visible corresponde a tu rol institucional.</small></article>
            )}
            <article><span>Seguridad</span><strong>Sesión temporal activa</strong><small>El acceso se cerrará al completar el periodo de seguridad.</small></article>
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
