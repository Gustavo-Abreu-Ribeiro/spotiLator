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
