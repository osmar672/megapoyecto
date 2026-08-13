# Intranet Escolar

Prototipo funcional de una intranet escolar para una institución pública. La
aplicación ofrece autenticación por roles, sesiones con expiración,
administración accesible de usuarios y una base modular para incorporar los
módulos académicos y de comunicados.

## Tecnologías

- React 19, TypeScript y Vite mediante Vinext.
- React Router para navegación y protección de rutas.
- CSS Modules y tokens globales de diseño.
- Vitest, Testing Library, ESLint y markdownlint.
- `localStorage` para datos del prototipo y `sessionStorage` para la sesión.

## Ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en la dirección indicada por la terminal.

## Cuentas de demostración

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Administración | `admin@colegiohorizonte.edu.cr` | `Admin2026!` |
| Docente | `docente@colegiohorizonte.edu.cr` | `Docente2026!` |
| Estudiante y familia | `familia@colegiohorizonte.edu.cr` | `Familia2026!` |

Los datos son ficticios. Las contraseñas se almacenan como hash con salt. Este
mecanismo del navegador es exclusivamente demostrativo: una aplicación en
producción debe autenticar en servidor y utilizar un algoritmo especializado
para contraseñas.

## Verificación

```bash
npm run lint
npm run test
npm run build
npm run lint:md
npm run check
```

## Estructura modular

Cada módulo crea un archivo `src/features/**/feature.tsx`. El registro de
funciones lo detecta automáticamente y agrega sus rutas y navegación sin
modificar el enrutador central.

## Persistencia

Los datos se conservan en el navegador del dispositivo. Para restaurar la
demostración se pueden eliminar las claves que comienzan con
`schoolIntranet.v1` desde las herramientas del navegador. La inicialización es
idempotente y no reemplaza información existente.
