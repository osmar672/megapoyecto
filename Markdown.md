# Intranet Escolar — Colegio Horizonte

## Descripción del proyecto

Este proyecto consiste en una aplicación web de tipo intranet escolar desarrollada para centralizar diferentes servicios e información de una institución educativa.

La aplicación permite que diferentes perfiles de usuario ingresen al sistema y tengan acceso únicamente a las funciones correspondientes a su rol.

El sistema incluye módulos académicos, administrativos y comunitarios, además de herramientas como el mapa interactivo del campus, emergencias, cafetería, foro y notificaciones.

Los datos utilizados en el proyecto son ficticios destinados a demostración y pruebas.

---

# Tecnologías utilizadas

El proyecto fue desarrollado utilizando:

- React
- TypeScript
- Vite
- Vinext
- React Router
- CSS Modules
- Vitest
- Drizzle ORM
- JavaScript
- HTML
- CSS

También se utilizan herramientas de desarrollo como:

- ESLint
- TypeScript Compiler
- Testing Library
- JSDOM
- Wrangler

---

# Estructura general del proyecto

La aplicación está organizada de forma modular para facilitar el mantenimiento y la incorporación de nuevas funcionalidades.

```text
megaproyecto/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── [...slug]/
│
├── src/
│   ├── app/
│   │   ├── ErrorBoundary.tsx
│   │   ├── IntranetApp.tsx
│   │   └── routes/
│   │
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── core/
│   │   ├── data/
│   │   ├── events/
│   │   ├── notifications/
│   │   ├── search/
│   │   ├── security/
│   │   ├── storage/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── features/
│       ├── academics/
│       ├── achievements/
│       ├── analytics/
│       ├── announcements/
│       ├── auth/
│       ├── cafeteria/
│       ├── campus-map/
│       ├── emergencies/
│       ├── forum/
│       ├── transportation/
│       ├── users/
│       └── ...
│
├── db/
├── docs/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# Inicio de la aplicación

El punto principal de la aplicación es `IntranetApp.tsx`.

Este componente se encarga de montar las partes principales del sistema:

- Manejo de errores.
- Enrutamiento.
- Autenticación.
- Navegación entre módulos.

La estructura principal funciona de la siguiente manera:

```text
IntranetApp
│
├── ErrorBoundary
│
├── BrowserRouter
│
├── AuthProvider
│
└── AppRoutes
      │
      └── Módulos de la aplicación
