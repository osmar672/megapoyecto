"use client";

import { useState, type FormEvent } from "react";
import type { Announcement, AnnouncementAudience } from "../../../core/types/domain";
import { Button } from "../../../components/ui/Button";
import { FormField, SelectField } from "../../../components/ui/FormField";
import { useAuth } from "../../auth/context/AuthContext";
import { canCreateAnnouncement, canEditAnnouncement } from "../authorization";
import { announcementRepository, type AnnouncementInput } from "../services/announcementRepository";
import styles from "./AnnouncementsPage.module.css";

const audienceLabels: Record<AnnouncementAudience, string> = {
  ALL: "Toda la comunidad",
  ADMIN: "Administración",
  TEACHER: "Docentes",
  STUDENT_FAMILY: "Estudiantes y familias",
  STAFF: "Personal administrativo",
};

const emptyInput: AnnouncementInput = { title: "", body: "", audience: "ALL" };

export function AnnouncementsPage() {
  const { user, session } = useAuth();
  const [, setVersion] = useState(0);
  const [input, setInput] = useState<AnnouncementInput>(emptyInput);
  const [editingId, setEditingId] = useState<string>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | Announcement["status"]>("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const announcements = session ? announcementRepository.listVisible(session).filter((announcement) => {
    const matchesText = !normalizedQuery
      || announcement.title.toLocaleLowerCase("es").includes(normalizedQuery)
      || announcement.body.toLocaleLowerCase("es").includes(normalizedQuery);
    return matchesText && (status === "ALL" || announcement.status === status);
  }) : [];

  if (!user || !session) return null;

  const refresh = (success: string) => {
    setVersion((current) => current + 1);
    setMessage(success);
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      announcementRepository.save(session, input, editingId);
      setInput(emptyInput);
      setEditingId(undefined);
      refresh(editingId ? "Comunicado actualizado." : "Borrador guardado. Administración puede publicarlo cuando esté listo.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible guardar el comunicado.");
      setMessage("");
    }
  };

  const edit = (announcement: Announcement) => {
    setInput({ title: announcement.title, body: announcement.body, audience: announcement.audience });
    setEditingId(announcement.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const run = (announcement: Announcement, action: "publish" | "withdraw" | "delete") => {
    const confirmation = action === "delete"
      ? `¿Eliminar definitivamente “${announcement.title}”?`
      : action === "publish" ? `¿Publicar “${announcement.title}”?` : `¿Archivar “${announcement.title}”?`;
    if (!window.confirm(confirmation)) return;
    try {
      if (action === "publish") announcementRepository.publish(session, announcement.id);
      else if (action === "withdraw") announcementRepository.withdraw(session, announcement.id);
      else announcementRepository.remove(session, announcement.id);
      refresh(action === "publish" ? "Comunicado publicado." : action === "withdraw" ? "Comunicado archivado." : "Comunicado eliminado.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible completar la acción.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><p>Comunicación institucional</p><h1>Comunicados</h1><span>Información visible según la audiencia y los permisos de tu perfil.</span></div>
        <strong>{announcements.length} {announcements.length === 1 ? "comunicado" : "comunicados"}</strong>
      </header>

      {message && <div className={styles.success} role="status">{message}</div>}
      {error && <div className={styles.error} role="alert">{error}</div>}

      {canCreateAnnouncement(user.role) && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}><div><p>{editingId ? "Edición" : "Nuevo contenido"}</p><h2>{editingId ? "Editar comunicado" : "Crear borrador"}</h2></div>{editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(undefined); setInput(emptyInput); }}>Cancelar</Button>}</div>
          <div className={styles.formGrid}>
            <FormField id="announcement-title" label="Título" maxLength={120} value={input.title} onChange={(event) => setInput({ ...input, title: event.target.value })} />
            <SelectField id="announcement-audience" label="Audiencia" value={input.audience} onChange={(event) => setInput({ ...input, audience: event.target.value as AnnouncementAudience })}>
              {(Object.keys(audienceLabels) as AnnouncementAudience[]).map((audience) => <option key={audience} value={audience}>{audienceLabels[audience]}</option>)}
            </SelectField>
            <label className={styles.bodyField}><span>Contenido</span><textarea rows={5} maxLength={4000} value={input.body} onChange={(event) => setInput({ ...input, body: event.target.value })} /></label>
          </div>
          <Button type="submit">{editingId ? "Guardar cambios" : "Guardar borrador"}</Button>
        </form>
      )}

      <section className={styles.board} aria-labelledby="announcement-list-title">
        <div className={styles.filters}>
          <FormField id="announcement-search" label="Buscar" type="search" placeholder="Título o contenido" value={query} onChange={(event) => setQuery(event.target.value)} />
          {user.role !== "STUDENT_FAMILY" && <SelectField id="announcement-status" label="Estado" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="ALL">Todos</option><option value="DRAFT">Borradores</option><option value="PUBLISHED">Publicados</option><option value="ARCHIVED">Archivados</option></SelectField>}
        </div>
        <h2 id="announcement-list-title" className={styles.srOnly}>Listado de comunicados</h2>
        <div className={styles.list}>
          {announcements.length === 0 ? <div className={styles.empty}><strong>No hay comunicados disponibles</strong><p>Prueba con otros filtros o vuelve más tarde.</p></div> : announcements.map((announcement) => (
            <article className={styles.card} key={announcement.id}>
              <div className={styles.cardTop}><div className={styles.badges}><span>{announcement.status === "DRAFT" ? "Borrador" : announcement.status === "PUBLISHED" ? "Publicado" : "Archivado"}</span><span>{audienceLabels[announcement.audience]}</span></div><time dateTime={announcement.updatedAt}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium" }).format(new Date(announcement.updatedAt))}</time></div>
              <h3>{announcement.title}</h3><p>{announcement.body}</p>
              {(canEditAnnouncement(session, announcement) || user.role === "ADMIN") && <div className={styles.actions}>{canEditAnnouncement(session, announcement) && <Button variant="secondary" onClick={() => edit(announcement)}>Editar</Button>}{user.role === "ADMIN" && announcement.status === "DRAFT" && <Button onClick={() => run(announcement, "publish")}>Publicar</Button>}{user.role === "ADMIN" && announcement.status === "PUBLISHED" && <Button variant="secondary" onClick={() => run(announcement, "withdraw")}>Archivar</Button>}{user.role === "ADMIN" && <Button variant="danger" onClick={() => run(announcement, "delete")}>Eliminar</Button>}</div>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
