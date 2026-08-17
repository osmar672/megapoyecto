"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User, UserRole } from "../../../core/types/domain";
import { Button } from "../../../components/ui/Button";
import { FormField, SelectField } from "../../../components/ui/FormField";
import { roleLabels } from "../../../core/utils/roleLabels";
import { userRepository } from "../services/userRepository";
import { validateUserForm, type UserFormErrors, type UserFormValues } from "../validation/userValidation";
import styles from "./UserFormModal.module.css";

const emptyValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "TEACHER",
  relatedStudentId: "",
  temporaryPassword: "",
};

export function UserFormModal({
  user,
  onClose,
  onSaved,
}: {
  user?: User;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [values, setValues] = useState<UserFormValues>(() =>
    user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          relatedStudentId: user.relatedStudentId ?? "",
          temporaryPassword: "",
        }
      : emptyValues,
  );
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [saving, setSaving] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    firstFieldRef.current?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusableElements[0];
      const last = focusableElements.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.removeEventListener("keydown", handleDialogKeys);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const updateValue = (field: keyof UserFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateUserForm(values, user?.id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const commonValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        relatedStudentId: values.relatedStudentId || undefined,
      };
      if (user) {
        userRepository.update(user.id, commonValues);
        onSaved("Los datos del usuario fueron actualizados.");
      } else {
        await userRepository.create(commonValues, values.temporaryPassword);
        onSaved("El usuario fue creado y quedó activo.");
      }
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "No fue posible guardar el usuario.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="user-form-title">
        <header className={styles.header}>
          <div><p>{user ? "Edición de acceso" : "Nuevo acceso institucional"}</p><h2 id="user-form-title">{user ? "Editar usuario" : "Registrar usuario"}</h2></div>
          <button type="button" aria-label="Cerrar formulario" onClick={onClose}>Cerrar</button>
        </header>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.twoColumns}>
            <FormField ref={firstFieldRef} id="firstName" label="Nombre" value={values.firstName} error={errors.firstName} onChange={(event) => updateValue("firstName", event.target.value)} />
            <FormField id="lastName" label="Apellido" value={values.lastName} error={errors.lastName} onChange={(event) => updateValue("lastName", event.target.value)} />
          </div>
          <FormField id="userEmail" label="Correo institucional" type="email" autoComplete="off" value={values.email} error={errors.email} hint="Debe pertenecer al dominio institucional." onChange={(event) => updateValue("email", event.target.value)} />
          <SelectField id="userRole" label="Rol" value={values.role} error={errors.role} onChange={(event) => updateValue("role", event.target.value as UserRole)}>
            {(Object.keys(roleLabels) as UserRole[]).map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
          </SelectField>
          {values.role === "STUDENT_FAMILY" && (
            <FormField id="relatedStudentId" label="Identificador del estudiante" value={values.relatedStudentId} error={errors.relatedStudentId} placeholder="stu_001" onChange={(event) => updateValue("relatedStudentId", event.target.value)} />
          )}
          {!user && (
            <FormField id="temporaryPassword" label="Contraseña temporal" type="password" autoComplete="new-password" value={values.temporaryPassword} error={errors.temporaryPassword} hint="Mínimo 8 caracteres. Compártela por un canal institucional seguro." onChange={(event) => updateValue("temporaryPassword", event.target.value)} />
          )}
          {errors.form && (
            <p className={styles.formError} role="alert">
              {errors.form}
            </p>
          )}
          <footer className={styles.footer}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando" : user ? "Guardar cambios" : "Crear usuario"}</Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
