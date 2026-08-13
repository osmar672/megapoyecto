# Arquitectura

## Visión general

La intranet utiliza una sola aplicación React. `app/page.tsx` y la ruta dinámica
de Vinext cargan `IntranetApp`, que monta autenticación, enrutamiento y manejo de
errores.

```text
Vinext
└── IntranetApp
    ├── AuthProvider
    ├── AppShell
    └── AppRoutes
        └── featureRegistry
            ├── academics/feature.tsx
            ├── announcements/feature.tsx
            ├── auth/feature.tsx
            └── users/feature.tsx
```

## Registro modular

`src/core/featureRegistry.ts` descubre automáticamente los archivos
`src/features/**/feature.tsx`. Cada módulo declara sus rutas, roles autorizados y
opciones de navegación. Esto permite trabajar en ramas independientes y reduce
los conflictos al integrar cambios.

## Autorización

Las rutas comprueban una sesión vigente y los roles permitidos. Los repositorios
académico y de comunicados vuelven a validar permisos antes de escribir:

- Administración accede a todos los datos del prototipo.
- Docentes solo modifican cursos que tienen asignados.
- Familias solo consultan el estudiante indicado por `relatedStudentId`.
- Solo Administración publica, archiva o elimina comunicados.

## Persistencia del prototipo

Los servicios compartidos usan las claves `schoolIntranet.v1.*` en
`localStorage` y guardan la sesión en `sessionStorage`. La inicialización migra
las credenciales incompatibles del prototipo estático anterior sin borrar los
usuarios adicionales creados por el equipo.

Este almacenamiento es apropiado para una demostración local, no para datos
reales ni para producción. Una versión productiva debe mover cuentas, registros
académicos y comunicados a servicios de servidor.
