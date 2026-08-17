"use client";

import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { user, isLoading, initializationError, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Ingresa el correo institucional y la contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      const origin = (location.state as { from?: string } | null)?.from;
      navigate(origin && origin !== "/login" ? origin : "/dashboard", { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.contextPanel} aria-label="Información institucional">
        <div className={styles.contextTop}>
          <span className={styles.brandMark} aria-hidden="true">CH</span>
          <div><strong>Colegio Horizonte</strong><span>Institución pública de enseñanza</span></div>
        </div>
        <div className={styles.message}>
          <p className={styles.kicker}>Comunidad conectada</p>
          <h1>Un espacio claro para acompañar cada etapa del aprendizaje.</h1>
          <p>Consulta la información autorizada para tu perfil y mantén una comunicación segura con la institución.</p>
        </div>
        <div className={styles.contextFooter}>
          <span>Acceso protegido por perfil</span>
          <span>Datos ficticios de demostración</span>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formWrap}>
          <div className={styles.mobileBrand}><span>CH</span><strong>Colegio Horizonte</strong></div>
          <p className={styles.eyebrow}>Portal institucional</p>
          <h2>Bienvenido de nuevo</h2>
          <p className={styles.intro}>Ingresa con las credenciales asignadas por la institución.</p>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <FormField
              id="email"
              label="Correo institucional"
              type="email"
              autoComplete="username"
              placeholder="nombre@colegiohorizonte.edu.cr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <FormField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className={styles.status} aria-live="assertive">{error || initializationError}</div>
            <Button type="submit" disabled={submitting || isLoading || Boolean(initializationError)}>
              {submitting ? "Verificando acceso" : "Ingresar a la intranet"}
            </Button>
          </form>
          <details className={styles.demoAccess}>
            <summary>Ver accesos de demostración</summary>
            <dl>
              <div><dt>Administración</dt><dd><code>admin@colegiohorizonte.edu.cr</code><span>Contraseña: <code>Admin2026!</code></span></dd></div>
              <div><dt>Docente</dt><dd><code>docente@colegiohorizonte.edu.cr</code><span>Contraseña: <code>Docente2026!</code></span></dd></div>
              <div><dt>Familia</dt><dd><code>familia@colegiohorizonte.edu.cr</code><span>Contraseña: <code>Familia2026!</code></span></dd></div>
              <div><dt>Personal</dt><dd><code>personal@colegiohorizonte.edu.cr</code><span>Contraseña: <code>Personal2026!</code></span></dd></div>
            </dl>
          </details>
          <div className={styles.support}>
            <strong>¿Problemas para ingresar?</strong>
            <p>Solicita asistencia a la administración del centro educativo.</p>
          </div>
        </div>
        <p className={styles.privacy}>Uso institucional. La información se muestra según los permisos de cada perfil.</p>
      </section>
    </main>
  );
}
