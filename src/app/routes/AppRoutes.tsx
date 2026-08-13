"use client";

import { Route, Routes } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { registeredRoutes } from "../../core/featureRegistry";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { NotFoundPage } from "../../features/auth/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      {registeredRoutes.map((route) => {
        const Component = route.component;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isPublic ? (
                <Component />
              ) : (
                <ProtectedRoute allowedRoles={route.allowedRoles}>
                  <AppShell>
                    <Component />
                  </AppShell>
                </ProtectedRoute>
              )
            }
          />
        );
      })}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
