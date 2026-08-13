# PROMPT 3 — INTEGRANTE 3
## Comunicados, calendario, recursos y documentación técnica

Actúa como un **desarrollador Front-End Senior, especialista en documentación técnica, UX y Git/GitHub**.

Formas parte del equipo que desarrolla:

> **INTRANET ESCOLAR — Sistema de gestión interna para una institución pública**

Tu responsabilidad será implementar los módulos de comunicación y recursos, además de desarrollar la documentación Markdown requerida para la evaluación.

## 1. Módulos funcionales

Debes desarrollar:

- Tablón de comunicados.
- Avisos oficiales.
- Calendario.
- Actividades.
- Exámenes.
- Recursos educativos.
- Materiales.
- Tareas.

Archivos:

```text
js/comunicados.js
js/calendario.js
js/recursos.js
```

## 2. Variables oficiales

Utilizar exactamente:

```javascript
usuarios
usuarioActual
rolActual
comunicados
actividades
recursos
idUsuario
idComunicado
idActividad
idRecurso
```

No cambiar estos nombres.

## 3. Comunicados

Utilizar:

```javascript
{
    idComunicado: 1,
    titulo: "Reunión de padres",
    contenido: "Se informa a las familias...",
    autor: "Administración",
    idUsuario: 1,
    fecha: "2026-08-13",
    prioridad: "normal",
    publicado: true
}
```

Prioridades:

```text
normal
importante
urgente
```

Administración podrá:

- Crear.
- Editar.
- Publicar.
- Despublicar.
- Consultar.

Los demás usuarios solamente podrán consultar comunicados autorizados.

## 4. Calendario

Utilizar:

```javascript
{
    idActividad: 1,
    titulo: "Examen de Matemáticas",
    descripcion: "Examen del primer periodo",
    fecha: "2026-08-20",
    hora: "09:00",
    tipo: "examen"
}
```

Tipos:

```text
actividad
examen
reunion
feriado
otro
```

Debe permitir:

- Consultar.
- Buscar.
- Filtrar.
- Visualizar próximas actividades.
- Mostrar fecha y hora.

## 5. Recursos

Utilizar:

```javascript
{
    idRecurso: 1,
    titulo: "Guía de Matemáticas",
    descripcion: "Material del primer periodo",
    tipo: "documento",
    url: "#",
    idUsuario: 2,
    fecha: "2026-08-13"
}
```

Tipos:

```text
documento
tarea
enlace
material
```

## 6. LocalStorage

Utilizar exactamente:

```text
comunicados
actividades
recursos
```

Ejemplo:

```javascript
const comunicados =
    JSON.parse(localStorage.getItem("comunicados")) || [];
```

## 7. Control por roles

### Administración

Puede gestionar:

- Comunicados.
- Actividades.
- Recursos.

### Docente

Puede:

- Crear recursos.
- Consultar comunicados.
- Consultar calendario.
- Crear actividades cuando corresponda.

### Estudiante

Puede:

- Consultar comunicados.
- Consultar calendario.
- Consultar recursos.
- Consultar tareas.

### Familia

Puede:

- Consultar comunicados.
- Consultar calendario.
- Consultar recursos autorizados.

## 8. Iconografía obligatoria

Utilizar **Font Awesome mediante CDN exclusivamente**.

Está prohibido utilizar:

- Emojis.
- Stickers.
- Caracteres Unicode como iconos.
- Iconos de otras librerías.

Ejemplos:

```html
<i class="fa-solid fa-bullhorn"></i>
<i class="fa-solid fa-calendar-days"></i>
<i class="fa-solid fa-folder-open"></i>
<i class="fa-solid fa-clipboard-list"></i>
<i class="fa-solid fa-bell"></i>
<i class="fa-solid fa-plus"></i>
<i class="fa-solid fa-pen-to-square"></i>
<i class="fa-solid fa-trash"></i>
```

Utilizar siempre la misma convención visual que los demás integrantes.

## 9. Accesibilidad de iconos

Los iconos decorativos deben utilizar:

```html
aria-hidden="true"
```

Ejemplo:

```html
<button type="button">
    <i class="fa-solid fa-bullhorn" aria-hidden="true"></i>
    Nuevo comunicado
</button>
```

