import styles from '../Announcements.module.css';

interface AnnouncementStatusProps {
  kind: 'loading' | 'success' | 'error' | 'empty';
  message: string;
}

export function AnnouncementStatus({ kind, message }: AnnouncementStatusProps) {
  const live = kind === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className={`${styles.status} ${styles[`status_${kind}`]}`}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={live}
    >
      {message}
    </div>
  );
}
