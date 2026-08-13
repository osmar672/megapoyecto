# Requerimientos

## Funcionales implementados

- Acceso con perfiles `ADMIN`, `TEACHER` y `STUDENT_FAMILY`.
- Expiración de sesión y cierre manual.
- Redirección a acceso o página 403 según corresponda.
- Panel de inicio con información restringida por perfil.
- Lista accesible de usuarios para administración.
- Búsqueda por nombre o correo y filtros de rol y estado.
- Registro, edición, desactivación y reactivación de usuarios.
- Validación de correo institucional único.
- Datos ficticios e inicialización idempotente.

## Preparados para módulos posteriores

- Modelos de estudiantes, cursos, matrículas, calificaciones, asistencia y
  comunicados.
- Rutas reservadas en el contrato del proyecto para módulos académicos y de
  comunicaciones.
- Registro automático de nuevos módulos sin modificar el enrutador central.

## No funcionales

- Interfaz adaptable a escritorio, tableta y móvil.
- Navegación por teclado, foco visible, etiquetas y regiones de estado.
- TypeScript estricto, pruebas automatizadas y lint.
- Datos almacenados en el dispositivo solo para fines demostrativos.
