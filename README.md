# Intranet Escolar

Intranet escolar construida con React y TypeScript, con autenticación por roles, calificaciones, asistencia, comunicados y gestión de usuarios.

## Tecnologías del prototipo

- React y TypeScript
- Vite/Vinext
- React Router
- CSS Modules
- Vitest
- `localStorage` y `sessionStorage`

## Accesos de prueba

- Administración: `admin@colegiohorizonte.edu.cr` / `Admin2026!`
- Docente: `docente@colegiohorizonte.edu.cr` / `Docente2026!`
- Estudiante/Familia: `familia@colegiohorizonte.edu.cr` / `Familia2026!`
- Personal administrativo: `personal@colegiohorizonte.edu.cr` / `Personal2026!`

## Roles

- `ADMIN`: administración completa del prototipo.
- `TEACHER`: acceso académico limitado a sus cursos.
- `STUDENT_FAMILY`: consulta únicamente la información del estudiante relacionado.
- `STAFF`: acceso a herramientas y comunicaciones del personal administrativo.

## Claves de almacenamiento

Todas las colecciones persistentes usan el prefijo `schoolIntranet.v1` y están centralizadas en `src/core/storage/storageKeys.ts`.

## Ejecución

```bash
npm install
npm run dev
```

Antes de integrar cambios:

```bash
npm run check
```

> Los datos son ficticios y están destinados únicamente al prototipo. No se deben almacenar datos reales de menores.
