import type { ReactNode } from "react";
import styles from "./FeaturePage.module.css";

export function FeatureHeader({ eyebrow, title, description, action }: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </header>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className={styles.empty} role="status"><strong>Sin resultados</strong><p>{children}</p></div>;
}

export function StatusBadge({ tone = "neutral", children }: {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

export { styles as featureStyles };