Los botones únicamente visuales deben tener:

```html
aria-label="Editar comunicado"
```

## 10. Documentación obligatoria

Crear o completar:

```text
README.md
CONTRIBUTING.md
CHANGELOG.md
docs/arquitectura.md
docs/requerimientos.md
AGENTS.md
```

## 11. README.md

Debe incluir:

- Nombre del proyecto.
- Descripción.
- Objetivo.
- Funcionalidades.
- Tecnologías.
- Requisitos.
- Instalación.
- Ejecución.
- Usuarios de prueba.
- Estructura.
- Ejemplo de uso.
- Licencia.

## 12. CONTRIBUTING.md

Documentar:

- Flujo Git.
- Ramas.
- Commits.
- Pull Requests.
- Revisiones.
- Resolución de conflictos.

Convención:

```text
feature/nombre
fix/nombre
docs/nombre
```

Commits:

```text
feat:
fix:
docs:
style:
refactor:
test:
```

## 13. CHANGELOG.md

Utilizar:

```markdown
## [0.1.0] - 2026-08-13
```

Registrar cambios importantes y versiones.

## 14. docs/arquitectura.md

Documentar:

- Arquitectura.
- Stack tecnológico.
- Estructura.
- Módulos.
- Roles.
- LocalStorage.
- Flujo de información.
- Convenciones.
- Decisiones técnicas.

Agregar un diagrama Mermaid cuando sea apropiado.

## 15. docs/requerimientos.md

Representar los requerimientos mediante listas de tareas:

```markdown
- [x] Autenticación por roles
- [x] Gestión de usuarios
- [ ] Registro de calificaciones
- [ ] Control de asistencia
- [ ] Tablón de comunicados
- [ ] Calendario
- [ ] Recursos
```

Actualizar el estado conforme avance el proyecto.

## 16. AGENTS.md

Debe contener exactamente las siete secciones:

```markdown
# AGENTS.md — Memoria del proyecto

## Contexto

## Requerimientos

## Reglas

## Restricciones

## Objetivos

## Memoria del proyecto

## Buenas prácticas
```

Debe explicar claramente:

- Qué es el proyecto.
- Qué tecnologías utiliza.
- Cómo está estructurado.
- Convención de nombres.
- Convención de LocalStorage.
- Roles.
- Restricciones.
- Buenas prácticas.
- Decisiones técnicas.
- Reglas para futuros desarrolladores o agentes de IA.

## 17. Markdown

La documentación debe demostrar correctamente:

- Encabezados.
- Negrita.
- Cursiva.
- Listas.
- Listas ordenadas.
- Checklists.
- Tablas.
- Enlaces.
- Imágenes con texto alternativo.
- Citas.
- Separadores.
- Bloques de código.
- Mermaid.

Ejemplo:

```markdown
![Dashboard de la intranet](assets/img/dashboard.png)
```

## 18. Privacidad

Documentar que:

> Este proyecto es un prototipo académico. LocalStorage se utiliza únicamente para demostración y no debe utilizarse para almacenar información sensible real de estudiantes, familias o personal.

No utilizar datos personales reales.

## 19. Git

Rama:

```text
feature/comunicados-documentacion
```

Commits recomendados:

```text
feat: implementar tablero de comunicados
feat: implementar calendario
feat: implementar recursos
docs: crear README
docs: documentar arquitectura
docs: documentar requerimientos
docs: crear AGENTS
docs: crear CONTRIBUTING
docs: crear CHANGELOG
```

## 20. Criterios de aceptación

- [ ] Comunicados funcionales.
- [ ] Publicación/despublicación.
- [ ] Calendario funcional.
- [ ] Recursos funcionales.
- [ ] Control por roles.
- [ ] LocalStorage funcionando.
- [ ] Font Awesome funcionando.
- [ ] Sin emojis ni stickers.
- [ ] Diseño consistente.
- [ ] README completo.
- [ ] CONTRIBUTING completo.
- [ ] CHANGELOG completo.
- [ ] arquitectura.md completo.
- [ ] requerimientos.md completo.
- [ ] AGENTS.md con las 7 secciones.
- [ ] Markdown correctamente estructurado.
- [ ] Sin errores en consola.
- [ ] Documentación coherente con el código real.
