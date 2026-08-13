# PROMPT 2 — INTEGRANTE 2
## Módulo académico: calificaciones y asistencia

Actúa como un **desarrollador Front-End Senior especializado en sistemas de gestión académica**.

Formas parte del equipo responsable de desarrollar:

> **INTRANET ESCOLAR — Sistema de gestión interna para una institución pública**

Tu responsabilidad exclusiva será desarrollar el módulo académico.

## 1. Responsabilidades

Implementar:

- Registro de calificaciones.
- Consulta de calificaciones.
- Edición de calificaciones.
- Control de asistencia.
- Consulta de asistencia.
- Filtros.
- Búsqueda.
- Estadísticas académicas.
- Control de acceso por roles.

Archivo principal:

```text
js/academico.js
```

## 2. Tecnologías

Utilizar únicamente:

- HTML5.
- CSS3.
- JavaScript ES6+.
- LocalStorage.
- Font Awesome CDN.
- Chart.js opcional.

No utilizar frameworks.

## 3. Variables compartidas

Utilizar exactamente:

```javascript
usuarios
usuarioActual
rolActual
calificaciones
asistencias
idUsuario
idEstudiante
idDocente
```

No cambiar los nombres.

## 4. Estructura de calificación

Utilizar:

```javascript
{
    idCalificacion: 1,
    idEstudiante: 3,
    idDocente: 2,
    materia: "Matemáticas",
    periodo: "Primer periodo",
    nota: 85,
    fecha: "2026-08-13"
}
```

## 5. Estructura de asistencia

Utilizar:

```javascript
{
    idAsistencia: 1,
    idEstudiante: 3,
    idDocente: 2,
    materia: "Matemáticas",
    fecha: "2026-08-13",
    estado: "presente"
}
```

Estados:

```text
presente
ausente
tardanza
justificada
```

## 6. LocalStorage

Utilizar exclusivamente:

```text
calificaciones
asistencias
```

Ejemplo:

```javascript
const calificaciones =
    JSON.parse(localStorage.getItem("calificaciones")) || [];
```

## 7. Permisos

### Administración

Acceso completo al módulo.

### Docente

Puede:

- Registrar calificaciones.
- Editar sus calificaciones.
- Registrar asistencia.
- Editar asistencia correspondiente.

### Estudiante

Solo puede consultar sus propios datos.

### Familia

Solo puede consultar información académica autorizada.

## 8. Filtrado de información

Para estudiantes utilizar:

```javascript
usuarioActual.idUsuario
```

y compararlo con:

```javascript
idEstudiante
```

Para docentes utilizar:

```javascript
usuarioActual.idUsuario
```

y compararlo con:

```javascript
idDocente
```

Nunca mostrar información académica de usuarios no autorizados.

## 9. Validaciones

Las notas deben estar entre:

```text
0 y 100
```

Validar:

- Estudiante.
- Docente.
- Materia.
- Periodo.
- Nota.
- Fecha.

No permitir datos incompletos.

## 10. Interfaz

Crear:

### Calificaciones

- Tabla.
- Formulario.
- Búsqueda.
- Filtros.
- Editar.
- Eliminar/corregir.
- Mensajes de estado.

### Asistencia

- Tabla.
- Fecha.
- Estudiante.
- Materia.
- Estado.
- Filtros.
- Resumen.

## 11. Iconografía

Utilizar exclusivamente **Font Awesome**.

No utilizar emojis, stickers ni caracteres Unicode como iconos.

Ejemplos:

```html
<i class="fa-solid fa-star"></i>
<i class="fa-solid fa-user-check"></i>
<i class="fa-solid fa-pen-to-square"></i>
<i class="fa-solid fa-trash"></i>
<i class="fa-solid fa-plus"></i>
<i class="fa-solid fa-floppy-disk"></i>
<i class="fa-solid fa-magnifying-glass"></i>
```

Para acciones importantes, acompañar el icono con texto:

```html
<button type="button">
    <i class="fa-solid fa-plus" aria-hidden="true"></i>
    Registrar calificación
</button>
```

No crear una segunda convención de iconos.

## 12. Estadísticas

Mostrar:

- Promedio.
- Cantidad de materias.
- Asistencias.
- Ausencias.
- Tardanzas.
- Porcentaje de asistencia.

Chart.js únicamente si mejora realmente la comprensión de los datos.

## 13. Integración

No cambiar:

```javascript
usuarios
usuarioActual
rolActual
sesionActiva
```

No modificar:

```text
auth.js
usuarios.js
```

salvo que exista una necesidad técnica previamente acordada.

## 14. Git

Rama:

```text
feature/modulo-academico
```

Commits:

```text
feat: crear modelo de calificaciones
feat: implementar registro de calificaciones
feat: implementar consulta de calificaciones
feat: implementar control de asistencia
feat: agregar filtros academicos
feat: agregar estadisticas
fix: corregir validacion de notas
```

## 15. Criterios de aceptación

- [ ] Registro de calificaciones.
- [ ] Consulta de calificaciones.
- [ ] Edición.
- [ ] Asistencia.
- [ ] Filtros.
- [ ] Validaciones.
- [ ] Permisos por rol.
- [ ] LocalStorage.
- [ ] Estadísticas.
- [ ] Font Awesome.
- [ ] Sin emojis ni stickers.
- [ ] Responsive.
- [ ] Accesible.
- [ ] Sin errores de consola.
- [ ] Compatible con los módulos restantes.
