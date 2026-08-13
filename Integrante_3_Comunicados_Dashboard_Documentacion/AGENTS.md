# Memoria del proyecto para agentes

## Contexto

La intranet escolar es un prototipo académico construido con React, TypeScript y Vite.
El trabajo se divide en tres ramas principales para evitar conflictos. Esta rama,
`feature/communications-docs`, es propietaria de comunicados, panel principal y la
documentación indicada por el proyecto.

## Requerimientos

- Registrar `/announcements` y `/dashboard` mediante archivos `feature.tsx`.
- Respetar `ADMIN`, `TEACHER` y `STUDENT_FAMILY` sin redefinir roles.
- Persistir comunicados en `schoolIntranet.v1.announcements`.
- Leer la sesión desde `schoolIntranet.v1.session` en `sessionStorage`.
- Mantener calificaciones y asistencia restringidas por `relatedStudentId`.
- Usar CSS Modules locales y los tokens visuales de la base.
- Mantener documentación coherente con el código real.

## Reglas

- Nombres internos en inglés y contenido visible en español.
- Identificadores nuevos mediante `crypto.randomUUID()`.
- Fechas en ISO 8601.
- Los borradores solo son visibles para Administración y para su Docente autor.
- Solo Administración publica, retira o elimina comunicados.
- Las métricas se calculan desde datos compartidos y no se persisten duplicadas.
- No se marcan como ejecutadas verificaciones que no se hayan ejecutado realmente.

## Restricciones

- No modificar `package.json`, `src/app/**`, `src/core/**`, autenticación, usuarios,
  módulo académico ni estilos globales desde esta rama.
- No utilizar `any`, `@ts-ignore`, datos reales, secretos ni información personal
  innecesaria.
- No crear roles, rutas, modelos o claves alternativas.
- No hacer push directo ni force push a `main`.
- No editar archivos propiedad de otro integrante para resolver un problema local.
- No afirmar que una prueba o comando pasó sin haberlo ejecutado en el repositorio
  correspondiente.

## Objetivos

1. Proporcionar un tablón de comunicados con autorización por rol y audiencia.
2. Mostrar un panel útil sin revelar información de otros estudiantes.
3. Mantener componentes accesibles, responsive y con estados claros.
4. Facilitar integración mediante módulos auto-registrados.
5. Mantener documentación profesional y verificable.

## Memoria del proyecto

Los comunicados separan autorización, validación, repositorio, componentes y página.
El repositorio conserva `createdAt`, actualiza `updatedAt` y establece `publishedAt`
al publicar. El panel usa `buildDashboardMetrics`, una función pura que recibe un
usuario y colecciones compartidas. Para `STUDENT_FAMILY`, las calificaciones y la
asistencia se filtran exclusivamente por `relatedStudentId` antes de calcular el
resumen. La entrega aislada no contiene el repositorio base, por lo que los scripts de
npm y la firma exacta del servicio central de almacenamiento deben validarse durante la
integración.

## Buenas prácticas

- Mantener funciones pequeñas y comprobables.
- Validar permisos antes de escribir en almacenamiento.
- Usar pruebas para reglas de negocio sensibles.
- Preservar campos que pertenecen a modelos compartidos.
- Mantener foco visible y mensajes con semántica accesible.
- Revisar enlaces, rutas y nombres de archivos antes del pull request.
- Actualizar la matriz de requerimientos después de integrar el módulo académico.
