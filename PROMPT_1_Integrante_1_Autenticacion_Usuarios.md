# PROMPT 1 — INTEGRANTE 1
## Arquitectura general, autenticación y gestión de usuarios

Actúa como un **desarrollador Front-End Senior y arquitecto de software** especializado en aplicaciones web institucionales.

Formas parte de un equipo de 3 desarrolladores que está construyendo el proyecto final:

> **INTRANET ESCOLAR — Sistema de gestión interna para una institución pública**

El sistema debe ser moderno, profesional, responsive, accesible, modular y completamente funcional en el navegador.

## 1. Objetivo principal

Tu responsabilidad será desarrollar la **base principal de la aplicación**, incluyendo:

- Arquitectura inicial.
- Estructura HTML.
- Diseño general.
- Login.
- Autenticación.
- Control de sesión.
- Autenticación por roles.
- Gestión de usuarios.
- Dashboard.
- Navegación principal.
- Control de acceso.
- Sistema visual compartido.

Tu código será utilizado por los otros dos integrantes, por lo que debes crear una base **estable, modular y fácil de integrar**.

## 2. Tecnologías obligatorias

Utiliza exclusivamente:

- HTML5.
- CSS3.
- JavaScript ES6+.
- LocalStorage.
- Font Awesome mediante CDN.
- Chart.js únicamente si es realmente necesario.

### Tecnologías prohibidas

No utilizar:

- React.
- Angular.
- Vue.
- Svelte.
- Node.js.
- Express.
- Bootstrap.
- Tailwind.
- jQuery.
- TypeScript.
- Firebase.
- Bases de datos externas.
- Frameworks CSS.
- Librerías externas innecesarias.

El proyecto debe funcionar directamente desde el navegador.

## 3. Estructura del proyecto

Respeta esta estructura:

```text
intranet-escolar/
│
├── index.html
├── styles.css
├── app.js
│
├── js/
│   ├── auth.js
│   ├── usuarios.js
│   ├── academico.js
│   ├── comunicados.js
│   ├── calendario.js
│   └── recursos.js
│
├── assets/
│   ├── img/
│   └── icons/
│
├── docs/
│   ├── arquitectura.md
│   └── requerimientos.md
│
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── AGENTS.md
└── LICENSE
```

Tus archivos principales serán:

```text
index.html
styles.css
app.js
js/auth.js
js/usuarios.js
```

No modificar innecesariamente los archivos pertenecientes a los otros integrantes.

## 4. Convención obligatoria de nombres

Todo el equipo utilizará exactamente los mismos nombres.

### Variables principales

```javascript
usuarios
usuarioActual
rolActual
sesionActiva
calificaciones
asistencias
comunicados
actividades
recursos
```

### Identificadores

```javascript
idUsuario
idEstudiante
idDocente
idCalificacion
idAsistencia
idComunicado
idActividad
idRecurso
```

No cambiar estos nombres por variantes como `users`, `currentUser`, `currentRole`, `grades` o `attendance`.

## 5. Roles oficiales

Utilizar exclusivamente:

```text
administracion
docente
estudiante
familia
```

No crear variantes como `admin`, `profesor`, `alumno` o `padres`.

## 6. Modelo de usuario

Todos los usuarios deberán utilizar esta estructura:

```javascript
{
    idUsuario: 1,
    nombre: "Carlos",
    apellido: "Rodríguez",
    identificacion: "12345678",
    correo: "usuario@escuela.edu",
    password: "123456",
    rol: "docente",
    activo: true
}
```

## 7. LocalStorage

Las claves oficiales del proyecto son:

```text
usuarios
usuarioActual
rolActual
sesionActiva
calificaciones
asistencias
comunicados
actividades
recursos
```

No cambiar los nombres.

Crear funciones reutilizables para guardar y recuperar información.

Ejemplo:

```javascript
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}
```

## 8. Login

Crear una pantalla profesional de inicio de sesión con:

- Logo institucional.
- Nombre de la institución.
- Campo de correo o identificación.
- Campo de contraseña.
- Mostrar/ocultar contraseña.
- Recordar usuario.
- Recuperar contraseña.
- Botón de iniciar sesión.
- Validación.
- Mensajes de error.
- Diseño responsive.

El usuario debe poder ingresar utilizando su correo o identificación.

## 9. Usuarios de prueba

Crear usuarios automáticamente cuando LocalStorage esté vacío.

Debe existir al menos:

```text
admin@escuela.edu
docente@escuela.edu
estudiante@escuela.edu
familia@escuela.edu
```

Cada uno debe representar un rol diferente.

## 10. Sistema de roles

### Administración

Puede:

- Gestionar usuarios.
- Consultar calificaciones.
- Consultar asistencia.
- Gestionar comunicados.
- Consultar calendario.
- Gestionar recursos.

### Docente

Puede:

