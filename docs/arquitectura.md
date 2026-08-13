# Arquitectura

## Visión general

La aplicación se organiza por funciones. `src/core` contiene los contratos,
almacenamiento y seguridad compartidos. `src/features` contiene módulos
independientes. `src/components` mantiene los elementos visuales reutilizables
y `src/app` compone el enrutamiento.

```text
app/page.tsx
  -> IntranetApp
     -> AuthProvider
        -> AppRoutes
           -> Feature registry
              -> auth/feature.tsx
              -> users/feature.tsx
```

## Registro modular

`src/core/featureRegistry.ts` utiliza `import.meta.glob` para encontrar cada
`feature.tsx`. Un módulo declara sus rutas, roles permitidos y opciones de
navegación. Esto reduce conflictos cuando varios integrantes trabajan en ramas
distintas.

## Seguridad del prototipo

Las credenciales contienen salt y hash, nunca la contraseña legible. Las rutas
comprueban una sesión vigente y los roles permitidos. El administrador activo
no puede desactivar su propia cuenta.

Estas medidas permiten demostrar el flujo, pero no sustituyen autenticación,
autorización ni persistencia de servidor en producción.