```

---

# Sistema de autenticación

La aplicación cuenta con un sistema de inicio de sesión que permite identificar al usuario antes de ingresar a la plataforma.

El usuario debe proporcionar:

- Correo institucional.
- Contraseña.

Una vez comprobadas las credenciales, el sistema determina el rol del usuario y lo dirige al panel correspondiente.

El sistema también controla las rutas protegidas para impedir que un usuario acceda a secciones que no tiene autorizadas.

---

# Roles del sistema

La aplicación utiliza diferentes perfiles.

## Administración

El perfil de administración cuenta con el mayor nivel de acceso.

Puede utilizar funciones relacionadas con:

- Usuarios.
- Información académica.
- Comunicados.
- Estadísticas.
- Administración del sistema.
- Gestión de diferentes módulos.

## Docente

El perfil docente tiene acceso principalmente a las funciones académicas relacionadas con los cursos que tiene asignados.

Puede trabajar con:

- Cursos.
- Calificaciones.
- Asistencia.
- Información académica.
- Comunicados correspondientes.

## Familia / estudiante

Este perfil permite consultar información relacionada con el estudiante asociado.

Su acceso está limitado a la información que corresponde a dicho usuario.

## Personal administrativo

El personal administrativo tiene acceso a herramientas y comunicaciones destinadas a sus funciones dentro de la institución.

---

# Panel principal

Después de iniciar sesión, el usuario accede al dashboard.

El contenido mostrado depende del rol.

El panel puede mostrar:

- Resumen de actividades.
- Notificaciones.
- Comunicados.
- Información académica.
- Accesos rápidos.
- Estadísticas.
- Actividades recientes.

La información se adapta a los permisos del usuario.

---

# Módulo académico

El módulo académico permite gestionar y consultar información relacionada con el proceso educativo.

Entre sus funciones se encuentran:

- Consulta de cursos.
- Calificaciones.
- Asistencia.
- Información de estudiantes.
- Seguimiento académico.

Los docentes y administradores pueden realizar operaciones dependiendo de sus permisos.

---

# Módulo de comunicados

El sistema permite administrar comunicados institucionales.

Las funciones principales incluyen:

- Crear comunicados.
- Editar borradores.
- Publicar comunicados.
- Archivar comunicados.
- Eliminar comunicados.
- Filtrar información.
- Mostrar comunicados según la audiencia.

Los permisos dependen del rol del usuario.

---

# Mapa interactivo del campus

Uno de los módulos principales es el mapa del campus.

El archivo principal del módulo se encuentra en:

```text
src/features/campus-map/pages/CampusMapPage.tsx
```

El mapa permite localizar diferentes lugares dentro del campus.

Entre ellos pueden encontrarse:

- Aulas.
- Biblioteca.
- Laboratorios.
- Cafetería.
- Servicios.
- Otras áreas institucionales.

## Búsqueda del mapa

El usuario puede escribir el nombre de una ubicación en el campo de búsqueda.

Por ejemplo:

```text
Biblioteca
Laboratorio
Soda
```

El sistema filtra las ubicaciones disponibles y muestra las coincidencias.

## Filtro por tipo

Además de la búsqueda, existe un filtro que permite seleccionar el tipo de ubicación.

El usuario puede seleccionar:

```text
Todos
```

o uno de los tipos disponibles.

Esto permite encontrar más fácilmente una ubicación específica.

## Selección de ubicaciones

Cada ubicación del mapa se representa mediante un elemento interactivo.

Cuando el usuario selecciona una ubicación, se actualiza el panel de información.

Se muestra:

- Nombre.
- Tipo.
- Descripción.
- Estado de accesibilidad.
- Posición relativa dentro del mapa.

La posición se maneja mediante coordenadas porcentuales:

```text
X = posición horizontal
Y = posición vertical
```

Esto permite colocar los elementos sobre la representación visual del campus.

---

# Accesibilidad

El proyecto considera diferentes aspectos de accesibilidad.

Entre ellos:

- Navegación mediante teclado.
- Elementos interactivos utilizando botones reales.
- Etiquetas para controles.
- Estados visibles.
- Regiones dinámicas mediante `aria-live`.
- Información textual equivalente para el mapa.

La sección de mapa incluye una descripción textual de las ubicaciones para facilitar el acceso a la información incluso cuando no se utiliza directamente la representación visual.

---

# Cafetería

El proyecto también incluye un módulo de cafetería.

Este módulo permite consultar información relacionada con los servicios y productos disponibles dentro de la institución.

La funcionalidad se encuentra organizada dentro de:

```text
src/features/cafeteria/
```

---

# Emergencias

El módulo de emergencias proporciona acceso a información relacionada con situaciones de emergencia dentro de la institución.

Su estructura se encuentra en:

```text
src/features/emergencies/
```

Este módulo forma parte de las herramientas destinadas a mejorar la comunicación y orientación dentro del campus.

---

# Foro

La aplicación cuenta con un espacio comunitario mediante el módulo de foro.

Su objetivo es permitir la comunicación entre los usuarios de la institución.

La funcionalidad se encuentra dentro de:

```text
src/features/forum/
```

---

# Notificaciones

El sistema incluye un centro de notificaciones.

Las notificaciones permiten informar al usuario sobre diferentes eventos de la aplicación.

El sistema dispone de:

- Servicio de notificaciones.
- Contador de notificaciones no leídas.
- Gestión del estado de lectura.
- Integración con el panel principal.

Los archivos relacionados se encuentran en:

```text
src/core/notifications/
```

---

# Sistema de búsqueda

El proyecto cuenta con un sistema de búsqueda que permite registrar diferentes proveedores de búsqueda.

La estructura se encuentra en:

```text
src/core/search/
```

Cada módulo puede aportar información para que la búsqueda global encuentre contenido de diferentes secciones de la aplicación.

---

# Almacenamiento de datos

Para el prototipo se utiliza almacenamiento del navegador.

Se utilizan principalmente:

```text
localStorage
```

y

```text
sessionStorage
```

Las claves utilizadas por el proyecto se encuentran centralizadas en:

```text
src/core/storage/storageKeys.ts
```

El prefijo utilizado para los datos es:

```text
schoolIntranet.v1
```

Esto permite mantener organizada la información almacenada.

---

# Seguridad y permisos

El sistema implementa controles de acceso según el rol.

Las rutas protegidas verifican que exista una sesión válida y que el usuario tenga los permisos necesarios.

La aplicación diferencia entre:

```text
ADMIN
TEACHER
STUDENT_FAMILY
STAFF
```

Los permisos determinan qué módulos y acciones puede utilizar cada usuario.

---

# Arquitectura modular

El proyecto utiliza una arquitectura basada en funcionalidades.

Cada funcionalidad tiene su propio directorio dentro de:

```text
src/features/
```

Por ejemplo:

```text
src/features/academics/
src/features/cafeteria/
src/features/campus-map/
src/features/emergencies/
src/features/forum/
```

Esto permite separar cada parte del sistema y facilita realizar modificaciones sin afectar innecesariamente otras funcionalidades.

---

# Registro de funcionalidades

Los módulos utilizan archivos llamados:

```text
feature.tsx
```

Estos archivos permiten registrar las funcionalidades correspondientes.

El registro principal se encuentra en:

```text
src/core/featureRegistry.ts
```

Gracias a esta organización, los módulos pueden definir sus propias:

- Rutas.
- Permisos.
- Opciones de navegación.
- Configuraciones.

---

# Manejo de errores

La aplicación utiliza un componente denominado:

```text
ErrorBoundary
```

Este componente permite capturar errores inesperados que puedan producirse durante la ejecución de componentes React.

La finalidad es evitar que un error en una sección provoque una experiencia completamente rota para el usuario.

---

# Diseño de interfaz

La interfaz utiliza CSS Modules para mantener los estilos separados por componente o funcionalidad.

Los estilos se encuentran junto a los componentes correspondientes.

Por ejemplo:

```text
LoginPage.tsx
LoginPage.module.css
```

Esto permite evitar conflictos entre estilos de diferentes partes de la aplicación.

---

# Componentes reutilizables

El proyecto dispone de componentes reutilizables dentro de:

```text
src/components/ui/
```

Entre ellos se encuentran componentes como:

- `Button`
- `FormField`

Estos componentes permiten mantener una apariencia consistente en diferentes páginas.

---

# Validación de datos

El proyecto utiliza TypeScript para definir los tipos de información utilizados por la aplicación.

Los tipos principales se encuentran en:

```text
src/core/types/
```

Esto permite detectar errores durante el desarrollo y mantener una estructura de datos más controlada.

---

# Pruebas

El proyecto utiliza Vitest para ejecutar pruebas automatizadas.

El comando principal es:

```bash
npm run test
```

También se puede ejecutar:

```bash
npm run typecheck
```

para comprobar los tipos de TypeScript.

---

# Instalación

Para instalar las dependencias del proyecto primero se debe tener Node.js instalado.

Se recomienda utilizar una versión compatible con:

```text
Node.js >= 22.13.0
```

Después se debe abrir una terminal dentro de la carpeta del proyecto.

Ejecutar:

```bash
npm install
```

---

# Ejecutar el proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Después se debe abrir la dirección que indique Vite en la terminal.

Normalmente será una dirección similar a:

```text
http://localhost:5173
```

---

# Construcción del proyecto

Para crear la versión de producción:

```bash
npm run build
```

También existe un comando general de comprobación:

```bash
npm run check
```

Este comando permite realizar diferentes validaciones del proyecto.

---

# Comandos principales

| Comando | Función |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run start` | Inicia la aplicación construida |
| `npm run test` | Ejecuta las pruebas |
| `npm run typecheck` | Comprueba los tipos de TypeScript |
| `npm run lint` | Analiza el código |
| `npm run lint:md` | Analiza los archivos Markdown |
| `npm run check` | Ejecuta las comprobaciones generales |

