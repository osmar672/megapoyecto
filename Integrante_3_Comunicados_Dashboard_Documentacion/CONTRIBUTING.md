# Guía de contribución

## Flujo de ramas

El desarrollo se integra mediante pull requests. La secuencia prevista es:

1. Integrar `feature/foundation-auth-users` en `main`.
2. Actualizar `main` con `git pull --ff-only`.
3. Crear `feature/academic-module` y `feature/communications-docs` desde el mismo
   punto aprobado.
4. Integrar primero el módulo académico.
5. Integrar después comunicados, panel y documentación.
6. Crear `integration/final-validation` para la revisión final.

> Está prohibido hacer push directo o force push a `main`.

## Nombres de ramas

Use nombres breves y descriptivos:

```text
feature/foundation-auth-users
feature/academic-module
feature/communications-docs
integration/final-validation
fix/descripcion-corta
```

## Commits convencionales

Los commits deben ser pequeños y explicar una sola intención. Ejemplos:

```text
feat: implement audience based announcements
feat: add role specific dashboard
test: cover communication permissions
docs: add complete project documentation
fix: preserve announcement creation timestamp
```

Prefijos recomendados: `feat`, `fix`, `test`, `docs`, `refactor` y `chore`.

## Pull requests

Cada pull request debe incluir:

- Resumen del cambio.
- Archivos principales modificados.
- Pasos de validación.
- Resultados reales de lint, pruebas, build y Markdown.
- Riesgos o dependencias pendientes.
- Confirmación de que no se modificaron archivos propiedad de otro integrante.

### Descripción sugerida

```markdown
## Resumen
Implementa comunicados por audiencia y panel por rol.

## Validación
- npm run lint
- npm run test
- npm run build
- npm run lint:md

## Dependencias
La matriz final se actualiza después de integrar el módulo académico.
```

## Revisión

La persona revisora debe comprobar:

- [ ] No hay roles, rutas, modelos ni claves de almacenamiento duplicadas.
- [ ] Las autorizaciones se aplican antes de modificar datos.
- [ ] El panel no expone información académica de otro estudiante.
- [ ] Los componentes son navegables con teclado y el foco es visible.
- [ ] Las pruebas nuevas cubren permisos y estados vacíos.
- [ ] La documentación describe únicamente comportamiento comprobable.

## Resolución de conflictos

1. Actualice la rama con el último `main` aprobado.
2. Identifique el propietario del archivo en conflicto.
3. No reemplace cambios de otro integrante para resolver un problema local.
4. Preserve los contratos de tipos, rutas y almacenamiento.
5. Ejecute nuevamente las verificaciones después de resolver el conflicto.
6. Documente en el pull request cualquier decisión que cambie el comportamiento.

## Definición de terminado

Un cambio se considera terminado cuando:

- [ ] El código compila sin errores de TypeScript.
- [ ] `npm run lint` termina sin errores.
- [ ] `npm run test` aprueba todas las pruebas.
- [ ] `npm run build` genera el build correctamente.
- [ ] `npm run lint:md` valida los documentos Markdown.
- [ ] No existen datos reales, secretos, `any`, `@ts-ignore` ni enlaces rotos.
- [ ] Se verificaron los permisos de los tres roles.
- [ ] El pull request tiene una descripción reproducible.

---

*La revisión protege la integración del equipo; no debe utilizarse para introducir
cambios de alcance que pertenecen a otra rama.*
