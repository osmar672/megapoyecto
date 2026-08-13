"use client";

import { useMemo, useState } from "react";
import type { User, UserRole } from "../../../core/types/domain";
import { roleLabels } from "../../../core/utils/roleLabels";
import { Button } from "../../../components/ui/Button";
import { FormField, SelectField } from "../../../components/ui/FormField";
import { useAuth } from "../../auth/context/AuthContext";
import { UserFormModal } from "../components/UserFormModal";
import { userRepository } from "../services/userRepository";
import styles from "./UsersPage.module.css";

type RoleFilter = "ALL" | UserRole;
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function UsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => userRepository.list());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [pendingDeactivate, setPendingDeactivate] = useState<User | undefined>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((candidate) => {
      const matchesQuery =
        !query ||
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "ALL" || candidate.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? candidate.isActive : !candidate.isActive);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const refresh = () => {
    setUsers(userRepository.list());
    refreshUser();
  };

  const announceSuccess = (successMessage: string) => {
    refresh();
    setFormOpen(false);
    setEditingUser(undefined);
    setMessage(successMessage);
    setError("");
  };

  const confirmDeactivate = () => {
    if (!pendingDeactivate || !currentUser) return;
    try {
      userRepository.deactivate(pendingDeactivate.id, currentUser.id);
      refresh();
      setMessage(`La cuenta de ${pendingDeactivate.firstName} ${pendingDeactivate.lastName} fue desactivada.`);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No fue posible desactivar la cuenta.");
    } finally {
      setPendingDeactivate(undefined);
    }
  };

  const handleReactivate = (targetUser: User) => {
    userRepository.reactivate(targetUser.id);
    refresh();
    setMessage(`La cuenta de ${targetUser.firstName} ${targetUser.lastName} fue reactivada.`);
    setError("");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div><p>Administración de accesos</p><h1>Usuarios</h1><span>Gestiona las cuentas y permisos institucionales desde un único lugar.</span></div>
        <Button onClick={() => { setEditingUser(undefined); setFormOpen(true); }}>Registrar usuario</Button>
      </header>

      <section className={styles.summary} aria-label="Resumen de usuarios">
        <article><span>Total de registros</span><strong>{users.length}</strong></article>
        <article><span>Cuentas activas</span><strong>{users.filter((candidate) => candidate.isActive).length}</strong></article>
        <article><span>Cuentas inactivas</span><strong>{users.filter((candidate) => !candidate.isActive).length}</strong></article>
      </section>

      <div className={styles.liveRegion} aria-live="polite">{message}</div>
      {error && <div className={styles.errorBanner} role="alert">{error}</div>}

      <section className={styles.tablePanel} aria-labelledby="user-list-title">
        <div className={styles.filters}>
          <FormField id="userSearch" label="Buscar" type="search" placeholder="Nombre o correo institucional" value={search} onChange={(event) => setSearch(event.target.value)} />
          <SelectField id="roleFilter" label="Rol" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}>
            <option value="ALL">Todos los roles</option>
            {(Object.keys(roleLabels) as UserRole[]).map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
          </SelectField>
          <SelectField id="statusFilter" label="Estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
            <option value="ALL">Todos los estados</option><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option>
          </SelectField>
        </div>

        <div className={styles.listHeader}><h2 id="user-list-title">Directorio institucional</h2><span>{filteredUsers.length} {filteredUsers.length === 1 ? "resultado" : "resultados"}</span></div>
        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}><strong>No hay usuarios que coincidan</strong><p>Modifica la búsqueda o los filtros para consultar otros registros.</p><Button variant="secondary" onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}>Limpiar filtros</Button></div>
        ) : (
          <div className={styles.tableScroll}>
            <table>
              <thead><tr><th scope="col">Usuario</th><th scope="col">Rol</th><th scope="col">Estado</th><th scope="col">Actualización</th><th scope="col"><span className={styles.srOnly}>Acciones</span></th></tr></thead>
              <tbody>
                {filteredUsers.map((candidate) => (
                  <tr key={candidate.id}>
                    <td><div className={styles.identity}><span aria-hidden="true">{candidate.firstName[0]}{candidate.lastName[0]}</span><div><strong>{candidate.firstName} {candidate.lastName}</strong><small>{candidate.email}</small></div></div></td>
                    <td><span className={styles.role}>{roleLabels[candidate.role]}</span></td>
                    <td><span className={`${styles.status} ${candidate.isActive ? styles.active : styles.inactive}`}>{candidate.isActive ? "Activo" : "Inactivo"}</span></td>
                    <td><time dateTime={candidate.updatedAt}>{new Intl.DateTimeFormat("es-CR", { dateStyle: "medium" }).format(new Date(candidate.updatedAt))}</time></td>
                    <td><div className={styles.actions}><Button variant="secondary" onClick={() => { setEditingUser(candidate); setFormOpen(true); }}>Editar</Button>{candidate.isActive ? <Button variant="danger" disabled={candidate.id === currentUser?.id} title={candidate.id === currentUser?.id ? "No puedes desactivar tu sesión actual" : undefined} onClick={() => setPendingDeactivate(candidate)}>Desactivar</Button> : <Button variant="secondary" onClick={() => handleReactivate(candidate)}>Reactivar</Button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formOpen && <UserFormModal user={editingUser} onClose={() => { setFormOpen(false); setEditingUser(undefined); }} onSaved={announceSuccess} />}
      {pendingDeactivate && (
        <div className={styles.confirmBackdrop} role="presentation">
          <section className={styles.confirm} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
            <p>Confirmación requerida</p><h2 id="confirm-title">Desactivar esta cuenta</h2><span id="confirm-description">{pendingDeactivate.firstName} {pendingDeactivate.lastName} no podrá ingresar hasta que un administrador reactive su acceso.</span>
            <div><Button variant="secondary" onClick={() => setPendingDeactivate(undefined)}>Cancelar</Button><Button variant="danger" onClick={confirmDeactivate}>Confirmar desactivación</Button></div>
          </section>
        </div>
      )}
    </div>
  );
}
