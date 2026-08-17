"use client";

import { useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { achievementRepository } from "../services/achievementRepository";

type Filter = "ALL" | "UNLOCKED" | "LOCKED" | "PROGRESS";

export function AchievementsPage() {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [message, setMessage] = useState("");
  if (!user) return null;
  const items = achievementRepository.listForUser(user).filter((item) => filter === "ALL" || (filter === "UNLOCKED" && item.unlockedAt) || (filter === "LOCKED" && !item.unlockedAt) || (filter === "PROGRESS" && !item.unlockedAt && item.progress > 0));
  return <div className={styles.page}><FeatureHeader eyebrow="Reconocimiento" title="Logros" description="Insignias, progreso y metas de participación de la comunidad escolar." />{message && <div className={styles.notice} role="status">{message}</div>}<div className={styles.toolbar}><label className={styles.field}>Filtrar<select value={filter} onChange={(event) => setFilter(event.target.value as Filter)}><option value="ALL">Todos</option><option value="UNLOCKED">Desbloqueados</option><option value="LOCKED">Bloqueados</option><option value="PROGRESS">En progreso</option></select></label></div><section className={styles.grid}>{items.length === 0 ? <EmptyState>No hay logros para este filtro.</EmptyState> : items.map((item) => { const percentage = Math.min(100, Math.round(item.progress * 100 / item.target)); return <article key={item.id} className={styles.card}><div className={styles.cardTop}><StatusBadge tone={item.unlockedAt ? "success" : "neutral"}>{item.unlockedAt ? "Desbloqueado" : "Bloqueado"}</StatusBadge><StatusBadge tone="info">{item.category}</StatusBadge></div><h2>{item.title}</h2><p>{item.description}</p><div className={styles.cardTop}><span>Progreso</span><strong>{percentage}%</strong></div><div className={styles.progress} role="progressbar" aria-label={`Progreso de ${item.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div>{user.role === "ADMIN" && !item.unlockedAt && item.progress >= item.target && <div className={styles.actions}><button type="button" className={styles.button} onClick={() => { try { achievementRepository.unlock(user, item.id); setMessage("Logro desbloqueado."); refresh((value) => value + 1); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible desbloquear."); } }}>Desbloquear</button></div>}</article>; })}</section></div>;
}
