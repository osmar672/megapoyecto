# Intranet Escolar

Prototipo funcional de intranet escolar con autenticación por roles, calificaciones, asistencia, comunicados y gestión básica de usuarios.

## Tecnologías del prototipo
- HTML5
- CSS3
- JavaScript
- localStorage y sessionStorage
- Font Awesome/CDN para iconos

## Accesos de prueba
- Administración: `admin@escuela.test` / `admin123`
- Docente: `docente@escuela.test` / `docente123`
- Estudiante/Familia: `familia@escuela.test` / `familia123`

## Roles
- `ADMIN`: administración completa del prototipo.
- `TEACHER`: acceso académico limitado a sus cursos.
- `STUDENT_FAMILY`: consulta únicamente la información del estudiante relacionado.

## Claves de almacenamiento
Se utilizan las claves requeridas por el documento del proyecto:
`schoolIntranet.v1.users`, `schoolIntranet.v1.credentials`, `schoolIntranet.v1.students`,
`schoolIntranet.v1.courses`, `schoolIntranet.v1.enrollments`, `schoolIntranet.v1.grades`,
`schoolIntranet.v1.attendance`, `schoolIntranet.v1.announcements` y `schoolIntranet.v1.session`.

## Ejecución
Abrir `page/index.html` con Live Server o un servidor HTTP local.

> Los datos son ficticios y están destinados únicamente al prototipo. No se deben almacenar datos reales de menores.
