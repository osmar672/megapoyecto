"use client";

import { useSyncExternalStore } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { ErrorBoundary } from "./ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";
import styles from "./IntranetApp.module.css";

export default function IntranetApp() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <main className={styles.loading} aria-live="polite">
        <div className={styles.mark}>CH</div>
        <p>Intranet Escolar</p>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
