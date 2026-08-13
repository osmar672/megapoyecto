"use client";

import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registeredNavigation } from "../../core/featureRegistry";
import { roleLabels } from "../../core/utils/roleLabels";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Button } from "../ui/Button";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = registeredNavigation.filter((item) =>
    user ? item.allowedRoles.includes(user.role) : false,
  );

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
        {user && (
          <div className={styles.account}>
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
