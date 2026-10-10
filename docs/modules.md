# Modulos

## `src/core`

Primitivas pequenas compartilhadas. Hoje contem o store observavel usado pelos modulos.

## `src/features/catalog`

Modulo principal do MVP.

- `catalog.model.js`: enums, defaults e normalizacao.
- `catalog.store.js`: estado mutavel encapsulado.
- `catalog.query.js`: seletores e filtros.
- `catalog.service.js`: comandos, persistencia e import/export.
- `catalog.view.js`: renderizacao e eventos da UI.

## `scripts`

Harness sem dependencias externas:

- `verify.mjs`: checa arquivos obrigatorios, limites basicos e politica contra letras completas.
- `harness.mjs`: exercita o modulo de catalogo em Node.
- `dev-server.mjs`: servidor estatico local.
- `build.mjs`: copia artefatos estaticos para `dist/`.