- Gestionar calificaciones.
- Gestionar asistencia.
- Consultar comunicados.
- Consultar calendario.
- Gestionar recursos.

### Estudiante

Puede:

- Consultar sus calificaciones.
- Consultar su asistencia.
- Consultar comunicados.
- Consultar calendario.
- Consultar recursos.

### Familia

Puede:

- Consultar información académica asociada.
- Consultar comunicados.
- Consultar calendario.
- Consultar recursos autorizados.

## 11. Gestión de usuarios

Administración debe poder:

- Crear usuarios.
- Editar usuarios.
- Desactivar usuarios.
- Buscar usuarios.
- Filtrar por rol.
- Consultar usuarios activos e inactivos.

Preferir:

```javascript
activo: false
```

en lugar de eliminar usuarios físicamente.

## 12. Dashboard

Crear un dashboard institucional con:

- Resumen general.
- Estadísticas.
- Accesos rápidos.
- Actividad reciente.
- Navegación hacia los módulos.

Los datos mostrados deben cambiar dependiendo del rol.

## 13. Iconografía obligatoria

La aplicación debe utilizar **Font Awesome mediante CDN exclusivamente para los iconos**.

No utilizar:

- Emojis.
- Stickers.
- Caracteres Unicode como iconos.
- Imágenes improvisadas.
- Otras librerías de iconos.

### Prohibido

```text
😀
📚
📊
🔔
👤
🏠
⚙️
✓
✕
```

### Permitido

```html
<i class="fa-solid fa-house"></i>
<i class="fa-solid fa-user"></i>
<i class="fa-solid fa-users"></i>
<i class="fa-solid fa-graduation-cap"></i>
<i class="fa-solid fa-book"></i>
<i class="fa-solid fa-calendar-days"></i>
<i class="fa-solid fa-bell"></i>
<i class="fa-solid fa-chart-line"></i>
<i class="fa-solid fa-gear"></i>
<i class="fa-solid fa-right-from-bracket"></i>
```

Agregar Font Awesome mediante CDN:

```html
<link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
>
```

## 14. Convención visual de iconos

| Función | Icono |
|---|---|
| Inicio | `fa-house` |
| Usuarios | `fa-users` |
| Perfil | `fa-user` |
| Docentes | `fa-chalkboard-user` |
| Estudiantes | `fa-graduation-cap` |
| Calificaciones | `fa-star` |
| Asistencia | `fa-user-check` |
| Comunicados | `fa-bullhorn` |
| Calendario | `fa-calendar-days` |
| Recursos | `fa-folder-open` |
| Tareas | `fa-clipboard-list` |
| Buscar | `fa-magnifying-glass` |
| Editar | `fa-pen-to-square` |
| Eliminar | `fa-trash` |
| Agregar | `fa-plus` |
| Guardar | `fa-floppy-disk` |
| Configuración | `fa-gear` |
| Cerrar sesión | `fa-right-from-bracket` |

No utilizar diferentes iconos para la misma acción.

## 15. Accesibilidad

Los iconos no deben ser la única forma de comunicar una acción importante.

Correcto:

```html
<button type="button">
    <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
    Agregar usuario
</button>
```

Para botones únicamente visuales:

```html
<button type="button" aria-label="Editar usuario">
    <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
</button>
```

## 16. Seguridad y privacidad

Aunque LocalStorage se utiliza por las restricciones académicas:

- No mostrar contraseñas.
- No imprimir contraseñas en consola.
- No exponer información personal innecesaria.
- No utilizar datos reales.
- Controlar el acceso por rol.
- Validar formularios.
- Documentar que LocalStorage no es adecuado para información sensible en producción.

## 17. Integración

Los demás integrantes dependerán de:

```javascript
usuarios
usuarioActual
rolActual
sesionActiva
```

No cambiar sus nombres.

No implementar dentro de tus archivos:

- Calificaciones.
- Asistencia.
- Comunicados.
- Calendario.
- Recursos.

## 18. Git

Utiliza:

```text
feature/autenticacion-usuarios
```

Commits recomendados:

```text
feat: crear estructura base
feat: implementar login
feat: implementar autenticacion por roles
feat: implementar gestion de usuarios
feat: implementar control de sesion
feat: crear dashboard
fix: corregir validacion del login
```

No realizar un único commit para todo el proyecto.

## 19. Criterios de aceptación

- [ ] Login funcional.
- [ ] Cierre de sesión funcional.
- [ ] Persistencia de sesión.
- [ ] Cuatro roles funcionando.
- [ ] Navegación dinámica.
- [ ] Gestión de usuarios.
- [ ] Usuarios activos/inactivos.
- [ ] Dashboard funcional.
- [ ] Responsive.
- [ ] Accesible.
- [ ] Font Awesome funcionando.
- [ ] Sin emojis ni stickers.
- [ ] Sin errores en consola.
- [ ] Variables compartidas compatibles.
- [ ] Código modular.
