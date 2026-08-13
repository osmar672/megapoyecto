import { Link } from "react-router-dom";
import styles from "./StatusPage.module.css";

export function AccessDeniedPage() {
  return <main className={styles.page}><section><p>403 · Permisos de acceso</p><h1>Esta sección no corresponde a tu perfil</h1><span>Tu sesión está activa, pero la información solicitada está restringida por rol.</span><Link to="/dashboard">Volver al panel principal</Link></section></main>;
}
