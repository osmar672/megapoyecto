"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { registeredNavigation } from "../../core/featureRegistry";
import { useUnreadNotificationCount } from "../../core/notifications/useUnreadNotificationCount";
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
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const deferredQuery = useDeferredValue(query);
  const navigation = useMemo(
    () =>
      registeredNavigation.filter((item) =>
        user ? item.allowedRoles.includes(user.role) : false,
      ),
    [user],
  );
  const searchResults = useMemo(
    () =>
      user
        ? searchProviderRegistry
            .search(deferredQuery, {
              userId: user.id,
              role: user.role,
              relatedStudentId: user.relatedStudentId,
            })
            .slice(0, 8)
        : [],
    [deferredQuery, user],
  );
  const unreadCount = useUnreadNotificationCount(user?.id);
  const searchOpen = Boolean(query.trim());

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeMenuOnEscape);
    return () => document.removeEventListener("keydown", closeMenuOnEscape);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navigateToSearchResult = (path: string) => {
    setQuery("");
    setActiveSearchIndex(-1);
    navigate(path);
  };

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setQuery("");
      setActiveSearchIndex(-1);
      return;
    }
    if (searchResults.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSearchIndex((current) => (current + 1) % searchResults.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSearchIndex((current) =>
        current <= 0 ? searchResults.length - 1 : current - 1,
      );
    }
    if (event.key === "Enter" && activeSearchIndex >= 0) {
      event.preventDefault();
      const result = searchResults[activeSearchIndex];
      if (result) navigateToSearchResult(result.path);
    }
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
          <input
            id="global-search"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={searchOpen}
            aria-controls="global-search-results"
            aria-activedescendant={
              activeSearchIndex >= 0 ? `global-search-result-${activeSearchIndex}` : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveSearchIndex(-1);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Personas, lugares, eventos..."
            autoComplete="off"
          />
          {searchOpen && <div id="global-search-results" className={styles.searchResults} role="listbox" aria-label="Resultados de búsqueda">
            {searchResults.length === 0 ? <p role="status">No hay resultados.</p> : searchResults.map((result, index) => <button id={`global-search-result-${index}`} key={`${result.source}-${result.id}`} type="button" role="option" aria-selected={activeSearchIndex === index} onMouseEnter={() => setActiveSearchIndex(index)} onClick={() => navigateToSearchResult(result.path)}><span>{result.category}</span><strong>{result.title}</strong><small>{result.description}</small></button>)}
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
