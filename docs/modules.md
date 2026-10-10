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

## `src/features/spotify`

Importacao oficial de metadados da playlist.

- `spotify.model.js`: parser de playlist ID, mapper de faixa e formatacao.
- `spotify.service.js`: OAuth PKCE, troca de token e busca paginada.

## `src/features/sources`

Busca assistida de traducao sem scraping.

- `translation-sources.model.js`: provedores, ranking e links de busca.

## `scripts`

Harness sem dependencias externas:

- `verify.mjs`: checa arquivos obrigatorios, limites basicos e politica contra letras completas.
- `harness.mjs`: exercita o modulo de catalogo em Node.
- `dev-server.mjs`: servidor estatico local.
- `build.mjs`: copia artefatos estaticos para `dist/`.