---

# Datos de demostración

El proyecto utiliza información ficticia para permitir probar las diferentes funciones.

Los accesos de demostración disponibles son:

| Perfil | Usuario |
|---|---|
| Administración | `admin@colegiohorizonte.edu.cr` |
| Docente | `docente@colegiohorizonte.edu.cr` |
| Familia | `familia@colegiohorizonte.edu.cr` |
| Personal | `personal@colegiohorizonte.edu.cr` |

Las contraseñas de demostración se encuentran configuradas en el proyecto.

Estos datos únicamente deben utilizarse para realizar pruebas locales.

---

# Consideraciones de seguridad

Este proyecto funciona como un prototipo.

El almacenamiento mediante `localStorage` y `sessionStorage` es apropiado para una demostración local, pero no debe utilizarse como fuente principal de datos en un sistema real.

Para una versión de producción sería necesario implementar:

- Base de datos en servidor.
- Autenticación segura.
- Gestión de sesiones en servidor.
- Contraseñas almacenadas mediante hash seguro.
- Control de acceso en backend.
- Protección de información personal.
- Validación de datos del lado del servidor.
- HTTPS.
- Registro de actividades.
- Sistema de recuperación de cuentas.

---

# Objetivo del proyecto

El objetivo principal de la aplicación es crear una plataforma institucional que reúna diferentes servicios escolares en un único sistema.

La aplicación busca facilitar:

- La comunicación institucional.
- La consulta académica.
- La administración de usuarios.
- La orientación dentro del campus.
- El acceso a servicios.
- La consulta de notificaciones.
- La gestión de emergencias.
- La comunicación comunitaria.

---

# Conclusión

La Intranet Escolar es una aplicación modular desarrollada con React y TypeScript que integra diferentes funcionalidades dentro de una misma plataforma.

La estructura del proyecto permite separar las funcionalidades por módulos, reutilizar componentes y mantener un sistema organizado.

El proyecto también incorpora autenticación por roles, navegación protegida, búsqueda, notificaciones, almacenamiento local, pruebas automatizadas y herramientas de validación.

Como prototipo, permite demostrar el funcionamiento de una intranet escolar completa utilizando datos ficticios y una arquitectura preparada para continuar creciendo.

---

# Autor

**Yubran Lopez Martinez**

# Proyecto

**Intranet Escolar — Colegio Horizonte**

# Año

**2026**
