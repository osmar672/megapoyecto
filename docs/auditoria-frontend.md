# Auditoría frontend

Fecha: 2026-08-17

## Resumen

La aplicación es una intranet escolar modular para cuatro roles (`ADMIN`,
`TEACHER`, `STUDENT_FAMILY` y `STAFF`). Reúne gestión académica, comunicaciones,
horarios, operaciones del campus y comunidad. La implementación es adecuada como
prototipo local con datos ficticios; la autenticación y los datos sensibles aún
deben migrarse a servicios de servidor antes de un uso productivo.

## Stack y arquitectura encontrados

| Área | Implementación |
| --- | --- |
| Gestor de paquetes | npm con `package-lock.json` y versiones exactas |
| Runtime | Node.js 22.13 o superior |
| Build | Vite 8, Vinext y Cloudflare Worker |
| UI | React 19, CSS Modules y tokens CSS globales |
| Routing | React Router dentro de App Router |
| Estado | Context de autenticación, estado local, event bus y almacenamiento web |
| Datos | Repositorios por función sobre `localStorage`; sesión en `sessionStorage` |
| Testing | Vitest, jsdom y Testing Library |
| Calidad | ESLint, TypeScript estricto y markdownlint |

Los módulos de negocio se registran automáticamente mediante archivos
`feature.tsx`; la búsqueda y los widgets usan registros equivalentes. Esta
decisión evita concentrar rutas y extensiones en componentes centrales.

## Hallazgos priorizados

### Críticos

| Hallazgo | Estado |
| --- | --- |
| `STAFF` podía escribir calificaciones y asistencia | Corregido |
| Horarios sin control completo de propiedad y campos modificables | Corregido |
| Búsqueda de horarios podía revelar registros de otro estudiante | Corregido |
| 26 alertas de dependencias, incluida una crítica | Corregido; `npm audit` informa 0 alertas |
| Autenticación y datos escolares sólo en el navegador | Pendiente de arquitectura de servidor |

### Importantes

| Hallazgo | Estado |
| --- | --- |
| Contador de avisos desactualizado al marcar como leído | Corregido con suscripción externa |
| Inicialización de autenticación podía quedar cargando indefinidamente | Corregido |
| Alta de usuario podía dejar una cuenta sin credencial | Corregido con operación y reversión atómicas |
| Cuenta familiar aceptaba un estudiante inexistente | Corregido |
| Métricas de `STAFF` reutilizaban indicadores familiares | Corregido |
| Widgets mostraban eventos o clases ya pasados | Corregido |
| Colecciones persistidas con forma inválida rompían repositorios | Recuperación básica añadida |
| Evidencias de incidencias guardaban sólo metadatos | Contenido validado y persistido |
| Modal sin cierre por Escape, trampa o devolución de foco | Corregido y probado |
| Búsqueda global sin interacción completa por teclado y oculta en móvil | Corregido |
| Lecturas repetidas de rutas y lógica de simulación dentro de la UI | Memoización y hook añadidos |

### Opcionales

- Aumentar pruebas de interacción por página y pruebas de accesibilidad
  automatizadas.
- Dividir gradualmente las páginas extensas restantes en formularios, listas y
  tarjetas de presentación.
- Incorporar validadores de dominio completos para cada elemento recuperado del
  almacenamiento, además de la validación actual de la colección y la sesión.
- Reemplazar textos técnicos de estados internos por etiquetas localizadas en
  todos los módulos.

## Limpieza aplicada

- Se retiró el prototipo HTML/CSS/JS estático que no formaba parte del build.
- Se eliminaron tres SVG iniciales sin referencias y un archivo vacío.
- Los prompts históricos se conservaron en `docs/archive/prompts/`.
- Se retiraron Tailwind y su plugin PostCSS porque la aplicación usa únicamente
  CSS Modules y no contenía directivas ni clases Tailwind.
- La prueba aislada de HTML renderizado ahora se ejecuta dentro del build.

No se sustituyó el bundler, el sistema de estado, las claves de almacenamiento
ni el registro modular.

## Estructura recomendada

La estructura actual ya sigue una variante por funcionalidades, más escalable
que una separación global de todos los componentes:

```text
src/
├── app/                 # composición y rutas
├── components/          # UI y layout compartidos
├── core/                # tipos, eventos, registros, seguridad y almacenamiento
├── features/
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── styles/              # tokens globales
└── test/                # pruebas automatizadas
```

Los tipos transversales permanecen en `core/types`; los tipos exclusivos de una
función deben vivir junto a esa función. No conviene migrar a carpetas globales
de páginas o servicios porque perdería cohesión modular.

## Dependencias

No se agregó ninguna librería de UI, iconos, audio o animación: el sistema visual
actual no la necesita y añadirla aumentaría el bundle sin resolver un problema
concreto. Se actualizaron React, Next, Vite, Vitest, Cloudflare y sus paquetes
relacionados, además de los parches de Testing Library. Vinext migró de `0.0.50`
a `1.0.0-beta.6`; su verificador oficial informa 100% de compatibilidad.

Se decidió mantener D1 y Drizzle. Para retirar la versión vulnerable de esbuild
heredada por `drizzle-kit`, se fijó un override conservador a `0.25.12`, versión
que Drizzle ya utiliza directamente. `drizzle-kit check` y el pipeline completo
validaron la compatibilidad. Tanto `npm audit` como `npm audit --omit=dev`
informan cero vulnerabilidades.

## Verificación

El comando canónico es `npm run check`. Ejecuta lint, TypeScript, la suite de
Vitest, el scanner de compatibilidad de Vinext, el build de producción, la
comprobación del Worker/HTML y markdownlint.
