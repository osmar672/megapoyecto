# Architecture

La aplicación usa una arquitectura feature-first. Cada módulo contiene su pantalla, datos demo, servicio de dominio, integración de búsqueda y pruebas. `core` solo contiene contratos y servicios realmente compartidos.

## Reglas
- Las páginas no acceden directamente a LocalStorage.
- Las reglas de negocio viven en `services`.
- Las features declaran navegación, rutas, búsqueda y widgets.
- Los tests verifican reglas de negocio y contratos de integración.
- No se usan emojis como iconografía de interfaz; los iconos son SVG propios.
