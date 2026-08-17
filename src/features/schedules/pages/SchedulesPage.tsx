"use client";

import { useState } from "react";
import type { ScheduleEntry } from "../../../core/types/domain";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { scheduleRepository } from "../services/scheduleRepository";

const days = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export function SchedulesPage() {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const [view, setView] = useState<"DAY" | "WEEK">("WEEK");
  const [day, setDay] = useState(new Date().getDay() || 1);
  const [editing, setEditing] = useState<ScheduleEntry>();
  const [message, setMessage] = useState("");
  if (!user) return null;
  const allEntries = scheduleRepository.listForUser(user);
  const entries = view === "DAY" ? allEntries.filter((entry) => entry.dayOfWeek === day) : allEntries;
  const canEdit = ["ADMIN", "TEACHER", "STAFF"].includes(user.role);
  const save = () => {
    if (!editing) return;
    try { scheduleRepository.update(user, editing); setEditing(undefined); setMessage("Horario actualizado."); refresh((value) => value + 1); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible actualizar."); }
  };
  return <div className={styles.page}><FeatureHeader eyebrow="Organización académica" title="Horario escolar" description="Vista diaria y semanal con materia, docente, aula y detección de la jornada correspondiente." />{message && <div className={styles.notice} role="status">{message}</div>}<div className={styles.toolbar}><button type="button" className={`${styles.button} ${view !== "DAY" ? styles.buttonSecondary : ""}`} onClick={() => setView("DAY")}>Vista diaria</button><button type="button" className={`${styles.button} ${view !== "WEEK" ? styles.buttonSecondary : ""}`} onClick={() => setView("WEEK")}>Vista semanal</button>{view === "DAY" && <label className={styles.field}>Día<select value={day} onChange={(event) => setDay(Number(event.target.value))}>{days.slice(1).map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></label>}</div>{editing && <section className={styles.card}><h2>Editar {editing.subject}</h2><div className={styles.toolbar}><label className={styles.field}>Inicio<input type="time" value={editing.startTime} onChange={(event) => setEditing({ ...editing, startTime: event.target.value })} /></label><label className={styles.field}>Final<input type="time" value={editing.endTime} onChange={(event) => setEditing({ ...editing, endTime: event.target.value })} /></label><label className={styles.field}>Aula<input value={editing.location} onChange={(event) => setEditing({ ...editing, location: event.target.value })} /></label><button type="button" className={styles.button} onClick={save}>Guardar cambio</button><button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setEditing(undefined)}>Cancelar</button></div></section>}<div className={styles.tableWrap}>{entries.length === 0 ? <EmptyState>No hay clases en la vista seleccionada.</EmptyState> : <table className={styles.table}><thead><tr><th>Día</th><th>Hora</th><th>Materia</th><th>Docente</th><th>Aula</th>{canEdit && <th>Acción</th>}</tr></thead><tbody>{entries.map((entry) => <tr key={entry.id}><td>{days[entry.dayOfWeek]}</td><td>{entry.startTime}–{entry.endTime}</td><td><strong>{entry.subject}</strong><br /><StatusBadge>{entry.type}</StatusBadge></td><td>{entry.teacherName}</td><td>{entry.location}</td>{canEdit && <td><button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => setEditing(entry)}>Editar</button></td>}</tr>)}</tbody></table>}</div></div>;
}
