"use client";

import { useState } from "react";
import type { EmergencyNotice } from "../../../core/types/domain";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { emergencyRepository } from "../services/emergencyRepository";

export function EmergenciesPage() {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<EmergencyNotice["kind"]>("INFORMATION");
  const [message, setMessage] = useState("");
  if (!user) return null;
  const notices = emergencyRepository.list();
  const active = notices.filter((notice) => notice.status === "ACTIVE");
  const canManage = user.role === "ADMIN" || user.role === "STAFF";
  const publish = () => {
    try { emergencyRepository.publish(user, { title, body, kind }); setTitle(""); setBody(""); setMessage("Comunicado de emergencia publicado."); refresh((value) => value + 1); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible publicar."); }
  };

  return (
    <div className={styles.page}>
      <FeatureHeader eyebrow="Seguridad institucional" title="Centro de emergencias" description="Estado oficial, simulacros, protocolos y comunicados de seguridad del campus." action={<StatusBadge tone={active.length ? "danger" : "success"}>{active.length ? "PRECAUCIÓN" : "NORMAL"}</StatusBadge>} />
      {message && <div className={styles.notice} role="status">{message}</div>}
      {canManage && <section className={styles.card}><h2>Publicar información oficial</h2><div className={styles.toolbar}><label className={styles.field}>Título<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label className={styles.field}>Tipo<select value={kind} onChange={(event) => setKind(event.target.value as EmergencyNotice["kind"])}><option value="INFORMATION">Información</option><option value="WARNING">Precaución</option><option value="EVACUATION">Evacuación</option><option value="ALL_CLEAR">Fin de alerta</option></select></label><label className={styles.field}>Comunicado<textarea value={body} onChange={(event) => setBody(event.target.value)} rows={2} /></label><button type="button" className={styles.button} disabled={title.trim().length < 3 || body.trim().length < 5} onClick={publish}>Publicar</button></div></section>}
      <section className={styles.grid}>{notices.length === 0 ? <EmptyState>No hay comunicados de emergencia.</EmptyState> : notices.map((notice) => <article className={styles.card} key={notice.id}><div className={styles.cardTop}><StatusBadge tone={notice.status === "ACTIVE" ? "danger" : "success"}>{notice.status === "ACTIVE" ? "Activo" : "Resuelto"}</StatusBadge><StatusBadge>{notice.kind}</StatusBadge></div><h2>{notice.title}</h2><p>{notice.body}</p><div className={styles.meta}><time dateTime={notice.publishedAt}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notice.publishedAt))}</time></div>{canManage && notice.status === "ACTIVE" && <div className={styles.actions}><button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => { emergencyRepository.resolve(user, notice.id); refresh((value) => value + 1); }}>Marcar resuelta</button></div>}</article>)}</section>
      <details className={styles.card}><summary><strong>Ver protocolo de emergencia</strong></summary><p>Mantén la calma, sigue las indicaciones del personal, utiliza las rutas señalizadas y dirígete al punto de reunión. No regreses al edificio hasta recibir autorización oficial.</p></details>
    </div>
  );
}
