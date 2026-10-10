# Spotify Import - Plano de desenvolvimento

## Objetivo

Importar metadados de uma playlist do Spotify usando API oficial.

## Escopo

- Aceitar URL ou ID da playlist.
- Usar OAuth Authorization Code with PKCE no navegador ou backend minimo documentado.
- Importar titulo, artista, album, duracao e URL Spotify.
- Nunca commitar tokens.

## Fora de escopo

- Baixar audio.
- Tentar acessar letras pelo Spotify.
- Scraping.

## Prova esperada

- Fixture JSON anonima em `fixtures/spotify-playlist.sample.json`.
- Harness que converte fixture para o modelo `Song`.
- Teste manual documentado com playlist do proprio usuario.

## Implementado em 2026-10-10

- OAuth PKCE client-side em `src/features/spotify/spotify.service.js`.
- Parser de playlist ID em `src/features/spotify/spotify.model.js`.
- Importacao paginada de faixas via endpoint oficial `playlists/{id}/tracks`.
- Fixture e harness sem rede.

## Como usar no app

1. Crie um app no painel Spotify Developer.
2. Configure como Redirect URI exatamente o valor mostrado no app.
3. Cole o Client ID.
4. Clique em `Conectar`, aceite no Spotify e volte.
5. Clique em `Finalizar login`.
6. Clique em `Importar playlist`.
