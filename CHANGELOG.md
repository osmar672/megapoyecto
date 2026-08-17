# Historial de cambios

## En desarrollo - 2026-08-17

### Agregado

- Módulos integrados de cronograma, mapa, emergencias, transporte, cafetería,
  horarios, estadísticas, logros, foro, incidencias y notificaciones.
- Búsqueda global y widgets del panel descubiertos automáticamente.
- Datos semilla idempotentes y cobertura de pruebas para los nuevos módulos.
- Verificación de tipos dentro del chequeo completo del proyecto.
- Pruebas de componentes para autenticación, notificaciones y foco del modal.
- Validación del HTML renderizado como parte obligatoria del build.
- Verificación oficial de compatibilidad de Vinext dentro de `npm run check`.

### Corregido

- Creación de notificaciones al publicar comunicados según su audiencia.
- Permisos y navegación por rol para las nuevas rutas.
- Cálculo de las horas de parada de las rutas de transporte.
- Permisos de ejecución de los scripts utilizados por el entorno de build.
- Autorización académica y privacidad de horarios para cada rol.
- Sincronización del contador de notificaciones y salida segura de la carga inicial.
- Alta atómica de usuarios y validación del estudiante vinculado.
- Cálculo de próximos eventos, métricas de personal y persistencia de evidencias.
- Navegación por teclado, foco visible, reducción de movimiento y búsqueda móvil.
- Migración a Vinext 1.0 beta con compatibilidad completa y audit de npm limpio.

### Eliminado

- Copias independientes y no integradas del frontend que duplicaban módulos,
  rompían el lint del repositorio y no formaban parte del despliegue principal.
- Configuración y dependencias de Tailwind/PostCSS que no participaban en los estilos.
- Recursos iniciales de Vite sin referencias y un archivo de texto vacío.
- Carga externa de Google Fonts; la interfaz utiliza la pila tipográfica del sistema.

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
