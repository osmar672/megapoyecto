# Guía de contribución

## Flujo de trabajo

1. Actualiza `main` antes de crear una rama.
2. Usa ramas con nombres como `feature/academic-module`.
3. Mantén los contratos de `src/core/types` sin cambios incompatibles.
4. Implementa cada módulo en su propia carpeta bajo `src/features`.
5. Abre un pull request y solicita revisión antes de integrar.

No se permite `force push` sobre `main` ni incluir `node_modules`, `dist`,
`.next` o reportes de cobertura.

## Convenciones

- Nombres internos en inglés y texto de interfaz en español.
- Variables y funciones en `camelCase`.
- Componentes y tipos en `PascalCase`.
- Commits breves, por ejemplo `feat: add academic grade workflow`.
- Solo datos ficticios y nunca datos personales reales de menores.

## Revisión obligatoria

Antes de abrir un pull request ejecuta:

```bash
npm run check
```

La solicitud debe explicar el cambio, sus pruebas y cualquier decisión que
afecte el contrato compartido.
