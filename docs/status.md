# Status

Data: 2026-10-10

## Estado atual

MVP local-first criado. O app roda como site estatico, persiste dados em `localStorage` e possui harness executavel por `npm test`.

Foi adicionada importacao Spotify via OAuth PKCE no navegador e busca assistida de traducoes por fontes ranqueadas.

## Gates atuais

- Documentacao minima: pronta.
- Harness: pronto.
- Integracao Spotify real: implementada por contrato client-side; exige Client ID do app Spotify no navegador.
- Politica de copyright: definida; UI usa links/buscas e nao copia letras completas.

## Riscos

- Letras/traducoes completas nao podem ser coletadas automaticamente sem licenca.
- APIs de letra costumam ter termos restritivos; cada adaptador precisa de decisao documentada.
- Spotify exige OAuth e Redirect URI configurada no painel do app Spotify.
