import { Link } from "react-router-dom";
import styles from "./StatusPage.module.css";

export function NotFoundPage() {
  return <main className={styles.page}><section><p>404 · Página no encontrada</p><h1>No encontramos la dirección solicitada</h1><span>Revisa el enlace o regresa al panel principal de la intranet.</span><Link to="/dashboard">Ir al panel principal</Link></section></main>;
}
