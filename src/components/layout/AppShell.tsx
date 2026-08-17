"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { appEventBus } from "../../core/events/appEventBus";
import { registeredNavigation } from "../../core/featureRegistry";
import { notificationService } from "../../core/notifications/notificationService";
import { searchProviderRegistry } from "../../core/search/searchProviderRegistry";
import { roleLabels } from "../../core/utils/roleLabels";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Button } from "../ui/Button";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notificationVersion, setNotificationVersion] = useState(0);
  const navigation = registeredNavigation.filter((item) =>
    user ? item.allowedRoles.includes(user.role) : false,
  );
  const searchResults = useMemo(
    () => user ? searchProviderRegistry.search(query, { userId: user.id, role: user.role }).slice(0, 8) : [],
    [query, user],
  );
  const unreadCount = user ? notificationService.getUnreadCount(user.id) : 0;

  useEffect(() => appEventBus.on("notification:created", () => {
    setNotificationVersion((current) => current + 1);
  }), []);

  void notificationVersion;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">Saltar al contenido principal</a>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">CH</span>
          <span><strong>Colegio Horizonte</strong><small>Comunidad educativa</small></span>
        </div>
        <nav aria-label="Navegación principal" className={styles.nav}>
          <p className={styles.navLabel}>Espacio de trabajo</p>
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.navIndicator} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>Curso lectivo</p>
          <strong>2026</strong>
          <span>II trimestre en curso</span>
        </div>
      </aside>

      <header className={styles.header}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
        <div className={styles.headerTitle}>
          <span>Portal institucional</span>
          <strong>Intranet Escolar</strong>
        </div>
        {user && <div className={styles.search}>
          <label htmlFor="global-search">Búsqueda global</label>
          <input id="global-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Personas, lugares, eventos..." autoComplete="off" />
          {query.trim() && <div className={styles.searchResults} role="listbox" aria-label="Resultados de búsqueda">
            {searchResults.length === 0 ? <p role="status">No hay resultados.</p> : searchResults.map((result) => <button key={`${result.source}-${result.id}`} type="button" role="option" aria-selected="false" onClick={() => { setQuery(""); navigate(result.path); }}><span>{result.category}</span><strong>{result.title}</strong><small>{result.description}</small></button>)}
          </div>}
        </div>}
        {user && (
          <div className={styles.account}>
            <Link className={styles.notificationLink} to="/notifications" aria-label={`${unreadCount} notificaciones sin leer`}>Avisos{unreadCount > 0 && <span>{unreadCount}</span>}</Link>
            <div className={styles.avatar} aria-hidden="true">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className={styles.accountText}>
              <strong>{user.firstName} {user.lastName}</strong>
              <span>{roleLabels[user.role]}</span>
            </div>
            <Button variant="quiet" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        )}
      </header>

      {menuOpen && <button className={styles.backdrop} aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
      <main id="main-content" className={styles.main} tabIndex={-1}>{children}</main>
    </div>
  );
}
