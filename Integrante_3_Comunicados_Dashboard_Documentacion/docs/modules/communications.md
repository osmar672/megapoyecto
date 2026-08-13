# Módulo de comunicados

## Objetivo

El módulo de comunicados implementa `/announcements` sin modificar el enrutador
central. Su responsabilidad es crear, consultar, editar, publicar, retirar y eliminar
comunicados según el rol activo.

## Registro

`src/features/announcements/feature.tsx` registra:

```text
Ruta: /announcements
Navegación: Comunicados
Roles: ADMIN, TEACHER, STUDENT_FAMILY
```

## Estados y audiencias

Estados permitidos:

- `DRAFT`
- `PUBLISHED`

Audiencias permitidas:

- `ALL`
- `ADMIN`
- `TEACHER`
- `STUDENT_FAMILY`

## Permisos

| Acción | `ADMIN` | `TEACHER` | `STUDENT_FAMILY` |
| --- | --- | --- | --- |
| Crear borrador | Sí | Sí | No |
| Editar | Cualquiera | Solo borrador propio | No |
| Publicar | Sí | No | No |
| Retirar publicación | Sí | No | No |
| Eliminar | Sí | No | No |
| Consultar borradores | Todos | Solo propios | No |
| Consultar publicados | Todos | `ALL` o `TEACHER` | `ALL` o `STUDENT_FAMILY` |

## Validaciones

Antes de guardar se valida:

1. Título entre 3 y 120 caracteres después de quitar espacios exteriores.
2. Cuerpo entre 10 y 4000 caracteres.
3. Audiencia incluida en la lista permitida.
4. Permiso de creación o edición según la sesión.

Al editar se conserva `createdAt` y se actualiza `updatedAt`. Al publicar se establece
`publishedAt` con una fecha ISO 8601. Al retirar una publicación se elimina
`publishedAt` y el estado vuelve a `DRAFT`.

## Visibilidad

La función `isAnnouncementVisible` aplica la política antes de que la interfaz reciba
la colección:

- Administración recibe todos los registros.
- Docente recibe sus borradores y publicaciones dirigidas a `ALL` o `TEACHER`.
- Estudiante/Familia recibe únicamente publicaciones dirigidas a `ALL` o
  `STUDENT_FAMILY`.

La búsqueda y los filtros se aplican después de esta restricción, por lo que un filtro
no puede revelar un registro que el rol no recibió.

## Estados accesibles

La interfaz distingue:

- Cargando.
- Sin resultados.
- Operación exitosa.
- Error.

Los mensajes usan `role="status"` o `role="alert"` con `aria-live`. Las acciones se
implementan como botones reales, los formularios utilizan etiquetas y el CSS mantiene
foco visible.

## Pruebas incluidas

`src/features/announcements/__tests__/authorization.test.ts` cubre:

- Visibilidad por audiencia.
- Exclusión de borradores para `STUDENT_FAMILY`.
- Bloqueo de edición de un borrador ajeno para Docente.

`src/features/announcements/__tests__/repository.test.ts` cubre:

- Creación de un borrador.
- Publicación con `publishedAt`.
- Conservación de `createdAt`.

## Prueba manual recomendada

```text
1. Crear un borrador como TEACHER.
2. Cambiar a otro TEACHER y comprobar que no puede editarlo.
3. Cambiar a ADMIN y publicar el comunicado.
4. Cambiar a STUDENT_FAMILY y verificar la audiencia.
5. Volver a ADMIN y retirar la publicación con confirmación.
```

---

> La validación final de scripts de calidad debe realizarse dentro del repositorio base,
> donde existen `package.json`, el registro real de módulos y la configuración de
> pruebas.
