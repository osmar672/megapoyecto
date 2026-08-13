# Requerimientos verificables

## Requerimientos funcionales

- [x] Registrar `/announcements` mediante `src/features/announcements/feature.tsx`.
- [x] Permitir que `ADMIN` cree, edite, publique, retire y elimine comunicados.
- [x] Permitir que `TEACHER` cree y edite únicamente sus borradores.
- [x] Mostrar a `TEACHER` publicaciones para `ALL` o `TEACHER`.
- [x] Mostrar a `STUDENT_FAMILY` solo publicaciones para `ALL` o
  `STUDENT_FAMILY`.
- [x] Validar título, cuerpo y audiencia antes de guardar.
- [x] Conservar `createdAt`, actualizar `updatedAt` y definir `publishedAt` al
  publicar.
- [x] Incluir búsqueda y filtros permitidos por rol.
- [x] Solicitar confirmación antes de eliminar o retirar una publicación.
- [x] Registrar `/dashboard` mediante `src/features/dashboard/feature.tsx`.
- [x] Calcular métricas administrativas por usuarios, roles, cursos y comunicados.
- [x] Calcular métricas docentes solo sobre cursos asignados.
- [x] Filtrar datos académicos de `STUDENT_FAMILY` por `relatedStudentId`.
- [ ] Verificar en integración que calificaciones y asistencia reales del módulo
  académico cumplen los modelos compartidos.
- [ ] Copiar al `README.md` las credenciales ficticias que existan realmente en la
  base integrada.

## Requerimientos no funcionales

- [x] Utilizar TypeScript sin `any` ni `@ts-ignore` en los archivos de esta entrega.
- [x] Utilizar CSS Modules locales.
- [x] Mantener contenido visible en español y nombres internos en inglés.
- [x] Incluir estados accesibles con `role`, `aria-live` y foco visible.
- [x] Mantener diseño responsive en comunicados y panel.
- [x] Utilizar solo datos ficticios en pruebas y documentación.
- [x] Mantener las claves de almacenamiento obligatorias.
- [x] Incluir pruebas unitarias de permisos y métricas.
- [ ] Ejecutar `npm run lint` en el repositorio integrado.
- [ ] Ejecutar `npm run test` en el repositorio integrado.
- [ ] Ejecutar `npm run build` en el repositorio integrado.
- [ ] Ejecutar `npm run lint:md` en el repositorio integrado.

## Matriz de trazabilidad

| Requisito | Módulo | Rol | Evidencia o prueba |
| --- | --- | --- | --- |
| Visibilidad por audiencia | Comunicados | Todos | `authorization.test.ts` |
| Borradores ocultos | Comunicados | `STUDENT_FAMILY` | `authorization.test.ts` |
| Edición de borrador propio | Comunicados | `TEACHER` | `authorization.test.ts` |
| Publicación con marcas de tiempo | Comunicados | `ADMIN` | `repository.test.ts` |
| Métricas de usuarios y cursos | Panel | `ADMIN` | `metrics.test.ts` |
| Cursos y estudiantes asignados | Panel | `TEACHER` | `metrics.test.ts` |
| Aislamiento por estudiante | Panel | `STUDENT_FAMILY` | `metrics.test.ts` |
| Estado vacío seguro | Panel | Todos | `metrics.test.ts` |
| Integración académica real | Académico/Panel | `STUDENT_FAMILY` | Pendiente de integrar `feature/academic-module` |
| Scripts de calidad | Repositorio completo | Todos | Pendiente de ejecución sobre `main` integrado |

## Criterios de aceptación manual

1. Iniciar sesión con cada rol.
2. Confirmar que la navegación muestra `Inicio` y `Comunicados` según el registro de
   módulos.
3. Crear un borrador como Docente y comprobar que otro Docente no puede editarlo.
4. Publicar como Administración y comprobar la audiencia con los otros roles.
5. Verificar que un perfil `STUDENT_FAMILY` solo presenta datos de su
   `relatedStudentId`.
6. Recargar la página y confirmar que los comunicados persisten.
7. Navegar con teclado y confirmar que los controles muestran foco visible.

---

> Las casillas pendientes se mantienen abiertas porque requieren el repositorio base o
> el módulo académico integrado. No representan resultados de pruebas ejecutadas.
