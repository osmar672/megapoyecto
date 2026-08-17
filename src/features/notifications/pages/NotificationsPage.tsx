"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../../core/notifications/notificationService";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";

export function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  if (!user) return null;
  const notifications = notificationService.listForUser(user.id).filter((notification) => filter === "ALL" || (filter === "UNREAD" && !notification.isRead) || (filter === "READ" && notification.isRead));
  return <div className={styles.page}><FeatureHeader eyebrow="Centro personal" title="Notificaciones" description="Consulta actualizaciones, marca elementos como leídos y navega al contenido relacionado." action={<button type="button" className={styles.button} onClick={() => { notificationService.markAllRead(user.id); refresh((value) => value + 1); }}>Marcar todas como leídas</button>} /><div className={styles.toolbar}><label className={styles.field}>Estado<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="ALL">Todas</option><option value="UNREAD">No leídas</option><option value="READ">Leídas</option></select></label></div><section className={styles.gridTwo}>{notifications.length === 0 ? <EmptyState>No hay notificaciones para este filtro.</EmptyState> : notifications.map((notification) => <article key={notification.id} className={styles.card}><div className={styles.cardTop}><StatusBadge tone={notification.isRead ? "neutral" : "info"}>{notification.isRead ? "Leída" : "Nueva"}</StatusBadge><StatusBadge>{notification.type}</StatusBadge></div><h2>{notification.title}</h2><p>{notification.message}</p><div className={styles.meta}><time dateTime={notification.createdAt}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</time></div><div className={styles.actions}>{!notification.isRead && <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => { notificationService.markRead(user.id, notification.id); refresh((value) => value + 1); }}>Marcar leída</button>}{notification.link && <button type="button" className={styles.button} onClick={() => { notificationService.markRead(user.id, notification.id); navigate(notification.link as string); }}>Abrir</button>}</div></article>)}</section></div>;
}
