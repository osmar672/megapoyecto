# Historial de cambios

## En desarrollo - 2026-08-17

### Agregado

- Módulos integrados de cronograma, mapa, emergencias, transporte, cafetería,
  horarios, estadísticas, logros, foro, incidencias y notificaciones.
- Búsqueda global y widgets del panel descubiertos automáticamente.
- Datos semilla idempotentes y cobertura de pruebas para los nuevos módulos.
- Verificación de tipos dentro del chequeo completo del proyecto.

### Corregido

- Creación de notificaciones al publicar comunicados según su audiencia.
- Permisos y navegación por rol para las nuevas rutas.
- Cálculo de las horas de parada de las rutas de transporte.
- Permisos de ejecución de los scripts utilizados por el entorno de build.

### Eliminado

- Copias independientes y no integradas del frontend que duplicaban módulos,
  rompían el lint del repositorio y no formaban parte del despliegue principal.

## 0.1.0 - 2026-08-13

### Agregado

- Base modular con descubrimiento automático de funciones.
- Autenticación para administración, docentes y familias.
- Sesión temporal, protección de rutas y control por roles.
- Panel institucional adaptable al perfil.
- Administración de usuarios con búsqueda, filtros, alta, edición, baja lógica
  y reactivación.
- Persistencia local segura ante JSON inválido.
- Pruebas automatizadas y documentación del proyecto.
