# Intranet Escolar

Aplicación unificada de intranet escolar construida con React, TypeScript, Vinext
y React Router. Incluye autenticación por roles, panel principal, seguimiento
académico, comunicados y administración de usuarios.

## Requisitos

- Node.js 22.13 o superior.
- npm 10 o superior.
- Git.

## Instalación

Desde la terminal de Visual Studio Code, en la carpeta del proyecto:

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite. No abras un archivo HTML con Live
Server: la entrada correcta es la aplicación que inicia `npm run dev`.

## Accesos de demostración

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Administración | `admin@colegiohorizonte.edu.cr` | `Admin2026!` |
| Docente | `docente@colegiohorizonte.edu.cr` | `Docente2026!` |
| Estudiante/Familia | `familia@colegiohorizonte.edu.cr` | `Familia2026!` |

Si el navegador conserva datos del prototipo anterior, la aplicación migra las
cuentas antiguas automáticamente al iniciar.

## Qué ve cada perfil

- `ADMIN`: panel institucional, datos académicos de todos los cursos,
  comunicados y gestión de usuarios.
- `TEACHER`: sus cursos y estudiantes, registro de calificaciones y asistencia,
  además de creación de borradores de comunicados.
- `STUDENT_FAMILY`: únicamente las calificaciones y la asistencia del estudiante
  vinculado, más los comunicados publicados para su audiencia.

Solo Administración puede publicar, archivar o eliminar comunicados.

## Estructura principal

```text
src/
├── app/                    # Composición y rutas
├── components/             # Interfaz reutilizable
├── core/                   # Tipos, seguridad y almacenamiento
└── features/
    ├── academics/          # Calificaciones y asistencia
    ├── announcements/      # Comunicados
    ├── auth/               # Acceso y panel principal
    └── users/              # Administración de cuentas
```

Cada módulo registra sus rutas y su navegación mediante `feature.tsx`; no se
agregan rutas manualmente al enrutador central.

## Verificación antes de subir a GitHub

```bash
npm run check
npm run validate:artifact
```

Los datos son ficticios y se guardan en el navegador para fines de demostración.
No utilices información real de estudiantes o familias. Para producción se debe
usar autenticación y almacenamiento del lado del servidor.
