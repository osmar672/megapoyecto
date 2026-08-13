# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo. El formato
se inspira en **Keep a Changelog** y el versionado puede adaptarse al calendario del
curso.

## Unreleased

### Added

- Módulo `/announcements` registrado mediante `feature.tsx`.
- Creación y edición de borradores con validación de título, cuerpo y audiencia.
- Publicación, retiro y eliminación con controles de autorización.
- Búsqueda y filtros de comunicados según el rol.
- Estados accesibles de carga, vacío, éxito y error.
- Módulo `/dashboard` con métricas específicas por rol.
- Pruebas de autorización, publicación, métricas y aislamiento de datos académicos.
- Documentación de arquitectura, requerimientos y funcionamiento de comunicados.
- Recurso SVG documental en `docs/assets/module-overview.svg`.

### Changed

- Documentación principal alineada con React, TypeScript, Vite y el contrato de
  integración actual.

### Security

- El panel de `STUDENT_FAMILY` filtra calificaciones y asistencia por
  `relatedStudentId`.
- Los borradores quedan fuera de la vista de estudiantes y familias.
- Los docentes no pueden editar borradores de otro autor.

## 0.1.0 - 2026-08-13

### Added

- Estructura inicial de la entrega de comunicados, panel y documentación para la rama
  `feature/communications-docs`.

---

[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) sirve como referencia de
estructura; este archivo solo registra cambios presentes en esta entrega.
