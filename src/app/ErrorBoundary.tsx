"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error de interfaz", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className={styles.page}>
          <section className={styles.card}>
            <p className={styles.eyebrow}>Estado del sistema</p>
            <h1>No pudimos mostrar esta sección</h1>
            <p>Actualiza la página. La información que ya guardaste permanece en este dispositivo.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Actualizar página
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
