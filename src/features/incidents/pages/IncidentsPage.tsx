"use client";

import { useState } from "react";
import type { Incident, IncidentEvidence } from "../../../core/types/domain";
import { useAuth } from "../../auth/context/AuthContext";
import { EmptyState, FeatureHeader, StatusBadge, featureStyles as styles } from "../../shared/FeaturePage";
import { incidentRepository } from "../services/incidentRepository";

const types = ["Tecnología", "Infraestructura", "Bullying", "Transporte", "Aula", "Limpieza", "Seguridad", "Otro"];
const statuses: Incident["status"][] = ["REPORTED", "IN_REVIEW", "RESOLVED", "CLOSED"];

export function IncidentsPage() {
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const [type, setType] = useState("Tecnología");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [priority, setPriority] = useState<Incident["priority"]>("MEDIUM");
  const [evidence, setEvidence] = useState<IncidentEvidence>();
  const [message, setMessage] = useState("");
  if (!user) return null;
  const incidents = incidentRepository.listVisible(user);
  const submit = () => { try { incidentRepository.create(user, { type, description, location, occurredAt: new Date(occurredAt).toISOString(), priority, evidence }); setDescription(""); setLocation(""); setEvidence(undefined); setMessage("Incidencia enviada."); refresh((value) => value + 1); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible crear la incidencia."); } };
  const chooseFile = (file?: File) => { if (!file) { setEvidence(undefined); return; } try { setEvidence(incidentRepository.validateEvidence(file)); setMessage(""); } catch (error) { setMessage(error instanceof Error ? error.message : "Evidencia inválida."); } };
  return <div className={styles.page}><FeatureHeader eyebrow="Supervisión" title="Incidencias" description="Reporta problemas y consulta su seguimiento con privacidad según el perfil." />{message && <div className={styles.notice} role="status">{message}</div>}<section className={styles.card}><h2>Reportar incidencia</h2><div className={styles.toolbar}><label className={styles.field}>Tipo<select value={type} onChange={(event) => setType(event.target.value)}>{types.map((value) => <option key={value}>{value}</option>)}</select></label><label className={styles.field}>Lugar<input value={location} onChange={(event) => setLocation(event.target.value)} /></label><label className={styles.field}>Fecha<input type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} /></label><label className={styles.field}>Prioridad<select value={priority} onChange={(event) => setPriority(event.target.value as Incident["priority"])}><option value="LOW">Baja</option><option value="MEDIUM">Media</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></select></label><label className={styles.field}>Descripción<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label><label className={styles.field}>Evidencia opcional<input type="file" accept="image/png,image/jpeg,application/pdf" onChange={(event) => chooseFile(event.target.files?.[0])} /></label><button type="button" className={styles.button} onClick={submit}>Enviar incidencia</button></div></section><section className={styles.grid}>{incidents.length === 0 ? <EmptyState>No hay incidencias visibles para este perfil.</EmptyState> : incidents.map((incident) => <article key={incident.id} className={styles.card}><div className={styles.cardTop}><StatusBadge tone={incident.priority === "URGENT" ? "danger" : incident.priority === "HIGH" ? "warning" : "neutral"}>{incident.priority}</StatusBadge><StatusBadge tone="info">{incident.status}</StatusBadge></div><h2>{incident.type}</h2><p>{incident.description}</p><div className={styles.meta}><span>{incident.location}</span><time dateTime={incident.occurredAt}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium" }).format(new Date(incident.occurredAt))}</time>{incident.evidence[0] && <span>Evidencia: {incident.evidence[0].name}</span>}</div>{user.role === "ADMIN" && <label className={styles.field}>Actualizar estado<select value={incident.status} onChange={(event) => { incidentRepository.updateStatus(user, incident.id, event.target.value as Incident["status"]); refresh((value) => value + 1); }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>}</article>)}</section></div>;
}
