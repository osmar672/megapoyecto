# Requerimientos

## Funcionales implementados

- Acceso con perfiles `ADMIN`, `TEACHER` y `STUDENT_FAMILY`.
- Migración automática de credenciales incompatibles del prototipo anterior.
- Expiración de sesión, cierre manual y protección de rutas por rol.
- Panel con métricas calculadas desde los datos autorizados para cada perfil.
- Consulta de cursos, calificaciones y asistencia.
- Registro o actualización de calificaciones y asistencia por Administración y
  docentes autorizados.
- Restricción familiar por `relatedStudentId`.
- Creación y edición de borradores de comunicados.
- Publicación, archivo y eliminación de comunicados por Administración.
- Filtrado de comunicados según estado, audiencia y autoría.
- Registro, edición, desactivación y reactivación de usuarios.

## No funcionales

- Interfaz adaptable a escritorio, tableta y móvil.
- Navegación por teclado, foco visible, etiquetas y regiones de estado.
- TypeScript estricto, pruebas automatizadas y análisis estático.
- Un único punto de entrada y registro modular de funciones.
- Datos ficticios almacenados en el dispositivo para la demostración.

## Restricciones

- No almacenar información real de menores.
- No usar el almacenamiento del navegador como fuente de verdad en producción.
- Mantener las claves `schoolIntranet.v1.*` para compatibilidad.
- Registrar nuevos módulos mediante `src/features/**/feature.tsx`.
