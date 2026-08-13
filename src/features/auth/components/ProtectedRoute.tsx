"use client";

import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { AuthSession, UserRole } from "../../../core/types/domain";
import { useAuth } from "../context/AuthContext";
import styles from "./ProtectedRoute.module.css";

export type RouteAccess = "loading" | "login" | "denied" | "allowed";

export function resolveRouteAccess(
  isLoading: boolean,
  session: AuthSession | null,
  allowedRoles: UserRole[],
): RouteAccess {
  if (isLoading) return "loading";
  if (!session) return "login";
  if (!allowedRoles.includes(session.role)) return "denied";
  return "allowed";
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const access = resolveRouteAccess(isLoading, session, allowedRoles);

  if (access === "loading") {
    return (
      <main className={styles.loading} aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <p>Preparando el espacio institucional</p>
      </main>
    );
  }
  if (access === "login") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (access === "denied") {
    return <Navigate to="/403" replace />;
  }
  return children;
}
