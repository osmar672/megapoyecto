# Instrucciones para agentes

## Contrato del proyecto

- Mantener los roles `ADMIN`, `TEACHER`, `STUDENT_FAMILY` y `STAFF`.
- No cambiar las claves `schoolIntranet.v1.*`.
- Registrar módulos mediante `src/features/**/feature.tsx`.
- Registrar proveedores de búsqueda mediante `src/features/**/searchProvider.ts`.
- Registrar widgets del panel mediante `src/features/**/dashboardWidget.tsx`.
- No agregar rutas directamente al componente `AppRoutes`.
- Usar identificadores de tipo `string` y fechas ISO 8601.
- Mantener nombres internos en inglés y la interfaz en español.
- No usar datos reales de estudiantes o familias.

## Límites de integración

- El módulo académico debe permanecer bajo `src/features/academics`.
- El módulo de comunicados debe permanecer bajo `src/features/announcements`.
- Reutilizar `localStorageService`, `storageKeys` y los tipos de `src/core`.
- Ejecutar `npm run check` antes de solicitar integración.
- No incluir archivos generados ni desactivar reglas de calidad.
