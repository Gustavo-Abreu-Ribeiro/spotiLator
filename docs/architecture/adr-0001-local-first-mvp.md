# ADR-0001 - MVP local-first antes de integracoes

Data: 2026-10-10

## Decisao

O primeiro MVP sera um web app estatico com persistencia em `localStorage`.

## Motivo

O usuario precisa revisar e organizar musicas agora, mas integracoes Spotify/letras exigem OAuth, provedores e cuidado com direitos autorais. Um MVP local-first evita bloquear o produto em credenciais externas.

## Consequencias

- Funciona sem backend.
- Importacao Spotify real fica em `docs/development/spotify-import.md`.
- Dados podem ser exportados como JSON.
