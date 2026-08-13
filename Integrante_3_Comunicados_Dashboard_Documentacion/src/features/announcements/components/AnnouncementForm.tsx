import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { Announcement } from '../../../core/types/domain';
import { announcementAudiences, type AnnouncementAudience } from '../authorization';
import { validateAnnouncementInput, type AnnouncementInput } from '../validators';
import styles from '../Announcements.module.css';

interface AnnouncementFormProps {
  editing: Announcement | null;
  busy: boolean;
  onCancelEdit: () => void;
  onSubmit: (input: AnnouncementInput) => Promise<void>;
}

const initialInput: AnnouncementInput = {
  title: '',
  body: '',
  audience: 'ALL',
};

export function AnnouncementForm({ editing, busy, onCancelEdit, onSubmit }: AnnouncementFormProps) {
  const [input, setInput] = useState<AnnouncementInput>(initialInput);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!editing) {
      setInput(initialInput);
      setErrors([]);
      return;
    }

    setInput({
      title: editing.title,
      body: editing.body,
      audience: editing.audience as AnnouncementAudience,
    });
    setErrors([]);
  }, [editing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateAnnouncementInput(input);

    if (!result.isValid || !result.value) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    await onSubmit(result.value);

    if (!editing) {
      setInput(initialInput);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeading}>
        <div>
          <h2>{editing ? 'Editar comunicado' : 'Nuevo comunicado'}</h2>
          <p>Los comunicados se guardan como borrador hasta que Administración los publique.</p>
        </div>
        {editing ? (
          <button type="button" className={styles.secondaryButton} onClick={onCancelEdit} disabled={busy}>
            Cancelar edición
          </button>
        ) : null}
      </div>

      {errors.length > 0 ? (
        <div className={styles.validation} role="alert" aria-live="assertive">
          <strong>Revise los siguientes datos:</strong>
          <ul>
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      ) : null}

      <label className={styles.field}>
        <span>Título</span>
        <input
          value={input.title}
          maxLength={120}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setInput({ ...input, title: event.target.value })}
          disabled={busy}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Cuerpo</span>
        <textarea
          value={input.body}
          maxLength={4000}
          rows={7}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput({ ...input, body: event.target.value })}
          disabled={busy}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Audiencia</span>
        <select
          value={input.audience}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setInput({ ...input, audience: event.target.value as AnnouncementAudience })}
          disabled={busy}
        >
          {announcementAudiences.map((audience) => (
            <option key={audience} value={audience}>{audience}</option>
          ))}
        </select>
      </label>

      <button type="submit" className={styles.primaryButton} disabled={busy}>
        {busy ? 'Guardando' : editing ? 'Guardar cambios' : 'Guardar borrador'}
      </button>
    </form>
  );
}
